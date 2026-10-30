package com.itheima.demo;

import com.alibaba.excel.EasyExcel;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import java.io.File;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class EasyExcelWriteTest {

    // 定义文件输出的路径（这里使用系统的临时目录，避免污染项目结构）
    private static final String PATH = "D:\\easyexcel" + File.separator;

    // 在所有测试运行前，确保目录存在
    @BeforeAll
    static void setup() {
        File file = new File(PATH);
        if (!file.exists()) {
            file.mkdirs();
        }
    }

    /**
     * 练习 1：最简单的写
     */
    @Test
    void testSimpleWrite() {
        // 文件名加上时间戳，防止重名
        String fileName = PATH + "demo" + System.currentTimeMillis() + ".xlsx";

        // 这里 需要指定写用哪个class去写，然后写到第一个sheet，名字为模板 然后文件流会自动关闭
        // write(fileName, 格式类)
        // sheet(sheet名)
        // doWrite(数据列表)
        EasyExcel.write(fileName, DemoData.class)
                .sheet("模板")
                .doWrite(data());

        // 验证文件是否生成成功
        File file = new File(fileName);
        Assertions.assertTrue(file.exists(), "文件生成失败");
        System.out.println("文件生成成功，路径：" + fileName);
    }

    /**
     * 辅助方法：生成测试数据
     */
    private List<DemoData> data() {
        List<DemoData> list = new ArrayList<>();
        // 模拟生成 10 条数据
        for (int i = 0; i < 10; i++) {
            DemoData data = new DemoData();
            data.setString("字符串" + i);
            data.setDate(new Date());
            data.setDoubleData(0.56);
            list.add(data);
        }
        return list;
    }

}
