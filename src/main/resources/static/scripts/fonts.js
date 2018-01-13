(function($) {
	
	$.font= {
        load: load,
        remove: removeFont
	};
	
	function load(fontFamily, substr){
		if(!substr||substr.length<1){
			return;
		}
		if(hasFont(fontFamily)) {
			if(checkNeedUpdate(fontFamily, substr)){
				updateFont(fontFamily, substr);
			}
		} else {
			addFont(fontFamily, substr);
		}
	}
	
	function removeFont(fontFamily){
		getFont.remove();
	}
	
	function addFont(fontFamily, substr){
		var fontFaceStr = "<style>"+generateFontStyleStr(fontFamily, substr)+"</style>"
		$(document.head).append($(fontFaceStr));
	}
	
	function updateFont(fontFamily, substr){
		var fontStyleStr = generateFontStyleStr(fontFamily, substr);
		getFont(fontFamily).html(fontStyleStr);
	}
	
	function generateFontStyleStr(fontFamily, substr){
		var woffUrl = "fonts/"+fontFamily+".woff?key="+substr;
		var ttfUrl = "fonts/"+fontFamily+".ttf?key="+substr;
		return "@font-face {font-family:" + fontFamily + "; src:url('" + woffUrl + "'),url('"+ttfUrl+"');}"
	}

	function checkNeedUpdate(fontFamily, substr) {
		var lastSubStr = getSubStr();
		for (var char in substr) {
			if (lastSubStr.indexOf(char) == -1) {
				return true;
			}
		}
		return false;
	}

	function getSubStr(fontFamily) {
		var fontFace = getFont(fontFamily);
		if (fontFace.lenth == 0) {
			return "";
		}
		var fontFaceStr = fontFace.text();
		var subStrStartIndex = fontFaceStr.indexOf("key=") + 4;
		var subStrEndIndex = fontFaceStr.indexOf("')");
		return fontFaceStr.substring(subStrStartIndex, subStrEndIndex)
	}

	function hasFont(fontFamily){
		var fonts = getFont(fontFamily);
		return fonts && fonts.length>0;
	}
	
	function getFont(fontFamily){
		return $("style").filter(function(index){
			var styleText = $(this).text();
			if(styleText.indexOf("@font-face")>-1 && styleText.indexOf(fontFamily)>-1){
				return true;
			}else{
				return false;
			}
		});
	}
	
})(jQuery);
