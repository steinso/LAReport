//define(["react", "Store", "jsx!components/FileList", "ServerBroker"], function(React, Store, FileList, ServerBroker){
import React from "react";
import Store from "Store";
import FileList from "components/FileList";
import ServerBroker from "ServerBroker";

	var InspectPage = function(){
		function getElement(){
			var repoStore = new Store();
			var FileStateTimeLapseElement = React.createElement(FileStateTimeLapse, {store: repoStore});
			return FileStateTimeLapseElement;
		}

		return {
			getElement: getElement
		};
	};

	var FileStateTimeLapse = React.createClass({


		getMarkersFile: function(state){
			return this.getFileByName(state,".markers.json");
		},
		getTestsFile: function(state){
			return	this.getFileByName(state,".tests.json");
		},
		getFileByName: function(state,fileName){
			return state.files.filter(function(file){if(file.name === fileName){return file;}})[0];
		},
		getInitialState: function(){
			var states = this.props.states;
			var currentState = states[0];
			var markersFile = this.getMarkersFile(currentState);
			var testsFile = this.getTestsFile(currentState);
			var selectedFile = currentState.files[0];
			console.log("STATE: ",currentState,selectedFile,markersFile,testsFile);
			return {
				states:states,
				currentState:currentState,
				selectedFile:selectedFile,
				markersFile: markersFile,
				testsFile: testsFile
			}
		},
		updateStateGivenSelectedState: function(state){

			var markersFile = this.getMarkersFile(state);
			var testsFile = this.getTestsFile(state);
			var selectedFile = this.getFileByName(state,this.state.selectedFile.name);
			this.setState({
				markersFile:markersFile,
				testsFile:testsFile,
				selectedFile:selectedFile
			})
		},
		onFileChange: function(fileName){
			var selectedFile =this.state.currentState.files.filter(function(state){
				if(state.name == fileName){
					return true;
				}	
				return false;
			});

			this.setState({
				selectedFile:selectedFile[0]
			})
			console.log("Changing file to: ",fileName);
		},
		onStateChange: function(state){
			console.log("Changing state to: ",state.time);
			this.updateStateGivenSelectedState(state);
			this.setState({
				currentState:state,

			})
		},
		render: function(){
			var fileNames = this.state.currentState.files.map(function(file){return file.name;})
			return (
				<div>
				<div className="inspectPage">
				<FileList fileNames={fileNames} onFileChange={this.onFileChange}/>
				<FileDisplay className="mainFileDisplay" file={this.state.selectedFile} />
				</div>
				<StateSelector states={this.state.states} onStateChange={this.onStateChange}/>
				</div>
			);

		}
	});

	// tutorial1.js

	var FileDisplay = React.createClass({
		render: function() {
			var className = "fileDisplay "+this.props.className;
			return (
				<textarea readOnly="readOnly" className={className} value={this.props.file.fileContents}>
				</textarea>
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

