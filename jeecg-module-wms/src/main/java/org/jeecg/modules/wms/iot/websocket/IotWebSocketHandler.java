package org.jeecg.modules.wms.iot.websocket;

import com.alibaba.fastjson.JSONObject;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

@Slf4j
public class IotWebSocketHandler extends TextWebSocketHandler {

    private static final Map<String, WebSocketSession> sessions = new ConcurrentHashMap<>();
    private static final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        String path = session.getUri().getPath();
        String userId = path.substring(path.lastIndexOf("/") + 1);
        sessions.put(userId, session);
        log.info("IoT WebSocket 连接建立，userId={}", userId);

        scheduler.scheduleAtFixedRate(() -> {
            if (session.isOpen()) {
                try {
                    JSONObject data = buildMockData();
                    session.sendMessage(new TextMessage(data.toJSONString()));
                } catch (IOException e) {
                    log.error("WebSocket 推送失败", e);
                }
            }
        }, 2, 5, TimeUnit.SECONDS);
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        log.info("收到 WebSocket 消息: {}", message.getPayload());
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        String path = session.getUri().getPath();
        String userId = path.substring(path.lastIndexOf("/") + 1);
        sessions.remove(userId);
        log.info("IoT WebSocket 连接关闭，userId={}", userId);
    }

    @Override
    public void handleTransportError(WebSocketSession session, Throwable exception) throws Exception {
        log.error("IoT WebSocket 传输错误", exception);
    }

    private JSONObject buildMockData() {
        JSONObject result = new JSONObject();
        JSONObject reportDataMap = new JSONObject();

        JSONObject temp = new JSONObject();
        temp.put("field", "temperature");
        temp.put("value", String.format("%.1f", 20 + Math.random() * 10));
        temp.put("time", System.currentTimeMillis());
        reportDataMap.put("temperature", temp);

        JSONObject hum = new JSONObject();
        hum.put("field", "humidity");
        hum.put("value", String.format("%.1f", 55 + Math.random() * 20));
        hum.put("time", System.currentTimeMillis());
        reportDataMap.put("humidity", hum);

        JSONObject co2 = new JSONObject();
        co2.put("field", "co2");
        co2.put("value", String.format("%.0f", 400 + Math.random() * 200));
        co2.put("time", System.currentTimeMillis());
        reportDataMap.put("co2", co2);

        JSONObject light = new JSONObject();
        light.put("field", "light");
        light.put("value", String.format("%.0f", 3000 + Math.random() * 5000));
        light.put("time", System.currentTimeMillis());
        reportDataMap.put("light", light);

        result.put("reportDataMap", reportDataMap);
        return result;
    }
}
