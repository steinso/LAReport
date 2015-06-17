"use strict";
import _ from "lodash";
	var FileStatsProvider= function(){

		function getStatsOfFile(file){
			file.states = _.sortBy(file.states,function(state){
				return state.time;
			});

			if(file.states.length<1){
				//reject("File contains no states: "+file.name);
				return file;
			}

			var startDate = +new Date(file.states[0].time);
			var buffer = 0;
			var idleThreshold = 5*60*1000; //assumed idle after x ms
			var lengthOfIdle = 1000*60*2; //show idle time as 2 minute
			var previousTime = startDate;

			file.states.map(function(state){
				var time = +new Date(state.time);
				var timeSinceLastChange = time - previousTime;
				if(timeSinceLastChange > idleThreshold){
					buffer += timeSinceLastChange-lengthOfIdle;
					state.idle = timeSinceLastChange-lengthOfIdle; //Report 5 min not idle
				}
				previousTime = time;

				state.workingTime = time-startDate-buffer;
				state.workingTime /= 1000*60;
			});

			return file;
		}

		return{
			getStatsOfFile: getStatsOfFile
		};
	};

export default FileStatsProvider;
