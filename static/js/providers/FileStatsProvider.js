define(['jquery','lodash'],function($,_){

	var FileStatsProvider= function(userId){
		_userId = userId;

		function getStatsOfFile(file){
			return new Promise(function(resolve,reject){
					var fileData = []; 
					file.states = _.sortBy(file.states,function(state){
						return state.time;
					});

					var startDate = +new Date(file.states[0].time);
					var buffer = 0;
					var idleThreshold = 10*60*1000; //assumed idle after x ms
					var previousTime = startDate;

					file.states.map(function(state){
						var time = +new Date(state.time);
						var timeSinceLastChange = time - previousTime;
						if(timeSinceLastChange > idleThreshold){
							buffer += timeSinceLastChange-idleThreshold;
							state.idle = timeSinceLastChange-idleThreshold;
						}
						previousTime = time;

						state.workingTime = time-startDate-buffer;
						state.workingTime /= 1000*60;
					});
					if(file.states.length<1){
						reject("File contains no states: "+fileName);
					}
					resolve(file);
			});
		}

		return{
			getStatsOfFile:getStatsOfFile
		};
	};

	return FileStatsProvider; 
});
