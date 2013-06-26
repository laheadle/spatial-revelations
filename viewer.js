
jQuery(function($) {
    var canvas = $('canvas')
    var canvasElt = canvas[0]



    canvas.drawImage({
        layer: true,
        source: canvas.data('image'),
        name: 'image',
        index: 0,
        fromCenter: false
    });

    var index = 0

    function drawLayers() {
        __boxes.forEach(function(r) {
            canvas.addLayer({
                type: "rectangle",
                fillStyle: "#585",
                index: ++index,
                fromCenter: false,
                x: r.x, y: r.y,
                width: r.width, height: r.height
            })
        })

        canvas.drawLayers();
    }

    function getCursorPosition(canvas, event) {
        var x, y;

        canoffset = canvas.offset();
        x = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft - Math.floor(canoffset.left);
        y = event.clientY + document.body.scrollTop + document.documentElement.scrollTop - Math.floor(canoffset.top) + 1;

        return [x,y];
    }

    function findLayer(x, y) {
        var layers = canvas.getLayers(function(layer) {
            if (layer.index === 0)
                return false
            if (layer.width > 0 && (layer.x > x || layer.x + layer.width < x))
                return false
            if (layer.height > 0 && (layer.y > y || layer.y + layer.height < y))
                return false
            if (layer.height < 0 && (layer.y < y || layer.y + layer.height > y))
                return false
            if (layer.width < 0 && (layer.x < x || layer.x + layer.width > x))
                return false
            return true
        });
        if (layers.length === 1) {
            return layers[0]
        }
        else {
            return null
        }
    }

    canvas.mousemove(function(e) {
        var offset = $(this).offset();
        var xy = getCursorPosition($(this), e)
        var layer = findLayer(xy[0], xy[1])
        if (layer) {
            canvas.removeLayer(layer.index).drawLayers()
        }
    });

    drawLayers()
})