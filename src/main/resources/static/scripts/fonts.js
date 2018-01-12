(function($) {
	
	$.font= {
		load : load,
		addFontFace:addFontFace,
		removeFontFace:removeFontFace
	};
	
	function load(fontFamily, string){
		removeFontFace(fontFamily);
		var url = "fonts/"+fontFamily+".ttf?key="+string;
		addFontFace(fontFamily, url);
	}

	function addFontFace(fontFamily, url){
		var fontFaceStr = "<style>@font-face {font-family:" + fontFamily + "; src:url('" + url + "');}</style>"
		$(document.head).append($(fontFaceStr));
	}
	
	function removeFontFace(fontFamily){
		$("style").filter(function(index){
			var styleText = $(this).text();
			if(styleText.indexOf("@font-face")>-1 && styleText.indexOf(fontFamily)>-1){
				return true;
			}else{
				return false;
			}
		}).remove();
	}
	
	
})(jQuery);
