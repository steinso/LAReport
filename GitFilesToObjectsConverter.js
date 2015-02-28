
var GitFilesToObjectsConverter = function(){

	var convert = function(commits){
		// Extends the input object
		return new Promise(function(resolve,reject){
			try{
			var states = [];

			commits.map(function(commit){
				var state = {};
				state.files = [];
				state.time = commit.time;
				states.push(state);

				var markersFiles =getFilesByNameRegex(commit.files,/\.markers\.json/);
				var markers = new Markers(markersFiles);
				var testsFiles = getFilesByNameRegex(commit.files,/\.tests\.json/);
				var tests = new Tests(testsFiles);

				var relevantFiles = getRelevantFiles(commit.files);

				relevantFiles.map(function(_file){
					var file = {};
					file.name = _file.name;
					file.fileContents = _file.fileContents;
					file.markers = markers.getMarkersForFile(_file);
					file.tests = tests.getTestsForFile(_file);
					if(file.tests.length>0){
						console.log("Found tests for file: "+file.name," - state #: ",states.length);
					}

					if(file.markers.length>0){
						console.log("Found markers for file: "+file.name," - state #: ",states.length);
					}

					state.files.push(file);
				});
			});

			
			//Must reverse the array, as pushing makes last commit end up in front
			resolve(states.reverse());
			} catch(e){
				console.trace();
				console.error("Caught it ");
				reject(Error(e));
			}
		});
	};

	var getRelevantFiles = function(files){
		return files.filter(function(file){if(file.name.match(/\.markers\.json/) == null && file.name.match(/\.tests\.json/) == null){return true;}});
	};	

	var getFilesByNameRegex = function(fileList,fileNameRegex){
		var files = fileList.filter(function(file){

			var match = file.name.match(fileNameRegex);
			if( match !== null){
				return match[0];
			}
		});
		return  files || [];
	};
	var getFileByName = function(files,fileName){
		var file = files.filter(function(file){if(file.name === fileName){return file;}})[0];
		return  file || {};
	};

	return{
		convert:convert
	};
};


var Markers = function(markersFile){

	var markersPrFile = {};

	var _constructor = function(markersFiles){

		markersFiles.map(parseFiles);
	};

	var parseFiles= function(markersFile){

		try{
			if(markersFile.fileContents === undefined || markersFile.fileContents.length<1){return;}
			var markers = JSON.parse(markersFile.fileContents);

			if(markers === undefined || markers.listOfMarkers == undefined){return;}

			var files = Object.keys(markers.listOfMarkers);

			files.map(function(fileName){
				if(markersPrFile[fileName] === undefined){
					markersPrFile[fileName] = [];
				}
				markersPrFile[fileName].push.apply(markersPrFile[fileName], markers.listOfMarkers[fileName]);
			});

		}catch(e){
			console.log("MarkersFile:",markersFile);
			console.log("Could not parse markers JSON",markersFile);
		}
	};

	var getMarkersForFile = function(file){
		var name = "/"+file.name;
		//console.log("Getting markers for file:",name,Object.keys(markersPrFile));

		if(markersPrFile[name] !== undefined){
		//	console.log("Got markres");
			return markersPrFile[name];
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

	var _constructor = function(testsFiles){
		testsFiles.map(parseFile);
	};

	var parseFile = function(testsFile){

		try{
			if(testsFile === undefined || testsFile.fileContents.length < 1){return;}
			var tests = JSON.parse(testsFile.fileContents);
			tests.map(function(test){
				//No need for array, multiple files should reflect same value, otherwise it is a bug
				//TODO: could check time of file to only store most recent updated test
				if(testsPrClass[test.className] == undefined){
					testsPrClass[test.className] = []; 
				}

				testsPrClass[test.className].push(test);	
			});
		}catch(e){
			console.log("Could not parse test JSON",testsFile);
		}

	};

	var getTestsForFile = function(file){

		if(file === undefined){
			return [];
		}
		var packageMatch = file.fileContents.match(/\s*package (\w+);/);
		var classMatch= file.fileContents.match(/\s+public class (\w+)/);
		var packageName = null;
		var className = null;

		if(packageMatch !== null && packageMatch[1] !==null){
			packageName = packageMatch[1];
		}

		if(classMatch !== null && classMatch[1] !==null){
			className = classMatch[1];
		}

		//console.log("Getting tests for file:",file.name,packageName+"."+className+"Test",Object.keys(testsPrClass));
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
module.exports = new GitFilesToObjectsConverter();
