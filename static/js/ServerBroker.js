define(["jquery", "ClientId", "providers/FileStatsProvider"], function($, user, FileStatsProvider){
	/*
	 * Singleton that handles communication with the server
	 */

	var ServerBroker = function(){
		var SERVER_URL = "http://errorreport.steinsorhus.com/";

		var _filterIrrelevantFiles = function(file){
			var isRelevant = true;
			if(file.states.length<3){
				isRelevant = false;
			}

			return isRelevant;
		};

		var _groupByCategory = function(files){
			var categories = {};
			var outputList = [];
			var OTHER = "Other";
			categories[OTHER] = {name: "Other files",type: "",files: []};


			files.forEach(function(file){
				if(file.category === null || file.category === undefined){
					categories[OTHER].files.push(file);
				}else{
					var id = file.category.name+file.category.type;
					if(categories[id] === undefined){
						categories[id] = {
							name:file.category.name,
							type:file.category.type,
							files:[],
							states:[]
							};
					}
					categories[id].files.push(file);
				}
			});

			var categoryKeys = Object.keys(categories);
			categoryKeys.forEach(function(category){
				categories[category].states = _combineStates(categories[category].files);
				outputList.push(categories[category]);
			})

			return outputList;
		};


		var testCombineStates = function(){
			var files = [{
				states: [{
					time: 1,
					numberOfLines: 0,
					numberOfMarkers: 0,
					numberOfFailedTests: 0
				},
				{
					time: 5,
					numberOfLines: 5,
					numberOfMarkers: 0,
					numberOfFailedTests: 0
				},{
					time: 10,
					numberOfLines: 10,
					numberOfMarkers: 0,
					numberOfFailedTests: 0
				}]
			},{
				states: [{
					time: 6,
					numberOfLines: 100,
					numberOfMarkers: 0,
					numberOfFailedTests: 0
				}]
			},{
				states: [{
					time: 6,
					numberOfLines: 1,
					numberOfMarkers: 0,
					numberOfFailedTests: 0
				},
				{
					time: 8,
					numberOfLines: 2,
					numberOfMarkers: 0,
					numberOfFailedTests: 0
				},{
					time: 15,
					numberOfLines: 5,
					numberOfMarkers: 0,
					numberOfFailedTests: 0
				}]
			}];

			var got = _combineStates(files);

			return got;

		};

		var _combineStates = function(files){
			var combinedStates = []; 
			var stateGroups = files.map(function(file){return file.states;})
			var elementsRemaining = true;

			//Start on state -1, as not all should be included in the beginning
			var currentStates = stateGroups.map(function(){return -1;});

			while(elementsRemaining){

				var lowestTime = 99999999999999;

				//Find now lowest time = current state
				stateGroups.forEach(function(states,index){
					var state = states[currentStates[index]+1];
					if(state === undefined){return;}

					if(lowestTime>state.time){
						lowestTime = state.time;
					}
				});

				if(lowestTime === 99999999999999){
					elementsRemaining = false;
					continue;
				}

				// Increase states with lowest time value
				stateGroups.forEach(function(states,index){
					var state = states[currentStates[index]+1];
					if(state === undefined){return;}
					if(lowestTime === state.time){
						currentStates[index]++;
					}
				});

				var newState = {
					time: lowestTime,
					numberOfLines: 0,
					numberOfFailedTests: 0,
					numberOfMarkers: 0
				};

				// Set values on new state if time is less than or eql lowest
				stateGroups.forEach(function(states,index){
					var state = states[currentStates[index]];
					if(state === undefined){return;}

					if(state.time <= lowestTime){
						newState.numberOfLines += state.numberOfLines;
						newState.numberOfMarkers += state.numberOfMarkers;
						newState.numberOfFailedTests += state.numberOfFailedTests;
					}
				});

				combinedStates.push(newState);
			}

			return combinedStates;
		};

		var getClientFilesById = function(clientId){
			return new Promise(function(resolve,reject){

				var fileStatsProvider = new FileStatsProvider();

				$.getJSON(SERVER_URL+"timeLapse/"+clientId, function(data) {
					console.log("Parsing timelapse data");
					data = data.filter(_filterIrrelevantFiles)
					data.forEach(function(file){
						fileStatsProvider.getStatsOfFile(file);
					})
					resolve(data);
				});
			});
		};

		var getClientCategoriesById = function(clientId){
			return new Promise(function(resolve,reject){

				var fileStatsProvider = new FileStatsProvider();

				$.getJSON(SERVER_URL+"timeLapse/"+clientId, function(data) {
					console.log("GOT ",data);
					console.log("Parsing data");
					data = data.filter(_filterIrrelevantFiles)
					data.forEach(function(file){
						fileStatsProvider.getStatsOfFile(file);
					})

					data  = _groupByCategory(data);

					data.forEach(function(category){
						fileStatsProvider.getStatsOfFile(category);
					})


					resolve(data);
				});
			});
		};

		var getClientsInCategory = function(category){
			return new Promise(function(resolve,reject){

				$.getJSON(SERVER_URL+"category/client", function(data) {
					resolve(data);
				});
			});
		};

		var getClientList= function(){
			return new Promise(function(resolve,reject){

				$.getJSON(SERVER_URL+"client", function(data) {
					resolve(data);
				});
			});
		};

		var getClientId = function(name){
			return new Promise(function(resolve,reject){

				$.getJSON(SERVER_URL+"client/"+name, function(data) {
					var id= data.id;
					resolve(id);
				});
			});
		};

		var getMarkerTypes = function(){
			return new Promise(function(resolve, reject){
				$.getJSON(SERVER_URL+"markertypes/", function(data) {
					resolve(data);
				});
			});
		};

		var getMarkerTypesByCategory = function(){
			return new Promise(function(resolve, reject){
				$.getJSON("markertypesbycategory/", function(data) {
					resolve(data);
				});
			});
		};

		return{
			getClientFilesById: getClientFilesById,
			//getClientCategoriesById: getClientCategoriesById,
			getClientsInCategory:getClientsInCategory,
			getClientId: getClientId,
			//getMarkerTypes: getMarkerTypes,
			//getMarkerTypesByCategory: getMarkerTypesByCategory,
			getClientList: getClientList
		};
	};
	window.ServerBroker = ServerBroker;
	return ServerBroker;
});
