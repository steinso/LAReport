define(['react','d3','Store','providers/FileStatsProvider','jsx!components/FileList','jsx!components/charts/LocOverTime','ServerBroker','models/Workspace'],function(React,d3,Store,FileStatsProvider,FileList,LocOverTimeChart,ServerBroker,Workspace){

	var StatsPage = function(){
		var _states = [];
		var _files = [];
		var _fileStates = [];


		function getElement() {

			var statsStore = new Store();
			dispatcher = new Dispatcher(statsStore);

			return React.createElement(StatsPageComponent,{store:statsStore,dispatcher:dispatcher});
		}

		return {
			getElement:getElement
		};
	};

	var Dispatcher = function(statsStore){
		var _states = [];
		var _files = [];
		var _fileStates = [];
		var serverBroker = new ServerBroker();
	
		initialise();
		function initialise(){
			serverBroker.getClientFilesById("").then(function(states){
				var workspace = new Workspace(states);
				_states = workspace.getStates();
				_files = workspace.getFileList();
				console.log(_files);
				statsStore.setState(getCurrentState());
			});

			statsStore.setState(getCurrentState());
		}

		function getCurrentState(){
			return {states:_fileStates,files:_files};
		}	
		function onChangeFile (fileName){
			var statsProvider = new FileStatsProvider("");
			statsProvider.getStatsByFileName(fileName).then(function(fileStates){
				_fileStates = fileStates;
				statsStore.setState(getCurrentState());
			},function(error){
				console.error("Error fetching stats for file: ",error);
			});

			console.log("File was changed: ",fileName);
		}
		return {
			onChangeFile:onChangeFile,
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

		render: function() {
			return (
				<div className="flex">
				<FileList fileNames={this.state.files} onFileChange={this._onFileChange}/>
				<LocOverTimeChart className="chart" fileStates={this.state.states}/>
				</div>
			);
		}
	});

	return StatsPage; 
});

