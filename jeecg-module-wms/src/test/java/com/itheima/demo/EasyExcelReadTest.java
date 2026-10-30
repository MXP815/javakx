package com.itheima.demo;

import com.alibaba.excel.EasyExcel;
import com.alibaba.excel.context.AnalysisContext;
import com.alibaba.excel.event.AnalysisEventListener;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import java.io.File;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class EasyExcelReadTest {
    private static final String PATH = "D:\\easyexcel" + File.separator;

    @BeforeAll
    static void setup() {
        File file = new File(PATH);
        if (!file.exists()) {
            file.mkdirs();
        }
    }

    @Test
    void testSimpleRead() {
        // 1. 准备：先写入一个临时文件供读取测试使用
        String fileName = PATH + "demo_read_" + System.currentTimeMillis() + ".xlsx";
        // 准备数据
        List<DemoData> dataToWrite = new ArrayList<>();
        for (int i = 0; i < 5; i++) {
            dataToWrite.add(new DemoData("字符串" + i, new Date(), 0.56, "<UNK>" + i));
        }
        // 执行写入
        EasyExcel.write(fileName, DemoData.class).sheet("模板").doWrite(dataToWrite);

        // 2. 读取：定义一个列表来存储读取到的数据
        List<DemoData> readDataList = new ArrayList<>();

        // 这里 需要指定读用哪个class去读，然后读取第一个sheet
        // read(fileName, 格式类)
        //      .registerReadListener(监听器)  <-- 核心：通过监听器获取数据
        //      .sheet()
        //      .doRead()

        // 匿名内部类方式写监听器 (实际开发中也可以写成单独的类)
        EasyExcel.read(fileName, DemoData.class, new AnalysisEventListener<DemoData>() {

            /**
             * 每解析一行数据，都会调用该方法
             * @param data   解析出来的每行数据对象
             * @param context 上下文
             */
            @Override
            public void invoke(DemoData data, AnalysisContext context) {
                System.out.println("解析到一条数据：" + data);
                readDataList.add(data);
            }

            /**
             * 所有数据解析完成后调用
             */
            @Override
            public void doAfterAllAnalysed(AnalysisContext context) {
                System.out.println("所有数据解析完成！");
            }
        }).sheet().doRead();

        // 3. 验证：判断读出来的数据数量和内容是否正确
        Assertions.assertEquals(5, readDataList.size(), "读取到的数据条数不对");
        Assertions.assertEquals("字符串0", readDataList.get(0).getString(), "第一条数据内容不匹配");

        System.out.println("测试通过！文件路径：" + fileName);
    }
}
