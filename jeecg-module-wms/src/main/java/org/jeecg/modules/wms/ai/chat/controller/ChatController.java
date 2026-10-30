package org.jeecg.modules.wms.ai.chat.controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.jeecg.common.system.api.ISysBaseAPI;
import org.jeecg.common.system.util.JwtUtil;
import org.jeecg.common.util.*;
import org.jeecg.modules.airag.app.entity.AiragApp;
import org.jeecg.modules.airag.app.service.IAiragAppService;
import org.jeecg.modules.airag.app.vo.ChatSendParams;
import org.jeecg.modules.wms.ai.chat.tools.WmsInventoryTools;
import org.jeecg.modules.wms.ai.chat.util.VectorDistanceUtils;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.QuestionAnswerAdvisor;
import org.springframework.ai.document.Document;
import org.springframework.ai.openai.OpenAiEmbeddingModel;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import reactor.core.publisher.Flux;

import java.io.IOException;
import java.util.*;
import java.util.concurrent.atomic.AtomicBoolean;

import static org.springframework.ai.chat.client.advisor.AbstractChatMemoryAdvisor.CHAT_MEMORY_CONVERSATION_ID_KEY;

@RequiredArgsConstructor
@RestController
@RequestMapping("/ai")
public class ChatController {

    @Autowired
    private WmsInventoryTools wmsInventoryTools;

    @Resource(name = "chatClientOpenAi") //使用openai
//    @Resource(name = "chatClientOllama") //使用ollama
    public ChatClient chatClient;
    @Autowired
    private VectorStore pgVectorStore;

    // 请求方式和路径不要改动，将来要与前端联调
    @RequestMapping(value = "/chat",produces = "text/html;charset=UTF-8")
    public Flux<String> chat(String prompt) {
        return chatClient
                .prompt(prompt) // 传入user提示词
                .stream()
//                .call() // 同步请求，会等待AI全部输出完才返回结果
                .content(); //返回响应内容
    }

    @Autowired
    private RedisUtil redisUtil;

    @Autowired
    private ISysBaseAPI sysBaseApi;


    private String getUsername(HttpServletRequest httpRequest) {
        try {
            TokenUtils.getTokenByRequest();
            String token;
            if(null != httpRequest){
                token = TokenUtils.getTokenByRequest(httpRequest);
            }else{
                token = TokenUtils.getTokenByRequest();
            }
            if (TokenUtils.verifyToken(token, sysBaseApi, redisUtil)) {
                return JwtUtil.getUsername(token);
            }
        } catch (Exception e) {
            return null;
        }
        return null;
    }

    @Autowired
    private IAiragAppService airagAppService;
    @RequestMapping(value = "/chat/send")
    public SseEmitter send(@RequestBody ChatSendParams chatSendParams, HttpServletRequest httpRequest) {
        AssertUtils.assertNotEmpty("参数异常", chatSendParams);
        String userMessage = chatSendParams.getContent();
        AssertUtils.assertNotEmpty("至少发送一条消息", userMessage);

        //获取当前用户
        String username = getUsername(httpRequest);
        chatSendParams.setUsername( username);
        // 获取会话信息
        String conversationId = chatSendParams.getConversationId();
        String topicId = oConvertUtils.getString(chatSendParams.getTopicId(), UUIDGenerator.generate());
        chatSendParams.setTopicId(topicId);

        // 每次会话都生成一个新的,用来缓存emitter
        String requestId = UUIDGenerator.generate();

        SseEmitter emitter = new SseEmitter(-0L);
            // 发送初始思考提示消息
        try {
            // 发送 "> " 消息
            sendMessage(emitter, conversationId, topicId, requestId, "> ","MESSAGE");

            // 发送 "\n> " 消息
            sendMessage(emitter, conversationId, topicId, requestId, "\n> ","MESSAGE");

        } catch (IOException e) {
            emitter.completeWithError(e);
            return emitter;
        }

        Flux<String> flux = null;

        //准备传入参数
        String chatSendParamsJson = JSON.toJSONString(chatSendParams);
        // 获取app信息
        AiragApp app = null;
        if (oConvertUtils.isNotEmpty(chatSendParams.getAppId())) {
            app = airagAppService.getById(chatSendParams.getAppId());
        }

        if(app != null){
            //系统提示词
            String systemMessage = app.getPrompt();
            List<String> knowIds = app.getKnowIds();
            QuestionAnswerAdvisor questionAnswerAdvisor = getQuestionAnswerAdvisor(knowIds);
            if(knowIds != null && knowIds.size() > 0) {
                flux = chatClient
                        .prompt()
                        .user(chatSendParams.getContent())
                        .system(systemMessage)
                        .advisors(a -> a.param(CHAT_MEMORY_CONVERSATION_ID_KEY, chatSendParamsJson))
                        .advisors(questionAnswerAdvisor)
                        .tools(wmsInventoryTools)
                        .stream()
                        .content();
            }
        }else {
            flux = chatClient
                    .prompt()
                    .user(chatSendParams.getContent())
                    .advisors(a->a.param(CHAT_MEMORY_CONVERSATION_ID_KEY,chatSendParamsJson))
                    .stream()
                    .content();
        }


        /**
         * 是否正在思考
         */
        AtomicBoolean isThinking = new AtomicBoolean(false);
        flux.subscribe(
                data -> {
                    try {
                        // 兼容推理模型
                        if ("<think>".equals(data)) {
                            isThinking.set(true);
                            data = "> ";
                        }
                        if ("</think>".equals(data)) {
                            isThinking.set(false);
                            data = "\n\n";
                        }
                        if (isThinking.get()) {
                            if (null != data && data.contains("\n")) {
                                data = "\n> ";
                            }
                        }

                        sendMessage(emitter, conversationId, topicId, requestId, data,"MESSAGE");


                    } catch (IOException e) {
                        emitter.completeWithError(e);//将错误信息发送给客户端，并结束SSE连接。
                    }
                },
                error -> {
                    try {
                        // 错误响应
                        sendMessage(emitter, conversationId, topicId, requestId, error.getMessage(),"ERROR");
                        // 发送结束消息
                        sendEndMessage(emitter, conversationId, topicId, requestId);
                    } catch (IOException ioException) {
                        emitter.completeWithError(ioException);
                    }
                },
                () -> {
                    try {
                        // 发送结束消息两次
                        sendEndMessage(emitter, conversationId, topicId, requestId);
                        sendEndMessage(emitter, conversationId, topicId, requestId);
                    } catch (IOException e) {
                        emitter.completeWithError(e);
                    }
                }
        );

        return emitter;
    }

    /**
     * 获取questionAnswerAdvisor 对象
     * @param knowIds 知识库ids
     * @return
     */
    private QuestionAnswerAdvisor getQuestionAnswerAdvisor(List<String>  knowIds){
        StringBuffer expression = new StringBuffer();
        Iterator<String> iterator = knowIds.iterator();
//通过下边迭代器拼接字符串 最终拼接字符串为：knowledgeId == 'xx' || knowledgeId == 'yy || ...'
        while (iterator.hasNext()){
            String knowId = iterator.next();
            expression.append("knowledgeId == '" + knowId + "'");
            if(iterator.hasNext()){
                expression.append(" || ");
            }
        }

        QuestionAnswerAdvisor questionAnswerAdvisor = new QuestionAnswerAdvisor(
                pgVectorStore, // 向量库
                SearchRequest.builder() // 向量检索的请求参数
                        .similarityThreshold(0.4d) // 相似度阈值
                        .filterExpression(expression.toString())
                        .topK(2) // 返回的文档片段数量
                        .build()
        );
        return questionAnswerAdvisor;

    }



    // 辅助方法：向客户端发送消息
    private void sendMessage(SseEmitter emitter, String conversationId, String topicId,
                             String requestId, String message, String event) throws IOException {
        Map<String, Object> response = new HashMap<>();
        response.put("conversationId", conversationId);
        response.put("topicId", topicId);
        response.put("requestId", requestId);
        response.put("event", event);

        Map<String, Object> messageData = new HashMap<>();
        messageData.put("message", message);
        response.put("data", messageData);

        String jsonData =  JSONObject.toJSONString(response);
        emitter.send(SseEmitter.event().data(jsonData));
    }
    // 辅助方法：发送结束消息
    private void sendEndMessage(SseEmitter emitter, String conversationId, String topicId,
                                String requestId) throws IOException {
        Map<String, Object> endResponse = new HashMap<>();
        endResponse.put("event", "MESSAGE_END");
        endResponse.put("flowId", null);
        endResponse.put("requestId", requestId);
        endResponse.put("conversationId", conversationId);
        endResponse.put("topicId", topicId);
        endResponse.put("data", null);

        String endJson =  JSONObject.toJSONString(endResponse);
        emitter.send(SseEmitter.event().data(endJson));
    }

    @Resource
    private OpenAiEmbeddingModel openAiEmbeddingModel;

    @GetMapping(value = "/embedtest")
    public String embedtest(String query,String t1,String t2) throws IOException {
        StringBuilder sb = new StringBuilder();
        sb.append("query: "+ query);
        sb.append("</br>");
        // 先将查询文本向量化
        float[] queryVector = openAiEmbeddingModel.embed(query);
        sb.append("query向量: "+ arrayToString(queryVector));
        sb.append("</br>");
        sb.append("==================================");
        sb.append("</br>");
        sb.append("t1: "+ t1);
        sb.append("</br>");
        float[] embed1 = openAiEmbeddingModel.embed(t1);
        sb.append("t1向量: "+arrayToString(embed1));
        sb.append("</br>");
        sb.append("相似度,比较比较欧氏距离: "+  VectorDistanceUtils.euclideanDistance(queryVector, embed1));
        sb.append("</br>");
        sb.append("相似度,比较比较余弦距离: "+  VectorDistanceUtils.cosineDistance(queryVector, embed1));
        sb.append("</br>");
        sb.append("==================================");
        sb.append("</br>");
        sb.append("t2: "+ t2);
        sb.append("</br>");
        float[] embed2 = openAiEmbeddingModel.embed(t2);
        sb.append("t2向量: "+ arrayToString(embed2));
        sb.append("</br>");
        sb.append("相似度,比较比较欧氏距离: "+  VectorDistanceUtils.euclideanDistance(queryVector, embed2));
        sb.append("</br>");
        sb.append("相似度,比较比较余弦距离: "+  VectorDistanceUtils.cosineDistance(queryVector, embed2));

        Document document = new Document(t1);
        Document document2 = new Document(t2);
        ArrayList<Document> documentArrayList = new ArrayList<>();
        documentArrayList.add(document);
        documentArrayList.add(document2);
        pgVectorStore.add(documentArrayList);

        return sb.toString();
    }
    // 辅助方法：将float数组格式化为字符串
    private String arrayToString(float[] array) {
        if (array == null) return "null";
        if (array.length == 0) return "[]";

        StringBuilder sb = new StringBuilder();
        sb.append("[");

        // 限制显示长度，避免输出过长的向量
        int limit = Math.min(array.length, 10); // 只显示前10个元素
        for (int i = 0; i < limit; i++) {
            sb.append(String.format("%.6f", array[i]));
            if (i < limit - 1) {
                sb.append(", ");
            }
        }

        if (array.length > limit) {
            sb.append(", ... (").append(array.length).append(" dimensions)");
        }

        sb.append("]");
        return sb.toString();
    }
}
