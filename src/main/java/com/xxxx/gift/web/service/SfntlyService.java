package com.xxxx.gift.web.service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.stereotype.Service;

import com.google.typography.font.sfntly.Font;
import com.google.typography.font.sfntly.FontFactory;
import com.google.typography.font.sfntly.Tag;
import com.google.typography.font.sfntly.data.WritableFontData;
import com.google.typography.font.sfntly.table.core.CMapTable;
import com.google.typography.font.tools.conversion.woff.WoffWriter;
import com.google.typography.font.tools.sfnttool.GlyphCoverage;
import com.google.typography.font.tools.subsetter.RenumberingSubsetter;
import com.google.typography.font.tools.subsetter.Subsetter;

@Service
public class SfntlyService {

    public byte[] getSubFont(String fontFamily, String subString, boolean isWoff) throws IOException {
        FontFactory fontFactory = FontFactory.getInstance();
        byte[] fontByte = getFontBytes(fontFamily);
        Font font = fontFactory.loadFonts(fontByte)[0];

        Subsetter subsetter = new RenumberingSubsetter(font, fontFactory);
        List<CMapTable.CMapId> cmapIds = new ArrayList<CMapTable.CMapId>();
        cmapIds.add(CMapTable.CMapId.WINDOWS_BMP);
        subsetter.setCMaps(cmapIds, 1);
        subsetter.setRemoveTables(getRemoveTable());
        
        List<Integer> glyphs = GlyphCoverage.getGlyphCoverage(font, subString);
        subsetter.setGlyphs(glyphs);
        Font newFont = subsetter.subset().build();

        ByteArrayOutputStream outStream = new ByteArrayOutputStream();
        if(isWoff){
        	WritableFontData woffData = new WoffWriter().convert(newFont);
        	woffData.copyTo(outStream);
        } else {
        	fontFactory.serializeFont(newFont, outStream);
        }
        return outStream.toByteArray();
    }

    private byte[] getFontBytes(String fontFamily) throws IOException {
        String path = "static/fonts/" + fontFamily + ".ttf";
        InputStream inputStream = this.getClass().getClassLoader().getResourceAsStream(path);
        ByteArrayOutputStream outStream = new ByteArrayOutputStream();
        byte[] data = new byte[2048];
        int count = -1;
        while ((count = inputStream.read(data, 0, 2048)) != -1)
            outStream.write(data, 0, count);
        return outStream.toByteArray();
    }

    public Set<Integer> getRemoveTable() {
        Set<Integer> removeTables = new HashSet<Integer>();
        // Most of the following are valid tables, but we don't renumber them
        // yet, so strip
        removeTables.add(Tag.GDEF);
        removeTables.add(Tag.GPOS);
        removeTables.add(Tag.GSUB);
        removeTables.add(Tag.kern);
        removeTables.add(Tag.hdmx);
        removeTables.add(Tag.vmtx);
        removeTables.add(Tag.VDMX);
        removeTables.add(Tag.LTSH);
        removeTables.add(Tag.DSIG);
        // AAT tables, not yet defined in sfntly Tag class
        removeTables.add(Tag.intValue(new byte[]{'m', 'o', 'r', 'x'}));
        return removeTables;
    }


}
