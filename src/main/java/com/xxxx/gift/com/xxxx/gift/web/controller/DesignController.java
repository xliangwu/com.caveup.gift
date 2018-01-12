package com.xxxx.gift.com.xxxx.gift.web.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.xxxx.gift.com.xxxx.gift.web.bean.TextImage;
import com.xxxx.gift.com.xxxx.gift.web.convert.TextConvert;
import org.apache.commons.io.FileUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.File;
import java.util.UUID;

@CrossOrigin
@RestController
@RequestMapping("design")
public class DesignController {
    private static final Logger LOGGER = LoggerFactory.getLogger(DesignController.class);

    @RequestMapping("text_image")
    public String textToImage(String fontName, int fontSize, String content) {
        String uuid = UUID.randomUUID().toString();
        try {
            File output = new File(uuid + ".png");
            TextImage textImage = TextConvert.text2Image(content, fontName, fontSize, output);
            FileUtils.deleteQuietly(output);

            ObjectMapper objectMapper = new ObjectMapper();
            return objectMapper.writeValueAsString(textImage);
        } catch (JsonProcessingException e) {
            LOGGER.error(e.getMessage(), e);
        }
        return "error";
    }
}
