"use strict";

import ClientStore from "stores/ClientStore";
import CategoryStore from "stores/CategoryStore";
import ExpressionStore from "stores/ExpressionStore";
import _ from "lodash";

var InspectPageController = function(statsStore){

	var _client = {states: [], clientId:""};
	var _selectedCategory = { name: "", states: [], files: []};
	var _clientList = [];
	var _categoryList = [];
	var _files = [];
	var _statsSections = [];
	var _currentState = [];
	var _clientStates = [];

	constructor();
	function constructor(){
		CategoryStore.getCategoryList().then(function(list){
			_categoryList = list;
			statsStore.setState(getCurrentState());
		});

		ExpressionStore.subscribe(function(){
			statsStore.setState(getCurrentState());
		});

		statsStore.setState(getCurrentState());
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

		return {
			statsSections: _statsSections,
			client: _client,
			clientList: _clientList,
			selectedCategory: _selectedCategory,
			categoryList: _categoryList,
			files: _files,
			clientStates: _clientStates,
			currentState: _currentState,
			expressions: ExpressionStore.getExpressions()
		};
	}

	function onChangeCategory (category){
		_getCategory(category).then(function(category){
			_selectedCategory = category;
			_clientList = category.users;
			_currentState = category.states[0];

			statsStore.setState(getCurrentState());
			console.log("Category was changed: ", category);
		});
	}

	function _getCategory(category){
		return new Promise(function(resolve, reject){

			CategoryStore.getCategory(category.name, category.type).then(function(category){
				_clientList = category.clients;
				resolve(category);
			});
		});
	}

	function onChangeClient(client){
		_client = client;
		_clientStates = client.getCategory(_selectedCategory.name, _selectedCategory.type).states;

		// Retrieve files
		var fileList = _selectedCategory.getFiles();

		var promises = fileList.map((file)=>{
			// Need to return a new promise as promise.all rejects even if only one promise rejects
			// so we need to resolve all promises in case of error
			return new Promise((resolve, reject) =>{
				client.getFileContents(file).then((result)=>{
					resolve(result);
				},(error)=>{resolve(false);});
			})
		});

		Promise.all(promises).then((files)=>{
			files = files.filter(function(file){return file !== false;});
			_files = files;
			statsStore.setState(getCurrentState());
		});
	}

	function onChangeState(state){
		_currentState = state;
		statsStore.setState(getCurrentState());
	}

	return {
		onChangeCategory: onChangeCategory,
		onChangeClient: onChangeClient,
		onChangeState: onChangeState,
		getCurrentState: getCurrentState
	};
};

export default InspectPageController;
