package com.xxxx.gift;

import com.xxxx.gift.com.xxxx.gift.web.convert.TextConvert;
import org.junit.Test;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.StringReader;

public class TextConvertTest {

    @Test
    public void test1() {
        File output = new File("test.png");
        TextConvert.text2Image("中国\n123", "TimesRoman", 36, output);
        String base64Image = TextConvert.image2Base64(output.getPath());
        System.out.println(base64Image);
    }

    @Test
    public void test2() throws IOException {
        String str = null;
        BufferedReader br = new BufferedReader(new StringReader("abc\r\n123"));
        String line = null;
        while ((line = br.readLine()) != null) {
            System.out.println(line);
        }
    }
}
