define(['react','d3','Store','providers/FileStatsProvider','jsx!components/ClientChooser','jsx!components/FileList','jsx!components/charts/LocOverTime','ServerBroker','models/Workspace','ClientId','jsx!components/StatsBar'],function(React,d3,Store,FileStatsProvider,ClientChooser,FileList,LocOverTimeChart,ServerBroker,Workspace,clientId,StatsBar){

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
		var _statsSections = [];
		var _files = [];
		var _fileStates = [];
		var _clientList = [];
		var _selectedClient = "";
		var serverBroker = new ServerBroker();

		constructor();
		function constructor(){
			_statsSections = [
				{type:"title",title:"Øving X"},
				{type:"stats",value:"? hrs",avg:"? hrs", title:"Time spent"},
				{type:"stats",value:"?",avg:"?", title:"Tests failed"},
				{type:"stats",value:"?",avg:"?", title:"Errors corrected"},
				{type:"stats",value:"? min",avg:"? min", title:"Correcting error"}
			];

			statsStore.setState(getCurrentState());

			serverBroker.getClientList().then(function(clientList){
				_clientList = clientList;
				console.log("Clients:",_clientList);
				statsStore.setState(getCurrentState());
			});

			_selectedClient = clientId.id;
			onChangeClient(_selectedClient);
		};

		function getCurrentState(){
			return {
				states: _fileStates,
				files: _files,
				clientList: _clientList,
				statsSections: _statsSections,
				selectedClient: _selectedClient
			};
		}
		function onChangeFile (fileName){
			var statsProvider = new FileStatsProvider("");
			statsProvider.getStatsByFileName(_selectedClient,fileName).then(function(fileStates){
				_fileStates = fileStates;
				statsStore.setState(getCurrentState());
			},function(error){
				console.error("Error fetching stats for file: ",error);
			});

			console.log("File was changed: ",fileName);
		}

		function onChangeClient(clientId){

			_selectedClient = clientId;
			_updateStates();
			statsStore.setState(getCurrentState());
			console.log("Client changed to: "+clientId,"FEATURE NOT IMPLEMENTED");
		}

		function _updateStates(){
			serverBroker.getClientFilesById(_selectedClient).then(function(states){
				var workspace = new Workspace(states);
				_states = workspace.getStates();
				_files = workspace.getFileList();
				console.log("Got new client files:",_files);
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
			console.log("Privilege: ",clientId.privilege)
			if(this.state.states !== null && this.state.states.length>0 ){

				chart = <LocOverTimeChart className="chart" fileStates={this.state.states}/>
			}

			if(this.state.clientList.length>1 /*&& clientId.privilege!=="user"*/){
				chooser = <ClientChooser clientList={this.state.clientList} currentElement={this.state.selectedClient} onClientChange={this._onClientChange}/>
			}
			
			return (
				<div className="flex">
				<StatsBar sections={this.state.statsSections} />
				{chooser}
				<FileList fileNames={this.state.files} onFileChange={this._onFileChange}/>
				{chart}
				</div>
			);
		}
	});

	return StatsPage; 
});

