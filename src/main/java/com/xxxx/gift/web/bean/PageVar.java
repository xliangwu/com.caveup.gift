package com.xxxx.gift.web.bean;

public enum PageVar {

    INDEX("index"),
    DESIGN("design"),
	MYCANVAS("mycanvas");

    private String name;

    private PageVar(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

}
