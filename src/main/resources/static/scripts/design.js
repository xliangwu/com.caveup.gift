$(function () {
    function FabricDesign() {
        this.targetCanvas = new fabric.Canvas('canvas');
        this.penSize = 10;
        this.toolbarEle = $('#toolbar');

        this.showToolBar = function () {
            $(this.toolbarEle).show();
        };

        this.hideToolBar = function () {
            $(this.toolbarEle).hide();
        };

        this.addImageEle = function (imgEle, width, height) {
            //suggest image 400*400
            var fabricWidth = width || imgEle.naturalWidth;
            var fabricHeight = height || imgEle.naturalHeight;
            fabricWidth = Math.max(fabricWidth, 40);
            fabricHeight = Math.max(fabricHeight, 30);
            var fabricImg = new fabric.Image(imgEle, {
                left: 10,
                top: 10,
                width: fabricWidth,
                height: fabricHeight,
                scaleY: 200 / fabricWidth,
                scaleX: 200 / fabricWidth
            });

            fabricImg.borderColor = 'rgba(27,171,235,0.75)';
            fabricImg.cornerSize = 25;
            fabricImg.cornerColor = 'rgba(27,171,235,0.75)';
            fabricImg.cornerStyle = 'circle';
            fabricImg.transparentCorners = false;

            this.targetCanvas.add(fabricImg);
        };

        this.deleteEle = function () {
            var activeOb = this.targetCanvas.getActiveObject();
            if (activeOb) {
                if (confirm("确定删除选定图层")) {
                    if (activeOb.forEachObject) {
                        activeOb.forEachObject(function (obj) {
                            this.targetCanvas.remove(obj);
                        });
                    }
                    this.targetCanvas.remove(activeOb);
                }
            }
        };

        this.startDraw = function () {
            this.showToolBar();
            this.targetCanvas.isDrawingMode = true;
            this.targetCanvas.freeDrawingBrush.width = this.penSize;
        };

        this.endDraw = function () {
            this.hideToolBar();
            this.targetCanvas.isDrawingMode = false;
            this.groupThisTimeDraw();
        };

        this.groupThisTimeDraw = function () {
            var pathArray = new Array();
            var groupArray = new Array();
            this.targetCanvas.forEachObject(function (obj) {
                console.info(obj.get("type"));
                if (obj.isType("path")) {
                    pathArray.push(obj);
                }
                if (obj.isType("group")) {
                    groupArray.push(obj);
                }
            });
            console.info(" Path size before filter: " + pathArray.length);
            if (pathArray.length > 0) {
                for (var j = 0; j < groupArray.length; j++) {
                    groupArray[j].forEachObject(function (obj) {
                        for (var i = 0; i < pathArray.length; i++) {
                            if (obj == pathArray[i]) {
                                pathArray.splice(i, 1);
                            }
                        }
                    });
                }
                console.info("Path size after filter: " + pathArray.length);
                if (pathArray.length > 0) {
                    var pathGroup = new fabric.Group(pathArray);
                    pathGroup.borderColor = 'rgba(27,171,235,0.75)';
                    pathGroup.cornerSize = 25;
                    pathGroup.cornerColor = 'rgba(27,171,235,0.75)';
                    pathGroup.cornerStyle = 'circle';
                    pathGroup.transparentCorners = false;
                    this.targetCanvas.add(pathGroup);
                }
            }
        }
    }

    var fabricDesign = new FabricDesign();
    if (fabricDesign) {
        //register event for fabric object
        $("#add-draw-button").on("click", function () {
            fabricDesign.startDraw();
        });

        $("#close-draw-button").on("click", function () {
            fabricDesign.endDraw();
        });

        $("#delete-active-button").on("click", function () {
            fabricDesign.deleteEle();
        });

        $("#penWidthControl").on("change", function () {
            $("#penWidthLabel").html(this.value);
            fabricDesign.penSize = parseInt(this.value) || 5;
        });

        $('#save-text-button').on("click", function () {
            var fontName = $('#inputFont').val();
            var fontSize = $('#inputFontSize').val();
            var content = $('#inputText').val();
            $.ajax({
                method: "POST",
                dataType: 'json',
                crossDomain: true,
                url: "design/text_image.html",
                data: {fontName: fontName, fontSize: fontSize, content: content},
                success: function (result) {
                    $('#tempTextImage').attr("src", result.base64Code);
                    var width = result.width;
                    var height = result.height;
                    $('#add-text').modal('hide');
                    var ele = $('#tempTextImage');
                    fabricDesign.addImageEle(ele[0], width, height);
                },
                error: function (data) {

                }
            });
        });

        $("#imageContent").find("a").each(function (index, ele) {
            $(ele).on("click", function () {
                $('#add-pic').modal('hide');
                $(this).children("img").each(function (index, ele) {
                    console.log("++ Image to design");
                    fabricDesign.addImageEle(ele);
                });
            });
        });
    }
});

