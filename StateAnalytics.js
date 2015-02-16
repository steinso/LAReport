
var StateAnalytics = function(){

	var runAllAnalyticsOnStates = function(states){
		// Extends the input object
		return new Promise(function(resolve,reject){


			states.map(function(state){
				var markersFile =getFileByName(state.files,".markers.json");
				var markers = new Markers(markersFile.fileContents);

				var testsFile = getFileByName(state.files,".tests.json");
				var tests = new Tests(testsFile.fileContents);

				state.files.map(function(file){
					countLines(file);
					file.markers = markers.getMarkersForFile(file);
					file.tests = tests.getTestsForFile(file);
				});
			});

			resolve(states);
		});
	};

	var getFileByName = function(files,fileName){
var file = files.filter(function(file){if(file.name === fileName){return file;}})[0];
			return  file || {};
	};

	var countLines = function(file){
		if(file !== undefined){
		file.numberOfLines = file.fileContents.split("\n").length-1;
		}
	};


	return{
		countLines:countLines,
		runAllAnalyticsOnStates:runAllAnalyticsOnStates
	};
};


var Markers = function(markersFile){

	var markersPrFile = {};

	var _constructor = function(markersFile){

		try{
		console.log(markersFile.substring(0,10));
		var markers = JSON.parse(markersFile);
		//markersPrFile = markers.listOfMarkers;
		}catch(e){
			console.log("Could not parse markers JSON",markersFile);
		}
	};

	var getMarkersForFile = function(file){
		if(markersPrFile[file.name] !== undefined){
			return markersPrFile[file.name];
		}
		return [];
	};

	_constructor(markersFile);

	return{
		getMarkersForFile:getMarkersForFile
	};
};

var Tests = function(testsFile){

	var testsPrClass = {};

	var _constructor = function(testsFile){

		try{
		var tests = JSON.parse(testsFile);
		tests.map(function(test){
			testsPrClass[test.className] = test;	
		});
		}catch(e){
			console.log("Could not parse test JSON",testsFile);
		}

	};

	var getTestsForFile = function(file){
		
		if(file === undefined){
			return [];
		}
		var packageMatch = file.fileContents.match(/^\s+package (\w+);/);
		var classMatch= file.fileContents.match(/^\s+public class (\w+)/);
		var packageName = null;
		var className = null;

		if(packageMatch !== null && packageMatch[1] !==null){
			packageName = packageMatch[1];
		}

		if(classMatch !== null && classMatch[1] !==null){
			className = classMatch[1];
		}

		if(testsPrClass[packageName+"."+className+"Test"] !== undefined){
			return testsPrClass[packageName+"."+className+"Test"];
		}
		return [];
	};

	_constructor(testsFile);

	return{
		getTestsForFile:getTestsForFile
	};
};
module.exports = new StateAnalytics();
