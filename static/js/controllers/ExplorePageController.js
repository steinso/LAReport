"use strict";

import ClientStore from "stores/ClientStore";
import CategoryStore from "stores/CategoryStore";
import ExpressionStore from "stores/ExpressionStore";
import _ from "lodash";

var ExplorePageController = function(statsStore){
	var _states = { //FileStates
		userStates: [],
		categoryStates: [],
		referenceStates: [],
		selectedStates: []
	};

	var _extraCategories = [];
	var _extraClients = [];
	var _statsSections = [];
	var _clientList = [];
	var _selectedClient = {};
	var _categoryList = [];
	var _selectedCategory = "";
	var _expressionVariables = [];

	constructor();
	function constructor(){

		//_loadStoredExpressions();

		_getClientList().then(function(){
			_getSomeClientComparisons();
			_getSomeReferenceComparisons();
			//Not needed as categories as within same user
			_getSomeCategoryComparisons();

		});
		statsStore.setState(getCurrentState());
	}

	function _getClientList(){
		return new Promise(function(resolve, reject){
			ClientStore.getClientList().then(function(clientList){
				_clientList = clientList;
				statsStore.setState(getCurrentState());
				console.log("Clients:", _clientList);
				resolve(_clientList);
			});
		});
	}


	function _getSomeClientComparisons(){
		var numberOfClientComparations = 4;
		var clients = _.sample(_clientList, numberOfClientComparations);
		var promises = [];

		// Retrieve categories for all clients choosen
		clients.map(function(client){

			var promise = ClientStore.getClient(client).then(function(categoryList){
				return categoryList;
			});

			promises.push(promise);
		});

		Promise.all(promises).then(function(clientCategoriesList){
			console.log("Comparable clients received: ", clientCategoriesList);
			_extraClients = clientCategoriesList;
			statsStore.setState(getCurrentState());

		},function(error){
			console.error("Error retrieving comparable clients: ",error);
		});
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
			_extraCategories = categoryList;
			statsStore.setState(getCurrentState());

		},function(error){
			console.error("Error retrieving extra categories: ", error);
		});
		});
	}

	function _getSomeReferenceComparisons(){

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

		_states.selectedState = _selectedCategory.states;

		_states.categoryStates = [_selectedCategory.states ,_selectedCategory.states];
		_states.categoryStates = _extraCategories.map(function(category){ return category.states;});
		_states.userStates = _extraClients.map(function(clientCategories){
			return clientCategories.reduce(function(prev,current){
				if(current.name === _selectedCategory.name){
					prev = current.states;
				}
				return prev;
			},{});
		});

		_states.referenceStates = [_selectedCategory.states, _selectedCategory.states];

		return {
			states: _states,
			clientList: _clientList,
			selectedClient: _selectedClient,
			categoryList: _categoryList,
			selectedCategory: _selectedCategory,
			statsSections: _statsSections,
			expressions: ExpressionStore.getExpressions(),
			expressionVariables: _expressionVariables
		};
	}

	function onChangeCategory (category){
		_selectedCategory = category;
		var state = category.states[0];
		_expressionVariables = ExpressionStore.createExpressionVariables(state);

		statsStore.setState(getCurrentState());
		console.log("Category was changed: ", category);
	}

	function onAddExpression(rawExpression){
		ExpressionStore.addRawExpression(rawExpression, _expressionVariables);
	}

	function onChangeClient(clientId){

		_selectedClient = clientId;
		_updateStates();
		statsStore.setState(getCurrentState());
		console.log("Client changed to: "+clientId);
	}

	function _updateStates(){
		ClientStore.getClient(_selectedClient).then(function(categoryList){
			_categoryList = categoryList;
			console.log("Got new client files:",_categoryList);
			statsStore.setState(getCurrentState());
		},function(error){
			alert("Client not found..");
		});
	}

	return {
		onChangeCategory: onChangeCategory,
		onChangeClient: onChangeClient,
		onAddExpression: onAddExpression,
		getCurrentState: getCurrentState
	};
};

export default ExplorePageController;
