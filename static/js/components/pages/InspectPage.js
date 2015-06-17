"use strict";
//define(["react", "Store", "jsx!components/FileList", "ServerBroker"], function(React, Store, FileList, ServerBroker){
import React from "react/addons";
import Store from "Store";
import FileList from "components/FileList";
import InspectPageController from "controllers/InspectPageController";
import ListButton from "components/ListButton";
import Chart from "components/charts/Chart";
import Highlight from "react-highlight";

var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;


	var InspectPage = function(){
		function getElement(){
			var inspectStore = new Store();
			var dispatcher = new InspectPageController(inspectStore);
			var ExerciseTimelapseElement = React.createElement(ExerciseTimelapse, {store: inspectStore, dispatcher: dispatcher});
			return ExerciseTimelapseElement;
		}

		return {
			getElement: getElement
		};
	};

	var ExerciseTimelapse = React.createClass({

		propTypes: {
			store: React.PropTypes.object,
			dispatcher: React.PropTypes.object
		},

		getInitialState: function(){
			this.props.store.addListener(this._onStoreChange);
			return this.props.store.getState();
		},

		_onCategoryChange: function(categoryName){
			var category = this.state.categoryList.reduce(function(acc, category){
				if(category.name === categoryName){
					return category;
				}
				return acc;
			}, null);

			this.props.dispatcher.onChangeCategory(category);
		},

		_onClientChange: function(clientId){
			var client = this.state.clientList.reduce(function(acc, client){
				if(client.clientId === clientId){
					return client;
				}
				return acc;
			});
			this.props.dispatcher.onChangeClient(client);
		},

		_onStateChange: function(state){
			//console.log("Changing state to: ",state.time);
			this.props.dispatcher.onChangeState(state);
		},

		_onStoreChange: function(state){
			this.setState(state);
			console.log("stateChange",this.state);
		},

		render: function(){

			var categoryNames = this.state.categoryList.map((category)=>{return category.name;});
			var clientIds = this.state.clientList.map((client)=>{return client.clientId;});


			var clientChooser = <ListButton heading="Participant" elements={clientIds} currentElement={this.state.client.clientId} onClick={this._onClientChange} />
			var categoryChooser = <ListButton heading="Assignments" elements={categoryNames} currentElement={this.state.selectedCategory.name} onClick={this._onCategoryChange} />


			var fileDisplays = this.state.files.map((file)=>{
				var fileMeta = this.state.client.getFile(file.contentName);

				return (
					<FileDisplay className="mainFileDisplay" file={file} fileMeta={fileMeta} time={this.state.currentState.time}/>
				);
			});
			// How does state work?  should they all follow same overall category states? In that case, how do we make intermediary states?
			
			var charts = this.state.expressions.map((expression)=>{
				return <Chart className="smallChart" data={this.state.clientStates} expression={expression} selected={this.state.currentState} />
			});

			var time = new Date(this.state.currentState.time).toString();

			return (
				<div className="flex row">
				<div className="flex horizNav">
				{categoryChooser}
				{clientChooser}
				</div>
				{fileDisplays}
				<div className="flex row">
				<div> Time : {time}</div>
				</div>
				<div className="flex row">
				{charts}
				</div>
				<StateSelector states={this.state.clientStates} onStateChange={this._onStateChange}/>
				</div>
			);

		}
	});


	var FileDisplay = React.createClass({

		getClosestState: function(states, time){
			var closestState = {};

			for(var i=0;i<states.length;i++){
				if(states[i].time > time){
					break;
				}
				closestState = states[i]; 
			}

			return closestState;
		},

		render: function() {
			var className = "fileDisplay "+this.props.className;
			var closestState = this.getClosestState(this.props.file.states, this.props.time);
			var contents = closestState.fileContents || "<Empty>";
			
			var lines = contents.split("\n");
			var numSquareBrackets = 0;
			var numEmptyLines= 0;
/*
			var DOMLines = lines.map((line, index) => {
				var key = btoa(line);
				var className = "line";
				if(line.trim() === "}"){
					key+=index;
					className+= " ignore";
				}
				if(line.trim() === ""){
					key+=index;
					className+= " ignore";
				}
				return <div key={key} className={className}><span className="num">{index}</span><span>{line}</span></div>;
			});

				<ReactCSSTransitionGroup transitionName="example">
				</ReactCSSTransitionGroup>
				<textarea readOnly="readOnly" className={className} value={contents}>
			*/


			var fileMetaState = this.getClosestState(this.props.fileMeta.states,this.props.time);
			var fileMetaContent = "<NoTests>";

			if(fileMetaState.time !== undefined){

				fileMetaContent = fileMetaState.tests.map(function(test){
					return <li>{test.methodName+": "+test.result}</li>;
				});
			}
			fileMetaContent = <ul>{fileMetaContent}</ul>;


			return (
				<div className="FileDisplay">
				<div className="codeDisplay">
				<Highlight className="java">
				{contents}
				</Highlight>
				</div>

				<div>{fileMetaContent}</div>
				</div>
			);
		}
	});

	var StateSelector = React.createClass({
		onChange: function(event){
			var stateNumber = this.refs.slider.getDOMNode().value;
			this.props.onStateChange(this.props.states[stateNumber]);
		},
		render: function() {
			return (
				<input ref="slider" type="range" className="rangeSlider" onChange={this.onChange} id="commitChooser" min={0} max={this.props.states.length-1} />
			);
		}
	});


export default InspectPage;

