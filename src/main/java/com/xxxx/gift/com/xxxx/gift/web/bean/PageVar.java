package com.xxxx.gift.com.xxxx.gift.web.bean;

public enum PageVar {

    INDEX("/index"),
    DESIGN("/design");

    private String name;

    private PageVar(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

}
