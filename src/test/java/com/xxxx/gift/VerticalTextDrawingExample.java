package com.xxxx.gift;

import javax.swing.*;
import java.awt.*;
import java.awt.geom.AffineTransform;

public class VerticalTextDrawingExample extends JFrame {
    public VerticalTextDrawingExample() {
        super("Vertical Text Drawing Example");

        setSize(320, 280);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLocationRelativeTo(null);
    }

    public void paint(Graphics g) {
        super.paint(g);

        g.setFont(new Font("仿宋", Font.BOLD, 16));
        g.setColor(Color.BLUE);
        g.drawString("你好", 100, 100);

        Graphics2D g2d = (Graphics2D) g;
        AffineTransform defaultAt = g2d.getTransform();

        // rotates the coordinate by 90 degree counterclockwise
        AffineTransform at = new AffineTransform();
        at.rotate(-Math.PI / 2);
        g2d.setTransform(at);
        g2d.drawString("你好", -200, 50);


        AffineTransform at2 = AffineTransform.getQuadrantRotateInstance(1);
        g2d.setTransform(at2);

        g2d.drawString("你好", 100, -250);

        g2d.setTransform(defaultAt);

    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(new Runnable() {

            @Override
            public void run() {
                new VerticalTextDrawingExample().setVisible(true);
            }
        });
    }
}
