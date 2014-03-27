DF90=[0,6.31,2.92,2.35,2.13,2.02,1.94,1.90,1.86,1.83,1.81,1.80,1.78,1.77,1.76,1.75,1.75,1.74,1.73,1.73,1.73,1.72,1.72,
      1.71,1.71,1.71,1.71,1.70,1.70,1.70,1.70,1.70,1.70,1.69,1.69,1.69,1.69,1.68,1.68,1.68,1.68,1.68,];

DF95=[0, 12.706, 4.30,3.18,2.78,2.57,2.45,2.37,2.31,2.26,2.23,2.20,2.18,2.16,2.15,2.13,2.12,2.11,2.10,2.09,2.09,2.08,
	  2.07,2.07,2.06,2.06,2.06,2.05,2.05,2.05,2.04,2.04,2.04,2.04,2.03,2.03,2.03,2.02,2.02,2.02,2.02,2.02,2.02,
      2.02,2.01,2.01,2.01,2.01,2.01];
	  
DF99=[0,63.66,9.93,5.84,4.60,4.03,3.71,3.5,3.36,3.25,3.17,3.12,3.06,3.01,2.98,2.95,2.92,2.90,2.88,2.86,2.85,
      2.83,2.82,2.81,2.80,2.79,2.78,2.77,2.76,2.76,2.75,2.75,2.74,2.74,2.73,2.73,2.72,2.72,2.71,2.71,2.70];

function createData(populationData){
	var popData=[];
	for (i=0;i<populationData.length;i++){
		if (populationData[i]!=0){
			for (j=0;j<populationData[i];j++){
				var x=Math.random();
				var r=(i*20)+x*20;
				popData.push(r);
			}	
		}
	}
	return popData;
}

function getAverage(dataArray){
	var sum = 0;
	for(var i = 0; i < dataArray.length; i++){
		sum += dataArray[i];
	}
	var avg = +(Math.round(sum/dataArray.length + "e+2")+"e-2");
	return avg;
}

function getSD(dataArray){
	var mean=getAverage(dataArray);
	var n=dataArray.length;
	var sum=0;
	for (i=0;i<dataArray.length;i++){
		var x=dataArray[i]-mean;
		var xs=x*x;
		sum+=xs
	}
	var sd=Math.sqrt((sum/n));
	console.log("MEAN " + mean + "\nSD " + sd);
	return sd;
}

function drawSample(size){
	var sample = [];
	for (i=0;i<size;i++){
		var r=Math.round(Math.random()*TRUE_DATA.length);
		var choice=TRUE_DATA[r];
		sample.push(choice);
	}
	return sample;
}

function calculateInterval(sample){
	n=sample.length;
	mean=getAverage(sample);
	sd=getSD(sample);
	lower=mean-(DF95[n-1]*(sd/Math.sqrt(n-1)));
	upper=mean+(DF95[n-1]*(sd/Math.sqrt(n-1)));
	limits=[mean,lower,upper];
	console.log("LIMITS " + limits);
	return limits;
}