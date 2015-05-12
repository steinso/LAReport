"use strict";

import FileStatsProvider from "../providers/FileStatsProvider";
import _ from "lodash";
/*
 * Combines the states of several files by either adding, or averaging.
 * Usecases include:
 * 	add: getting total LOC over time for all files in a category
 * 	average: getting avaerage LOC over time for all users in a category/file
 */

function StateCombiner(){

	var fileStatsProvider = new FileStatsProvider();
	/*
	 * Combines the states of several files by adding them together.
	 * Used for combining file states into Category states, so you get
	 * overall LOC etc.
	 */
	function add(files){
		var combinedStates = []; 
		var stateGroups = files.map(function(file){return file.states;});
		var elementsRemaining = true;

		//Start on state -1, as not all should be included in the beginning
		var currentStates = stateGroups.map(function(){return -1;});
		//currentStates containes index of current state in each stateGroup

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
			// This makes the index of files that have not been started yet -1
			// thus in the next state it will be deemed undefined and that 
			// states LOC will not be added untill it is increased to 0
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
				numberOfTests: 0,
				numberOfMarkers: 0
			};

			// Set values on new state if time is less than or eql lowest
			stateGroups.forEach(function(states,index){
				var state = states[currentStates[index]];
				if(state === undefined){return;}

				if(state.time <= lowestTime){
					newState.numberOfLines += state.numberOfLines;
					newState.numberOfMarkers += state.numberOfMarkers;
				}
			});

			//Failed tests are handeled differently as they should always be a sum of all the files
			//regardless if a file is started
			stateGroups.forEach(function(states, index){

				var stateIndex = currentStates[index];
				if(stateIndex < 0){
					stateIndex = 0;
				}
				var state = states[stateIndex];
				if(state === undefined){return;}

				newState.numberOfFailedTests+= state.numberOfFailedTests;
				newState.numberOfTests+= state.numberOfTests;
			});

			combinedStates.push(newState);
		}

		return combinedStates;
	}

	function average(files){
		var averageStates = [];
		//Add workingTime to each file
		files.forEach((file)=>{
			file = fileStatsProvider.getStatsOfFile(file);
		});

		files = files.filter((file)=>{ return file.states.length>0; });

		var descreteTimeSteps = _getDiscreteTimeSteps(files);

		averageStates = descreteTimeSteps.map((timeStep)=>{ return _getAverageAtTime(files, timeStep);});

		return averageStates;
	}

	function _getDiscreteTimeSteps(files){
		//Find needed steps by getting the user with the longest timeframe,
		// and finding the user with the most states, and combining that
		// Non optimal, could probably be improved

		var longestTime = files.map((file)=>{return _.max(file.states,(state)=>{return state.workingTime;});});
		longestTime = _.max(longestTime, (state)=>{return state.workingTime;}).workingTime;

		var mostStates = files.map((file)=>{ return file.states.length;});
		mostStates = _.max(mostStates);

		var step = longestTime/mostStates;

		// add step*2 as _ does not include last value in range
		return _.range(0,longestTime+step*2,step);
	}

	function _getAverageAtTime(files, time){
		var states = files.map((file)=>{ return _getStateAtTime(file.states, time); });

		var initial = {};
		if(states.length === 0){throw new Error("Empty states!");}
		var props = Object.keys(states[0]);
		props.forEach((prop)=>{ initial[prop]=0;});

		var total = states.reduce((prev, current)=>{
			var keys = Object.keys(current);
			keys.forEach((key)=>{
				prev[key] += current[key];
			});

			return prev;
		}, initial);

		props.forEach((prop)=>{
			total[prop] = total[prop]/states.length;
		});

		//Set correct time
		total.time = time;

		return total;
	}

	function _getStateAtTime(user, time){
		var prev;
		var state;
		for(var i=0; i<user.length;i++){
			var curState = user[i];

			if(curState.workingTime >= time){
				state = curState;
				break;
			}
			prev = curState;
		}

		// Return last state if time is after user finished
		if(state === undefined){
			return user[user.length-1];
		}

		// Return first state if it is before user started
		if(prev === undefined){
			return user[0];
		}

		return prev;
	}


	return {
		add: add,
		average: average
	};
}

export default new StateCombiner();
