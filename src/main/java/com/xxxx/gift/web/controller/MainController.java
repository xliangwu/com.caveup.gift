package com.xxxx.gift.web.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;

import com.xxxx.gift.web.bean.PageVar;

@CrossOrigin
@Controller
@RequestMapping("/")
public class MainController {

    private static final Logger LOGGER = LoggerFactory.getLogger(MainController.class);

    @RequestMapping(value = {"", "index.html"})
    public String doIndex() {
        return PageVar.INDEX.getName();
    }

    @RequestMapping("design.html")
    public String doDesign() {
        return PageVar.DESIGN.getName();
    }
    
    @RequestMapping("mycanvas")
    public String mycanvas() {
        return PageVar.MYCANVAS.getName();
    }

    @RequestMapping("fonttest")
    public String fonttest() {
        return "fontTest";
    }
    
}
