function popRatio(dataValue){
	// Scales the population bars appropriately in the y 
	var x = dataValue*180/40;
	return x;
};

function popMove(clickedBar,bar,h){
	// Moves individual population bars based on what is clicked
	var moveTo = {
					width: 100,
					height: h,
					x: 0,
					y: T_HEIGHT-h
	};
				
	clickedBar.animate({
						y:moveTo.y,
						height:moveTo.height
						}, 
						400
						);
	changeData(bar,h);
};

function getBar(e){
	// Calculates and returns the bar that was clicked
	var x= e.pageX-$("#graph1").offset().left;
	var y= T_HEIGHT-(e.pageY-$("#graph1").offset().top);
	var bar = Math.round((x/WIDTH*48)-.6);
	if (bar<0){
			bar=0
		}
	popMove(POP_RECT[bar],bar,y);
}

function changeData(barIndex,y){
	// Changes the data when the bar height is changed
	var value=Math.round(y*40/180);
	POP_DATA[barIndex]=value;
}

