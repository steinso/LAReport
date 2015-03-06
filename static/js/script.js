define(['react','jquery','Markers','StartUpLoading','ServerBroker','jsx!components/Navbar','jsx!components/pages/StatsPage','jsx!components/pages/InspectPage','jsx!components/FileList','ClientId'],function(React,$,Markers,StartUpLoading,ServerBroker,NavBar,StatsPage,InspectPage,FileList,clientId){

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

			}}/*,
			{name:"Inspect",icon:"code",getComponent:function(){

				var Page = new InspectPage();
				return Page.getElement();

				return FileStateTimeLapseElement;
			}},
			{name:"Heartbeat",icon:"heartbeat",getComponent:function(){

			}}*/];

			var mainElement = React.createElement(MainReportPageComponent,{pages:pages});

			React.render(
				mainElement,
				document.getElementById('body')
			);


	};

	//serverBroker.getClientFilesById("").then(function(states){
	//serverBroker.getClientList().then(function(clients){
		//initialiseModel(states);
	//});
	
	function startup(){
		var serverBroker = new ServerBroker();
		if(clientId.id == null){
			var nickname= prompt("Enter your nickname:");
			clientId.id = nickname;
			serverBroker.getClientId(nickname).then(function(id){
				clientId.id = id;
				initialiseUi();
			});
		}else{
				initialiseUi();
		}
		
	}

	startup();
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
});
