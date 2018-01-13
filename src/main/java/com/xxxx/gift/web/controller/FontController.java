package com.xxxx.gift.web.controller;

import java.io.IOException;
import java.io.OutputStream;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.xxxx.gift.web.service.SfntlyService;

@RestController
@RequestMapping("/fonts")
public class FontController {
    private static final Logger LOGGER = LoggerFactory.getLogger(FontController.class);

    @Autowired
    SfntlyService sfntlyService;

	@RequestMapping("/{fontFamily}.ttf")
	public byte[] getSubFont(@PathVariable String fontFamily, @RequestParam(value = "key") String subString)
			throws IOException {
		LOGGER.info("get sub font for {}, {}", fontFamily, subString);
		return sfntlyService.getSubFont(fontFamily, subString, false);
	}

	@RequestMapping("/{fontFamily}.woff")
	public byte[] getSubFontWoff(@PathVariable String fontFamily, @RequestParam(value = "key") String subString)
			throws IOException {
		LOGGER.info("get sub font for {}, {}", fontFamily, subString);
		return sfntlyService.getSubFont(fontFamily, subString, true);
	}

}
