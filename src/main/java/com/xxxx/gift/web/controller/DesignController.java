package com.xxxx.gift.web.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.xxxx.gift.web.bean.TextImage;
import com.xxxx.gift.web.convert.TextConvert;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.File;

@CrossOrigin
@RestController
@RequestMapping("design")
public class DesignController {
    private static final Logger LOGGER = LoggerFactory.getLogger(DesignController.class);

    @RequestMapping("text_image")
    public String textToImage(String fontName, int fontSize, String content) {
        File output = new File("test.png");
        TextImage textImage = TextConvert.text2Image(content, fontName, fontSize, output);

        ObjectMapper objectMapper = new ObjectMapper();
        try {
            return objectMapper.writeValueAsString(textImage);
        } catch (JsonProcessingException e) {
            LOGGER.error(e.getMessage(), e);
        }
        return "error";
    }
}
