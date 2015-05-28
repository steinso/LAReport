"use strict";
import ClientProcessor from "processors/ClientProcessor";
import StateCombiner from "processors/StateCombiner";
import _ from "lodash";

class Category{
	constructor(name, type){
		this.name = name;
		this.type = type;
		this.users = [];
		this.state = [];
	}

	getFiles(){
		var fileList = [];
		this.users.forEach((user)=>{
			var category = user.getCategory(this.name, this.type);
			if(!category){return;}
			category.files.forEach((file)=>{
				fileList.push(file.contentName);
			});
		});

		fileList = _.uniq(fileList);

		return fileList;
	}

}

function CategoryProcessor(){

	function process(name, type, userList){
		var category = new Category(name, type);
		category = _addUsersToCategory(category, userList);
		category = _addAverageStatesToCategory(category);
		return category;
	}

	function _addUsersToCategory(category, userList){
		category.users = userList.map((user)=>{return ClientProcessor.process(user);});
		//category.users.filter((user)=>{return user.getCategory(category.name, category.type) !== undefined && })
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
