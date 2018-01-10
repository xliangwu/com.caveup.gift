$(function () {
    var status;
    var canvas = new fabric.Canvas('canvas');//声明画布

    $("#add-draw-button").on("click", startDraw);
    $("#close-draw-button").on("click", endDraw);
    $("#delete-active-button").on("click", deleteSelectedDraw);

    $(window).keyup(deleteLayer);
    $("#penWidthControl").on("change", changePenWidth);

    function showToolBar() {
        $('#toolbar').show();
    }

    function hideToolBar() {
        $('#toolbar').hide();
    }

    function startDraw() {
        showToolBar();
        canvas.isDrawingMode = true;
        canvas.freeDrawingBrush.width = parseInt($("#penWidthControl").attr("value")) || 1;
    }

    function endDraw() {
        hideToolBar();
        canvas.isDrawingMode = false;
        groupThisTimeDraw();
    }

    function deleteSelectedDraw() {
        var activeOb = canvas.getActiveObject();
        if (activeOb) {
            if (confirm("确定删除选定图层")) {
                if (activeOb.forEachObject) {
                    activeOb.forEachObject(function (obj) {
                        canvas.remove(obj);
                    });
                }
                canvas.remove(activeOb);
            }
        }
    }

    // group
    function groupThisTimeDraw() {
        var pathArray = new Array();
        var groupArry = new Array();
        canvas.forEachObject(function (obj) {
            console.info(obj.get("type"));
            if (obj.isType("path")) {
                pathArray.push(obj);
            }
            if (obj.isType("group")) {
                groupArry.push(obj);
            }
        });
        console.info(" Path size before filter: " + pathArray.length);
        if (pathArray.length > 0) {
            for (var j = 0; j < groupArry.length; j++) {
                groupArry[j].forEachObject(function (obj) {
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
                canvas.add(pathGroup);
            }
        }
    }

    function deleteLayer(event) {
        if (event.keyCode == 46) {
            deleteSelectedDraw();
        }
    }

    function changePenWidth() {
        $("#penWidthLabel").html(this.value);
        canvas.freeDrawingBrush.width = parseInt(this.value) || 1;
    }

});

