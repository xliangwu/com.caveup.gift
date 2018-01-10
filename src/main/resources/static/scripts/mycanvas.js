
$(function() {
	var status;
	
	var penPanel = $("#penPanel");
	var fontPanel = $("#fontPanel");
	var canvas = new fabric.Canvas('canvas');//声明画布
	var imgElement = document.getElementById('jspang-img');//声明我们的图片
	var imgInstance = new fabric.Image(imgElement,{  //设置图片在canvas中的位置和样子
	     left:100,
	     top:0,
	     width:imgElement.width,
	     height:imgElement.height,
	     angle:30,
	     scaleY:0.2,
	     scaleX:0.2
	});
	canvas.add(imgInstance);//加入到canvas中
	
	$("#jspang-img").hide();
	penPanel.hide();
	fontPanel.hide();
	
	$("#freeDrawingMode").on("click",changeDrawingMode);
	$("#addTextbox").on("click", addTextbox);
	$("#fontSelect").on("change", changFont);
	
	$(window).keyup(deleteLayer);
	$("#penWidthControl").on("change", changePenWidth);
	
	function changeDrawingMode(){
		if(status == "text"){
			addTextbox();
		}
		canvas.isDrawingMode = !canvas.isDrawingMode;
		canvas.freeDrawingBrush.width= parseInt($("#penWidthControl").attr("value"))||1;
		if(canvas.isDrawingMode){
			penPanel.show();
			status = "drawing";
		} else {
			penPanel.hide();
			groupThisTimeDraw();
			status = null;
		}
	}
	
	function addTextbox(){
		if(status == "drawing"){
			changeDrawingMode();
		}
		if(status == "text"){
			status = null;
			fontPanel.hide();
		} else {
			status = "text";
			fontPanel.show();
			
			var textbox = new fabric.Textbox("请编辑");
			canvas.add(textbox).setActiveObject(textbox);
		}
		
	}
	
	function deleteLayer(event){
		if(event.keyCode == 46){
			var activeOb = canvas.getActiveObject();
			if(activeOb){
				if(confirm("确定删除选定图层")){
					if(activeOb.forEachObject){
						activeOb.forEachObject(function(obj){
							canvas.remove(obj);
						});
					}
					canvas.remove(activeOb);
				}
			}
		}
	}
	
	function changePenWidth(){
		$("#penWidthLable").html(this.value);
		canvas.freeDrawingBrush.width= parseInt(this.value)||1;
	}
	
	// 本次涂鸦放到一个group
	function groupThisTimeDraw() {
		var pathArry = new Array();
		var groupArry = new Array();
		canvas.forEachObject(function(obj) {
			console.info(obj.get("type"));
			if (obj.isType("path")) {
				pathArry.push(obj);
			}
			if (obj.isType("group")) {
				groupArry.push(obj);
			}
		});
		console.info(" Path size before filter: " + pathArry.length);
		if (pathArry.length > 0) {
			for (var j = 0; j < groupArry.length; j++) {
				groupArry[j].forEachObject(function(obj) {
					for (var i = 0; i < pathArry.length; i++) {
						if (obj == pathArry[i]) {
							pathArry.splice(i, 1);
						}
					}
				});
			}
			console.info(" Path size after filter: " + pathArry.length);
			if (pathArry.length > 0) {
				var pathGroup = new fabric.Group(pathArry);
				canvas.add(pathGroup);
			}
		}
	}
	
	function changFont(){
		canvas.getActiveObject().set("fontFamily",this.value);
		canvas.requestRenderAll();
	}

});

