package com.xxxx.gift.web.convert;

import org.apache.tomcat.util.http.fileupload.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.xxxx.gift.web.bean.TextImage;

import sun.misc.BASE64Encoder;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.*;
import java.util.ArrayList;
import java.util.List;

public final class TextConvert {

    private static final Logger LOGGER = LoggerFactory.getLogger(TextConvert.class);
    private static final int DEFAULT_WIDTH = 100;
    private static final int DEFAULT_HEIGHT = 80;

    public static String image2Base64(String imagePath) {
        InputStream in = null;
        byte[] data = null;
        try {
            in = new FileInputStream(new File(imagePath));
            data = new byte[in.available()];
            in.read(data);
        } catch (IOException e) {
            LOGGER.error(e.getMessage(), e);
        } finally {
            IOUtils.closeQuietly(in);
        }
        BASE64Encoder encoder = new BASE64Encoder();
        return encoder.encode(data);
    }

    public static TextImage text2Image(String text, String fontName, int fontSize, File output) {
        List<String> lines = parseMultipleLines(text);

        BufferedImage img = new BufferedImage(DEFAULT_WIDTH, DEFAULT_WIDTH, BufferedImage.TYPE_INT_ARGB);
        Graphics2D g2d = img.createGraphics();
        Font font = new Font(fontName, Font.PLAIN, fontSize);
        g2d.setFont(font);
        FontMetrics fm = g2d.getFontMetrics();

        int width = 0;
        int height = 0;
        for (String line : lines) {
            width = Math.max(fm.stringWidth(line), width);
            height += fm.getHeight();
        }
        g2d.dispose();

        img = new BufferedImage(width, height, BufferedImage.TYPE_INT_ARGB);
        g2d = img.createGraphics();
        g2d.setFont(font);
        fm = g2d.getFontMetrics();
        g2d.setColor(Color.BLACK);
        int cy = fm.getAscent();
        for (String line : lines) {
            g2d.drawString(line, 0, cy);
            cy += fm.getHeight();
        }
        g2d.dispose();

        try {
            ImageIO.write(img, "png", output);
            String base64ImageStr = image2Base64(output.getPath());

            TextImage textImage = new TextImage();
            textImage.setWidth(width);
            textImage.setHeight(height);
            textImage.setContent(text);
            textImage.setPath(output.getPath());
            textImage.setBase64Code("data:image/png;base64," + base64ImageStr);
            return textImage;
        } catch (IOException ex) {
            LOGGER.error(ex.getMessage(), ex);
        }
        return null;
    }

    private static List<String> parseMultipleLines(String text) {
        List<String> lines = new ArrayList<>();
        try (BufferedReader br = new BufferedReader(new StringReader(text))) {
            String line = null;
            while ((line = br.readLine()) != null) {
                if (!line.trim().isEmpty()) {
                    lines.add(line);
                }
            }
        } catch (IOException e) {
            LOGGER.error(e.getMessage(), e);
        }

        return lines;
    }
}
