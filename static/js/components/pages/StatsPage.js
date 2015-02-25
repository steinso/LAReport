define(['react','d3','Store','providers/FileStatsProvider','jsx!components/FileList','jsx!components/charts/LocOverTime','ServerBroker'],function(React,d3,Store,FileStatsProvider,FileList,LocOverTimeChart,ServerBroker){

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
				_states = states;
				_files = states[1].files;
				statsStore.setState(getCurrentState());
			});

			statsStore.setState(getCurrentState());
		}

		function getCurrentState(){
			return {states:_fileStates,files:_files};
		}	
		function onChangeFile (file){
			var statsProvider = new FileStatsProvider("");
			statsProvider.getStatsByFileName(file.name).then(function(fileStates){
				_fileStates = fileStates;
				statsStore.setState(getCurrentState());
			},function(error){
				console.error("Error fetching stats for file: ",error);
			});

			console.log("File was changed: ",file);
		}
		return {
			onChangeFile:onChangeFile,
			getCurrentState:getCurrentState
		}
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
				<FileList files={this.state.files} onFileChange={this._onFileChange}/>
				<LocOverTimeChart className="chart" fileStates={this.state.states}/>
				</div>
			);
		}
	});

	return StatsPage; 
});

