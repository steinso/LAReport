define(['react','jquery','Markers','StartUpLoading','ServerBroker','jsx!components/Navbar'],function(React,$,Markers,StartUpLoading,ServerBroker,NavBar){

	var test = "fun";
	var fileContents = "";
	var markerContents = "";
	var logContents = "";
	var fileCommits;
	var markers = new Markers();
	var startUpLoading = new StartUpLoading();
	var serverBroker = new ServerBroker();


	var fileModel = function(){
		this.states;
		this.files;
		this.currentState;
		this.currentFile;

	};

	var fileData;

	var initialiseModel = function(fileData){

		fileModel.states = fileData;
		window.states = fileData;
		console.dir(fileData);
	};

	var initialiseUi = function(states){
		//commitChooser[0].addEventListener("input",function(value){
		//		updateUItoCommit(value.currentTarget.value);
		//		return true;
		//	});
		startUpLoading.setDone();
		var pages = [
			{name:"Inspect",icon:"code",onClick:function(){

			}},
			{name:"Heartbeat",icon:"heartbeat",onClick:function(){

			}}];
		var mainElement = React.createElement(MainReportPageComponent,{pages:pages,states:states});

		React.render(
			mainElement,
				document.getElementById('body')
		);


	};

	serverBroker.getClientFilesById("").then(function(states){
		initialiseModel(states);
		initialiseUi(states);
	});


	var MainReportPageComponent = React.createClass({
		propTypes: {
			pages: React.PropTypes.array,
			states: React.PropTypes.array

		},
		onChangePage: function (page) {
			
		},
		render: function() {
			
			return (<div>
					<div className="rightNavigation">
					<NavBar pages={this.props.pages} onChangePage={this.onChangePage} />
					</div>
					<div className="pageBody">
					<FileStateTimeLapse states={this.props.states} />
					</div>
				   </div>);
		}
	});


	var FileStateTimeLapse = React.createClass({

		getMarkersFile: function(state){
			return this.getFileByName(state,".markers.json")
		},
		getTestsFile: function(state){
			return	this.getFileByName(state,".tests.json")
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
		onFileChange: function(file){
			this.setState({
				selectedFile:file
			})
			console.log("Changing file to: ",file.name);
		},
		onStateChange: function(state){
			console.log("Changing state to: ",state.time);
			this.updateStateGivenSelectedState(state);
			this.setState({
				currentState:state,

			})
		},
		render: function(){
			return (
				<div>
				<div className="inspectPage">
				<FileList files={this.state.currentState.files} onFileChange={this.onFileChange}/>
				<FileDisplay className="mainFileDisplay" file={this.state.selectedFile} />
				<div>{this.state.selectedFile.markers.join(",")}</div>
				<div>{this.state.selectedFile.tests.join(",")}</div>
				</div>
				<StateSelector states={this.state.states} onStateChange={this.onStateChange}/>
				</div>
			);

		}
	});

	// tutorial1.js
	var FileList = React.createClass({
		handleClick: function(file){
			this.props.onFileChange(file);

		},
		render: function() {
			var rows = [];
			var self = this;
			this.props.files.forEach(function(file){
				rows.push(<li className="fileRow" onClick={function(){self.handleClick(file)}}> {file.name} </li>);
			}.bind(this))

			return (
				<ul className="fileList">
				{rows}
				</ul>
			);
		}
	});

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
				<input ref="slider" type="range" className="rangeSlider" onChange={this.onChange} id="commitChooser" min={0} max={this.props.states.length} />
			);
		}
	});
})
