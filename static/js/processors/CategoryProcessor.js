"use strict";
import ClientProcessor from "processors/ClientProcessor";
import StateCombiner from "processors/StateCombiner";

function CategoryProcessor(){

	function process(name, type, userList){
		var category = _createEmptyCategory(name, type);
		category = _addUsersToCategory(category, userList);
		category = _addAverageStatesToCategory(category);
		return category;
	}

	function _createEmptyCategory(name, type){
		var category = {
			name: name,
			type: type
		};

		return category;
	}

	function _addUsersToCategory(category, userList){
		var clientIds = Object.keys(userList);
		category.users = clientIds.map((id)=>{return ClientProcessor.process(userList[id]);});
		return category;
	}

	function _addAverageStatesToCategory(category){
		var userStates = category.users.map((user)=>{return user[0];});
		category.states = StateCombiner.average(userStates);
		return category;
	}

	return {
		process: process
	};
}

export default new CategoryProcessor();
