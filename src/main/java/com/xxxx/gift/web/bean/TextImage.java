package com.xxxx.gift.web.bean;

public class TextImage {

    private int width;
    private int height;
    private String content;
    private String path;
    private String base64Code;

    public String getBase64Code() {
        return base64Code;
    }

    public void setBase64Code(String base64Code) {
        this.base64Code = base64Code;
    }

    public int getWidth() {
        return width;
    }

    public void setWidth(int width) {
        this.width = width;
    }

    public int getHeight() {
        return height;
    }

    public void setHeight(int height) {
        this.height = height;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }
}
