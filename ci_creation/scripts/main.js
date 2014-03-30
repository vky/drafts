window.onload=(function(){

var WIDTH = 600;
var T_HEIGHT = 240;
var B_HEIGHT = T_HEIGHT+120;
var FONT_FAMILY = "Arial, Helvetica, sans-serif";
var POP_DATA = [0,0,0,0,0,0,0,0,0,0,1,1,2,3,4,7,9,13,17,22,27,31,35,38,40,40,38,35,31,27,22,17,13,9,7,4,3,2,1,1,0,0,0,0,0,0,0,0];
var POP_RECT = [];
var TRUE_DATA = createData(POP_DATA);
var POP_MEAN = 500+".00";
var POP_SD = 100+".00";
var INTERVALS = [];
var INTERVAL_DATA = [];

var isDragging = false;

//******************************//
//  POPULATION FUNCTIONS BELOW  //
//******************************//

function popRatio(dataValue){
    // Scales the population bars appropriately in the y
    var x = dataValue*180/40;
    return x;
};

function popMove(clickedBar, bar, h) {
    // Moves individual population bars based on what is clicked
    var moveTo = {
        width: 100,
        height: h,
        x: 0,
        y: T_HEIGHT-h
    };

    clickedBar.animate({
        y: moveTo.y,
        height: moveTo.height
    }, 400);
    changeData(bar, h);
};

function getBar(e) {
    // Calculates and returns the bar that was clicked
    var x= e.pageX-$("#graph1").offset().left;
    var y= T_HEIGHT-(e.pageY-$("#graph1").offset().top);
    var bar = Math.round((x/WIDTH*48)-.6);
    if (bar<0){
        bar = 0
    }
    popMove(POP_RECT[bar], bar, y);
}

function changeData(barIndex, y) {
    // Changes the data when the bar height is changed
    var value = Math.round(y*40/180);
    POP_DATA[barIndex] = value;
}


//*************************//
//  GRAPH FUNCTIONS BELOW  // 
//*************************// 

// Create the two canvases

function createCanvas() {
    topgraph = Raphael("graph1", WIDTH, T_HEIGHT);
    botgraph = Raphael("graph2", WIDTH, B_HEIGHT);
    for (i = 0; i<48; i++) {
        var height = popRatio(POP_DATA[i]);
        var xDelta = WIDTH/48 + (i*12.5) - 12.5;
        var rect = topgraph.rect(WIDTH/48 + (i*12.5) - 12.5, T_HEIGHT-height, 12.5, POP_DATA[i]*height).attr({"stroke-width": 1, "stroke": "BLACK", "fill": "#4696D7"});
        POP_RECT.push(rect);


        var tick = botgraph.path("M " + xDelta +" 0 L " + xDelta + " 6");

        if (i%5 == 0 && i != 0) {
            var label = botgraph.text(xDelta, 12, i*20).attr({"font-size": 12, "font-family": FONT_FAMILY, "stroke": "gray"});
        }
    }
    drawMeanLine(POP_MEAN);

}
createCanvas();
drawMean();


// Mouse functions for top graph
$("#graph1").mousedown(function (e) {
    isDragging = true;
    getBar(e);
    changePop(POP_DATA);
    $("#custom").prop("checked", true)
    setPopLabel($("#custom"));
});

$("#graph1").mouseup(function (e) {
    isDragging = false;
    changePop(POP_DATA);
});

$("#graph1").mousemove(function (e) {
    if (isDragging == true) {
        getBar(e);

    }
});

function drawMean() {
    displayMean = topgraph.text(WIDTH/2, 10, "Population Parameters: Mean = " + POP_MEAN + ", SD = " + POP_SD).attr({"font-size": 12, "font-family": FONT_FAMILY, "stroke":"#4696D7"});
}


// Changes the population TRUE_DATA
function changePop(radio, data) {
    for (i = 0; i<48; i++) {
        popMove(POP_RECT[i], i, popRatio(POP_DATA[i]));
    }
    TRUE_DATA = createData(POP_DATA);
    POP_MEAN = getAverage(TRUE_DATA);
    drawMeanLine(POP_MEAN);
    displayMean.remove();
    drawMean();
}

function drawMeanLine(mean) {
    try{
        meanLine.remove();
    }
    catch(e) {}
    meanLine = botgraph.path("M " + WIDTH/960*mean + " " + B_HEIGHT +" L" + WIDTH/960*mean + " 17").attr({"stroke-width": 3,"stroke":"#4696D7"});
}

function drawInterval(limits) {
    var position = 350-(INTERVALS.length*16);
    if (INTERVALS.length>0) {
        var l = INTERVAL_DATA[INTERVALS.length-1][0];
        var u = INTERVAL_DATA[INTERVALS.length-1][1];
        INTERVALS[INTERVALS.length-1].animate({
            path:"M " + l + " " + position + " L " + u + " " + position
        }, 400);
    }

    lmap = WIDTH/960*limits[1];
    umap = WIDTH/960*limits[2];
    if (limits[1]>POP_MEAN || limits[2] < POP_MEAN) {
        console.log(lmap + " " + POP_MEAN + " " + umap);
        s="RED";
    }
    else{
        s="BLACK";
    }

    interval = botgraph.path("M " + lmap + " 30 L " +umap +" 30").attr({"stroke-width": 3, "stroke": s});
    /*interval.hover(function() {
      this.g = this.glow().attr({color: s, width: 100});

      },
      function() {
      this.g.remove();
      this.tl = botgraph.remove();
      this.tu = botgraph.remove();
      });*/
    INTERVALS.push(interval);
    INTERVAL_DATA.push([lmap, umap]);
}




//**********************//
//     UI FUNCTIONS     //
//**********************//
$('input:radio[id=normal]').prop('checked', true);
$('input[name=sam]:checked').parents("td").css("background-color","#4696D7");


// Slider functionality
$( "#slider" ).slider({
    slide: function(event, ui) {
        $("#samplesize").val($( "#slider" ).slider("value"));
    }
});

$( "#slider" ).slider({ max: 50 });
$( "#slider" ).slider({ min: 5 });
$( "#slider" ).slider({ step: 1 });
$( "#slider" ).slider({ value: 0 });
$("#samplesize").val($( "#slider" ).slider("value"));

// Label hovers
$(".population").hover(
    function() {
        $(this).css("background-color","#4696D7");
    },
    function() {
        if($(this).children("label").children(".pops").attr("id")==$('input[name=sam]:checked').val()) {}
        else{
            $(this).css("background-color","white");
        }
    }
);

$("#normal").click(function() {
    setPopLabel(this);
    POP_DATA=[0,0,0,0,0,0,0,0,0,0,1,1,2,3,4,7,9,13,17,22,27,31,35,38,40,40,38,35,31,27,22,17,13,9,7,4,3,2,1,1,0,0,0,0,0,0,0,0];
    changePop(POP_DATA);
    displayMean.remove();
    displayMean = topgraph.text(WIDTH/2, 10,"Population Parameters: Mean = " + 500+".00" + ", SD = " + 100 +".00").attr({"font-size": 12, "font-family": FONT_FAMILY, "stroke":"#4696D7"});
});

$("#skewed").click(function() {
    setPopLabel(this);
    POP_DATA=[10,15,25,32,33,35,39,40,48,48,46,43,39,36,30,25,20,18,14,12,10,9,8,7,7,6,5,5,3,3,2,2,2,1,1,1,1,0,0,0,0,0,1,0,0,20,10,5];
    changePop(POP_DATA);
});

$("#skewedbi").click(function() {
    setPopLabel(this);
    POP_DATA=[0,0,0,0,0,0,0,0,0,0,48,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0];
    changePop(POP_DATA);
});

$("#custom").click(function() {
    setPopLabel(this);
});

$("#button2").click(function() {
    if (INTERVALS.length<20) {
        sample = drawSample($(samplesize).val());
        var limits = calculateInterval(sample);
        drawInterval(limits);
    }
});

function setPopLabel(object) {
    clearPopLabels();
    $(object).parents("TD").css("background-color", "#4696D7");
}

function clearPopLabels() {
    $('.population').css({"background-color": "white"});
}


});
