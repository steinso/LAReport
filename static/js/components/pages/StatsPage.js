//define(["react","d3","Store","providers/FileStatsProvider","jsx!components/ClientChooser","jsx!components/FileList","jsx!components/CategoryList","jsx!components/charts/LocOverTime","ServerBroker","models/Workspace","ClientId","jsx!components/StatsBar"],function(React,d3,Store,FileStatsProvider,ClientChooser,FileList,CategoryList,LocOverTimeChart,ServerBroker,Workspace,clientId,StatsBar){
import React from "react";
import Store from "Store";
import ListButton from "components/ListButton";
import CategoryList from "components/CategoryList";
import LocOverTimeChart from "components/charts/LocOverTime";
import MarkerStore from "stores/MarkerStore";
import ClientStore from "stores/ClientStore";
import clientId from "ClientId";
import StatsBar from "components/StatsBar";

	var StatsPage = function(){

		function getElement() {

			var statsStore = new Store();
			var dispatcher = new Dispatcher(statsStore);

			return React.createElement(StatsPageComponent,{store:statsStore,dispatcher:dispatcher});
		}

		return {
			getElement:getElement
		};
	};

	var Dispatcher = function(statsStore){
		var _states = []; //FileStates
		var _statsSections = [];
		var _categories = [];
		var _currentFile = {};
		var _clientList = [];
		var _selectedClient = "";

		constructor();
		function constructor(){
			statsStore.setState(getCurrentState());

			ClientStore.getClientList().then(function(clientList){
				_clientList = clientList;
				console.log("Clients:",_clientList);
				statsStore.setState(getCurrentState());
			});

			_selectedClient = clientId.id;
			onChangeClient(_selectedClient);
		};

		function _calulateStatsSections(){
			var time = "?";
			var testsFailed = "?";
			var errors = "?";
			var title = "Oppgave ?"

			if(_currentFile !== undefined && _currentFile.states !== undefined && _currentFile.states.length>0){
				var lastState = _currentFile.states[_currentFile.states.length-1] || {};
				time = Math.round(lastState.workingTime);
				testsFailed = lastState.numberOfFailedTests;
				errors = lastState.numberOfMarkers;
				title = _currentFile.name;
			}

			 _statsSections = [
				{type:"title",title:title},
				//{type:"stats",value:time+" min",avg:"? min", title:"Time spent"},
				//{type:"stats",value:testsFailed,avg:"?", title:"Tests failed"},
				//{type:"stats",value:errors,avg:"?", title:"Markers"}

				{type:"stats",value:time+" min",avg:"", title:"Time spent"},
				{type:"stats",value:testsFailed,avg:"", title:"Tests failed"},
				{type:"stats",value:errors,avg:"", title:"Markers"}
				//{type:"stats",value:"? min",avg:"? min", title:"Correcting error"}
			];


		}

		function getCurrentState(){
			_calulateStatsSections();
			return {
				currentFile: _currentFile,
				categories: _categories,
				states: _states,
				clientList: _clientList,
				statsSections: _statsSections,
				selectedClient: _selectedClient
			};
		}
		function onChangeFile (file){
			_currentFile = file;
			statsStore.setState(getCurrentState());
			console.log("File was changed: ",file);
		}

		function onChangeClient(clientId){

			_selectedClient = clientId;
			_updateStates();
			statsStore.setState(getCurrentState());
			console.log("Client changed to: "+clientId,"FEATURE NOT IMPLEMENTED");
		}

		function _updateStates(){
			ClientStore.getClient(_selectedClient).then(function(categories){
				_categories = categories.categories;
				console.log("Got new client files:",_categories);
				statsStore.setState(getCurrentState());
			},function(error){
				alert("Client not found..");
			});
		}

		return {
			onChangeFile:onChangeFile,
			onChangeClient:onChangeClient,
			getCurrentState:getCurrentState
		};
	};

	var StatsPageComponent = React.createClass({
		propTypes:{
			store:React.PropTypes.object,
			dispatcher:React.PropTypes.object
		},

		getInitialState: function(){
			this.props.store.addListener(this._onStateChange);
			return this.props.store.getState();
		},

		_onStateChange: function(state){
			this.setState(state);
			console.log("stateChange",this,state);
		},

		_onFileChange: function(file){

			this.props.dispatcher.onChangeFile(file);
		},

		_onClientChange: function(client){
			this.props.dispatcher.onChangeClient(client);
		},
		render: function() {
			var chart = {};
			var chooser = {};
			var fileName = {};
			console.log("Privilege: ",clientId.privilege)
			if(this.state.currentFile !== undefined && this.state.currentFile.states !== undefined && this.state.currentFile.states.length>0 ){
				chart = <LocOverTimeChart className="chart" fileStates={this.state.currentFile.states}/>
			}

			clientId.privilege = "admin";

			if(this.state.clientList.length>1 && clientId.privilege!=="user"){
				chooser = <ListButton heading="Participant" elements={this.state.clientList} currentElement={this.state.selectedClient} onClick={this._onClientChange}/>
			}

			return (
				<div className="flex row">
				<StatsBar sections={this.state.statsSections} />
			<div className="flex horizNav">
				{chooser}
				</div>
				<div className="flex">
				<CategoryList categories={this.state.categories} selectedElement={this.state.currentFile.name} onFileChange={this._onFileChange}/>
				{chart}
				</div>
				</div>
			);
		}
	});

	export default StatsPage; 

