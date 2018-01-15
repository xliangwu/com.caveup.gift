$(function () {
    function FabricDesign() {
        this.targetCanvas = new fabric.Canvas('canvas');
        this.penSize = 10;
        this.toolbarEle = $('#toolbar');

        this.targetCanvas.on('selection:created', function (event) {
            var canvas = event.target.canvas;
            var activeObj = canvas.getActiveObject();
            if (activeObj) {
                var index = canvas.getObjects().indexOf(activeObj);
                var total = canvas.size();
                $('#move-front-btn').parent().show();
                $('#move-back-btn').parent().show();
                $('#move-forward-btn').parent().show();
                $('#move-backward-btn').parent().show();
                if (total == 1) {
                    $('#move-front-btn').parent().hide();
                    $('#move-back-btn').parent().hide();
                    $('#move-forward-btn').parent().hide();
                    $('#move-backward-btn').parent().hide();
                } else if (index == 0) {
                    $('#move-back-btn').parent().hide();
                    $('#move-backward-btn').parent().hide();
                } else if (index == total - 1) {
                    $('#move-front-btn').parent().hide();
                    $('#move-forward-btn').parent().hide();
                }
            }

            $('#tool-layer-btn').show();
            $('#tool-delete-btn').show();

            $('#tool-back-btn').hide();
            $('#tool-pensize-btn').hide();
            $('#tool-done-btn').hide();
            $('#toolbar').show();
        });

        this.targetCanvas.on('selection:cleared', function () {
            $('#tool-layer-btn').hide();
            $('#tool-delete-btn').hide();
            $('#tool-back-btn').hide();
            $('#tool-pensize-btn').hide();
            $('#tool-done-btn').hide();
            $('#toolbar').hide();
        });

        this.showDrawBtns = function () {
            $('#tool-layer-btn').hide();
            $('#tool-delete-btn').hide();

            $('#tool-back-btn').show();
            $('#tool-pensize-btn').show();
            $('#tool-done-btn').show();
            $('#toolbar').show();
        };

        this.hideDrawBtns = function () {
            $('#tool-layer-btn').hide();
            $('#tool-delete-btn').hide();

            $('#tool-back-btn').hide();
            $('#tool-pensize-btn').hide();
            $('#tool-done-btn').hide();
            $('#toolbar').hide();
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
                scaleY: 150 / fabricWidth,
                scaleX: 150 / fabricWidth
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
                    this.targetCanvas.remove(activeOb);
                }
            }
        };

        this.startDraw = function () {
            this.showDrawBtns();
            this.targetCanvas.isDrawingMode = true;
            this.targetCanvas.freeDrawingBrush.width = this.penSize;
        };

        this.endDraw = function () {
            this.hideDrawBtns();
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
                    for (var i = 0; i < pathArray.length; i++) {
                        this.targetCanvas.remove(pathArray[i])
                    }
                    var pathGroup = new fabric.Group(pathArray);
                    pathGroup.borderColor = 'rgba(27,171,235,0.75)';
                    pathGroup.cornerSize = 25;
                    pathGroup.cornerColor = 'rgba(27,171,235,0.75)';
                    pathGroup.cornerStyle = 'circle';
                    pathGroup.transparentCorners = false;
                    this.targetCanvas.add(pathGroup);
                }
            }
        };

        this.moveFront = function () {
            var activeObj = this.targetCanvas.getActiveObject();
            if (activeObj) {
                this.targetCanvas.bringToFront(activeObj);
            }
        };

        this.moveBack = function () {
            var activeObj = this.targetCanvas.getActiveObject();
            if (activeObj) {
                this.targetCanvas.sendToBack(activeObj);
            }
        };

        this.moveForward = function () {
            var activeObj = this.targetCanvas.getActiveObject();
            if (activeObj) {
                this.targetCanvas.bringForward(activeObj, true);
            }
        };

        this.moveBackward = function () {
            var activeObj = this.targetCanvas.getActiveObject();
            if (activeObj) {
                this.targetCanvas.sendBackwards(activeObj, true);
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
            fabricDesign.penSize = $('#penWidthControl').val() || 5;
            fabricDesign.startDraw();
        });

        $('#save-text-button').on("click", function () {
            var fontName = $('#inputFont').val();
            var fontSize = $('#inputFontSize').val();
            var content = $('#inputText').val();
            var layout = $("input[name='inlineRadioOptions']:checked").val();
            $.ajax({
                method: "POST",
                dataType: 'json',
                crossDomain: true,
                url: "design/text_image.html",
                data: {fontName: fontName, fontSize: fontSize, content: content, layout: layout},
                success: function (result) {
                    var img = new Image();
                    img.src = result.base64Code;
                    var width = result.width;
                    var height = result.height;
                    fabricDesign.addImageEle(img, width, height);
                    $('#add-text').modal('hide');
                },
                error: function (data) {

                }
            });
        });

        $("#myTabContent").find("a").each(function (index, ele) {
            $(ele).on("click", function () {
                $('#add-pic').modal('hide');
                $(this).children("img").each(function (index, ele) {
                    console.log("++ Image to design");
                    fabricDesign.addImageEle(ele);
                });
            });
        });

        $("#move-front-btn").on("click", function () {
            fabricDesign.moveFront();
        });

        $("#move-back-btn").on("click", function () {
            fabricDesign.moveBack();
        });

        $("#move-forward-btn").on("click", function () {
            fabricDesign.moveForward();
        });

        $("#move-backward-btn").on("click", function () {
            fabricDesign.moveBackward();
        });
    }
});

