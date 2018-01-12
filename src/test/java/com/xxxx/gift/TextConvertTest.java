package com.xxxx.gift;

import com.xxxx.gift.com.xxxx.gift.web.convert.TextConvert;
import org.junit.Test;

import java.io.File;

public class TextConvertTest {

    @Test
    public void test1() {
        File output = new File("test.png");
        TextConvert.text2Image("hello\n123", "Arial", 36, output);
        String base64Image = TextConvert.image2Base64(output.getPath());
        System.out.println(base64Image);
    }
}
