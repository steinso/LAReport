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
		category.users = userList.map((user)=>{return ClientProcessor.process(user);});
		return category;
	}

	function _addAverageStatesToCategory(category){
		var userStates = category.users.map((user)=>{return user.getCategory(category.name, category.type);});
		userStates = userStates.filter((states)=>{return states !== false;});
		category.states = StateCombiner.average(userStates);
		return category;
	}

	return {
		process: process
	};
}

export default new CategoryProcessor();
