
var StateAnalytics = function(){

	var getAnalyticsOfStates= function(states){
		// Extends the input object
		return new Promise(function(resolve,reject){


			states.map(function(state){

				state.files.map(function(file){
					countLines(file);
					countMarkers(file);
					countFailedTest(file);
				});
			});

			resolve(states);
		});
	};

	var countLines = function(file){
		if(file !== undefined){
		file.numberOfLines = file.fileContents.split("\n").length-1;
		}
	};

	var countMarkers = function(file){
		file.numberOfMarkers = file.markers.length;
		
	};

	var countFailedTest= function(file){
		file.numberOfFailedTests= file.tests.length;
	};

	return{
		countLines:countLines,
		getAnalyticsOfStates:getAnalyticsOfStates
	};
};

module.exports = new StateAnalytics();
