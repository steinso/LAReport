"use strict";
import FileStatsProvider from "providers/FileStatsProvider";
import StateCombiner from "processors/StateCombiner";

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

	function process(data){

		var fileStatsProvider = new FileStatsProvider();
		data = data.filter(_filterIrrelevantFiles);
		data.forEach(function(file){
			fileStatsProvider.getStatsOfFile(file);
		});

		data = _groupByCategory(data);

		data.forEach(function(category){
			fileStatsProvider.getStatsOfFile(category);
		});

		return data;
	}

	return {
		process: process
	};
}

export default new ClientProcessor();
