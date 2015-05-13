"use strict";
import FileStatsProvider from "providers/FileStatsProvider";
import StateCombiner from "processors/StateCombiner";

class User{
	constructor(obj){
		this.files = obj.files;
		this.categories = obj.categories;
		this.clientId = obj.clientId;
	}

	getCategory(name,type){
		var categoryFound = false;

		this.categories.forEach((category)=>{
			if(category.name === name && category.type === type){
				categoryFound = category;
			}
		});

		return categoryFound;
	}
}

function ClientProcessor(){

	function _filterIrrelevantFiles(file){
		var isRelevant = true;
		if(file.states.length<3){
			isRelevant = false;
		}

		return isRelevant;
	}

	function _groupByCategory(files){
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
						name: file.category.name,
						type: file.category.type,
						files: [],
						states: []
					};
				}

				categories[id].files.push(file);
			}
		});

		var categoryKeys = Object.keys(categories);
		categoryKeys.forEach(function(category){
			categories[category].states = StateCombiner.add(categories[category].files);
			outputList.push(categories[category]);
		});

		return outputList;
	}

	function process(client){

		var fileStatsProvider = new FileStatsProvider();
		var files = client.files;
		files = files.filter(_filterIrrelevantFiles);

		files.forEach(function(file){
			fileStatsProvider.getStatsOfFile(file);
		});

		var categories = _groupByCategory(files);

		categories.forEach(function(category){
			fileStatsProvider.getStatsOfFile(category);
		});

		client.files = files;
		client.categories = categories;



		return new User(client);
	}

	return {
		process: process
	};
}

export default new ClientProcessor();
