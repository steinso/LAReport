"use strict";

import ClientStore from "stores/ClientStore";
import CategoryStore from "stores/CategoryStore";
import ExpressionStore from "stores/ExpressionStore";
import _ from "lodash";

var ExamineExpressionPageController = function(statsStore){
	var _states = { //FileStates
		userStates: []
	};

	var _statsSections = [];
	var _clientList = [];
	var _categoryList = [];
	var _mainCategoryStates = [];
	var _selectedCategory = "";
	var _expressionVariables = [];
	var _users = [];

	constructor();
	function constructor(){
		CategoryStore.getCategoryList().then(function(list){
			_categoryList = list;
			statsStore.setState(getCurrentState());
		});

		statsStore.setState(getCurrentState());
	}

	function _getSomeCategoryComparisons(){

		var promises = [];
		var numberOfCategoryComparations = 2;
		var categorySample = []; //Get sample of categories
		CategoryStore.getCategoryList().then(function(categoryList){
			categorySample = _.sample(categoryList, numberOfCategoryComparations);

			return categorySample;

		}).then(function(categorySample){

		categorySample.map(function(category){

			var promise = CategoryStore.getCategory(category.name, category.type).then(function(category){
				return category;
			});
			promises.push(promise);
		});

		Promise.all(promises).then(function(categoryList){
			console.log("Extra categories received: ", categoryList);
			statsStore.setState(getCurrentState());

		},function(error){
			console.error("Error retrieving extra categories: ", error);
		});
		});
	}

	function _getCategory(category){
		return new Promise(function(resolve, reject){

			CategoryStore.getCategory(category.name, category.type).then(function(category){
				_users = category.users.map(function(user){
					return user[0];
				});
				_users = _users.filter(function(user){return user.states.length>1;})
				resolve(category);
			});
		});
	}


	function _calulateStatsSections(){
		var time = "?";
		var testsFailed = "?";
		var errors = "?";
		var title = "Oppgave ?";

		_statsSections = [
			{type: "title", title: title},
			{type: "stats", value: time+" min", avg: "? min", title: "Time spent"},
			{type: "stats", value: testsFailed, avg: "?", title: "Tests failed"},
			{type: "stats", value: errors, avg: "?", title: "Markers"}
			//{type:"stats",value:"? min",avg:"? min", title:"Correcting error"}
		];
	}

	function getCurrentState(){
		_calulateStatsSections();

		_mainCategoryStates = _selectedCategory.states;
		//_states.categoryStates = _extraCategories.map(function(category){ return category.states;});
		/*_states.userStates = _extraClients.map(function(clientCategories){*/
			//return clientCategories.reduce(function(prev,current){
				//if(current.name === _selectedCategory.name){
					//prev = current.states;
				//}
				//return prev;
			//},{});
		/*});*/

		_states.userStates = _users.map(function(user){return user.states;});

		return {
			states: _states,
			clientList: _clientList,
			categoryList: _categoryList,
			selectedCategory: _selectedCategory,
			statsSections: _statsSections,
			expressions: ExpressionStore.getExpressions(),
			expressionVariables: _expressionVariables,
			mainCategoryStates: _mainCategoryStates
		};
	}

	function onChangeCategory (category){
		_getCategory(category).then(function(category){
			_selectedCategory = category;
			var state = category.states[0];
			_expressionVariables = ExpressionStore.createExpressionVariables(state);

			statsStore.setState(getCurrentState());
			console.log("Category was changed: ", category);
		});
	}

	function onAddExpression(rawExpression){
		ExpressionStore.addRawExpression(rawExpression, _expressionVariables);
	}

	return {
		onChangeCategory: onChangeCategory,
		onAddExpression: onAddExpression,
		getCurrentState: getCurrentState
	};
};

export default ExamineExpressionPageController;
