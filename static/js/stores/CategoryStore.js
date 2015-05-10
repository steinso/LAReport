"use strict";
import $ from "jquery";
import Config from "Config";
import CategoryProcessor from "processors/CategoryProcessor";

function CategoryStore(){
	var _categoryList = [];
	var _categories = {};
	var _promisesInProgress = {};

	function getClientsInCategory(name, type){
		return new Promise(function(resolve, reject){
			var data= {name: name, type: type};

			$.getJSON(Config.SERVER_URL+"category/client", data, function(clients) {
				resolve(clients);
			});
		});
	}

	function getCategory(name, type){
		if(_promisesInProgress['getCategory'+name+type] !== undefined){
			return _promisesInProgress['getCategory'+name+type];
		}

		var promise = new Promise(function(resolve, reject){
			var category = _categories[name+type];

			if(category === undefined){
				getClientsInCategory(name, type).then(function(clients){

					category = CategoryProcessor.process(name, type, clients);

					_categories[name+type] = category;
					_categoryList.push(category);
					_promisesInProgress['getCategory'+name+type] = undefined;
					resolve(category);
				});

			}else{
				resolve(category);
			}
		});

		_promisesInProgress['getCategory'+name+type] = promise;
		return promise;
	}

	function getCategoryList(){
		return new Promise(function(resolve, reject){
			$.getJSON(Config.SERVER_URL+"/category", function(categoryList){
				resolve(categoryList);
			});
		});
	}

	return{
		getCategoryList: getCategoryList,
		getCategory: getCategory,
		getClientsInCategory: getClientsInCategory
	};
}

export default new CategoryStore();
