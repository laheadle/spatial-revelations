
jQuery(function($) {
    var INCREMENT = 2
    var canvas = $('canvas')
    var canvasElt = canvas[0]
    canvasElt.onselectstart = function () { return false; }

    var imagePath = './images/' + queryVal('name') + '.' + queryVal('imgType')

    canvas.drawImage({
        layer: true,
        source: imagePath,
        name: 'image',
        index: 0,
        fromCenter: false
    });

    function getCursorPosition(canvas, event) {
        var x, y;

        canoffset = canvas.offset();
        x = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft - Math.floor(canoffset.left);
        y = event.clientY + document.body.scrollTop + document.documentElement.scrollTop - Math.floor(canoffset.top) + 1;

        return [x,y];
    }

    var dragging = false;
    var startx, starty;
    var index = 0;

    canvas.mousedown(function(e) {
        var offset = $(this).offset();
        var xy = getCursorPosition($(this), e)
        startx = xy[0]
        starty = xy[1]
        dragging = true
    });

    canvas.mouseup(function(e) {
        var offset = $(this).offset();
        var xy = getCursorPosition($(this), e)
        var x = xy[0]
        var y = xy[1]

        // Create a rectangle layer
        $("canvas").addLayer({
            type: "rectangle",
            fillStyle: "#585",
            index: ++index,
            fromCenter: false,
            x: startx, y: starty,
            width: x - startx, height: y - starty
        })
            .drawLayers();

        dragging = false

    });

    function growOrShrinkBox(e) {
        var l = canvas.getLayer(index)
        var set;

	if ((e.keyCode || e.which) == 37)
	{   
            set = {
                width: l.width - INCREMENT
            }
 	}

	// right arrow
	if ((e.keyCode || e.which) == 39)
	{
            set = {
                width: l.width + INCREMENT
            }
	}   

	// up arrow
	if ((e.keyCode || e.which) == 38)
	{   
            set = {
                height: l.height - INCREMENT
            }
 	}

	// down arrow
	if ((e.keyCode || e.which) == 40)
	{
            set = {
                height: l.height + INCREMENT
            }
	}   

        if (index > 0) {
            $("canvas").setLayer(index, set)
                .drawLayers();
            return false
        }
        else {
            return true
        }
    }


    function moveBox(e) {
        var l = canvas.getLayer(index)
        var set;

	if ((e.keyCode || e.which) == 37)
	{   
            set = {
                x: l.x - INCREMENT
            }
 	}

	// right arrow
	if ((e.keyCode || e.which) == 39)
	{
            set = {
                x: l.x + INCREMENT
            }
	}   

	// up arrow
	if ((e.keyCode || e.which) == 38)
	{   
            set = {
                y: l.y - INCREMENT
            }
 	}

	// down arrow
	if ((e.keyCode || e.which) == 40)
	{
            set = {
                y: l.y + INCREMENT
            }
	}   

        if (index > 0) {
            $("canvas").setLayer(index, set)
                .drawLayers();
            return false
        }
        else {
            return true
        }

    }

    $('body').keydown(function(e) {

        if (e.shiftKey) {
            return growOrShrinkBox(e)
        }
        else {
            return moveBox(e)
        }
    })


    function getLayers() {
        return canvas.getLayers().filter(function(l) { 
            return l.name !== 'image' 
        }).map(function(l) {
            return {
                x: l.x,
                y: l.y,
                height: l.height,
                width: l.width
            }
        })
    }
    
    function queryVal(key) {
        var result = {}, keyValuePairs = location.search.slice(1).split('&');

        keyValuePairs.forEach(function(keyValuePair) {
            keyValuePair = keyValuePair.split('=');
            result[keyValuePair[0]] = keyValuePair[1] || '';
        });

        return result[key];
    }


    function transmit() {
        var data = { 
            __boxes: getLayers(),
            imgType: queryVal('imgType'),
            name: queryVal('name'),
            content: '<div class="content"> </div>',
        }
        
        $.post('/revelation', {data: JSON.stringify(data)})
            .done( function() { alert('ok') })
            .fail(function() { alert('no') })
    }

    $('#done').click(transmit)
    
})