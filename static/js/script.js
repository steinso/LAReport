define(['react','jquery','Markers','StartUpLoading','ServerBroker','jsx!components/Navbar','jsx!components/pages/StatsPage','jsx!components/FileList'],function(React,$,Markers,StartUpLoading,ServerBroker,NavBar,StatsPage,FileList){

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
			{name:"Stats",icon:"area-chart",getComponent:function(){
				var Page = new StatsPage();
				return Page.getElement();

			}},
			{name:"Inspect",icon:"code",getComponent:function(){

		var FileStateTimeLapseElement = React.createElement(FileStateTimeLapse,{states:states});
		return FileStateTimeLapseElement;
			}},
			{name:"Heartbeat",icon:"heartbeat",getComponent:function(){

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
			pages: React.PropTypes.array
		},

		getInitialState: function(){

			return{
				currentPage:this.props.pages[0].getComponent()
			};
		},
		onChangePage: function (page) {
			var component =page.getComponent();	
			this.setState({currentPage:component});
		},
		render: function() {
			
			var CurrentComponent = this.state.currentPage;
			//Cant use just JSX here as we need to render the CurrentComponent
			return React.createElement("div",null,
				   (
					<div className="rightNavigation">
					<NavBar pages={this.props.pages} onChangePage={this.onChangePage} />
					</div>
				   ),
				   React.createElement("div",{className:"pageBody"},CurrentComponent)
			);
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
})
