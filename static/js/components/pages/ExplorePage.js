define(["react", "d3", "lodash", "Store", "providers/FileStatsProvider", "jsx!components/ClientChooser", "jsx!components/FileList", "jsx!components/CategoryList", "jsx!components/charts/Chart", "ServerBroker", "models/Workspace", "ClientId", "jsx!components/StatsBar"], function(React, d3, _, Store, FileStatsProvider, ClientChooser, FileList, CategoryList, Chart, ServerBroker, Workspace, clientId, StatsBar){

	var ExplorePage = function(){

		function getElement() {

			var statsStore = new Store();
			var dispatcher = new Dispatcher(statsStore);

			return React.createElement(ExplorePageComponent,{store: statsStore,dispatcher: dispatcher});
		}

		return {
			getElement: getElement
		};
	};

	var Dispatcher = function(statsStore){
		var _states = { //FileStates
			userStates: [],
			categoryStates: [],
			referenceStates: [],
			selectedStates: []
		};

		var _referenceClients = [];
		var _extraCategories = [];
		var _extraClients = [];
		var _statsSections = [];
		var _clientList = [];
		var _selectedClient = {};
		var _categoryList = [];
		var _selectedCategory = "";
		var serverBroker = new ServerBroker();
		var _stateProperties = [];
		var _expressions = [];
		var _expressionVariables = [];

		constructor();
		function constructor(){

			_loadStoredExpressions();

			_getClientList().then(function(){
				_getSomeClientComparisons();
				_getSomeReferenceComparisons();
				//Not needed as categories as within same user
				//_getSomeCategoryComparisons();

			});
			statsStore.setState(getCurrentState());
		}

		function _getClientList(){
			return new Promise(function(resolve, reject){
				serverBroker.getClientList().then(function(clientList){
					_clientList = clientList;
					statsStore.setState(getCurrentState());
					console.log("Clients:", _clientList);
					resolve(_clientList);
				});
			});
		}

		function _loadStoredExpressions(){
			try{
				if(JSON.parse(localStorage.getItem("expressions")).constructor === Array){
					_expressions = JSON.parse(localStorage.getItem("expressions")).map(_parseRawExpression);
					console.log("Loaded",_expressions);
				}
			}catch(e){
				console.log("No saved expressions found", e);
			}
		}

		function _getSomeClientComparisons(){
			var numberOfClientComparations = 4;
			var clients = _.sample(_clientList, numberOfClientComparations);
			var promises = [];

			// Retrieve categories for all clients choosen
			clients.map(function(client){

				var promise = serverBroker.getClientCategoriesById(client).then(function(categoryList){
					return categoryList;
				});

				promises.push(promise);
			});

			Promise.all(promises).then(function(clientCategoriesList){
				console.log("Comparable clients received: ", clientCategoriesList);
				_extraClients = clientCategoriesList;
				statsStore.setState(getCurrentState());

			},function(error){
				console.error("Error retrieving comparable clients: ",error);
			});
		}

		function _getSomeCategoryComparisons(){

			var promises = [];
			var categorySample = []; //Get sample of categories

			categorySample.map(function(category){

				var promise = serverBroker.getClientsInCategory(category).then(function(clientList){
					return clientList;
				});
				promises.push(promise);
			});

			Promise.all(promises).then(function(categoryClientList){
				console.log("Extra category received: ", categoryClientList);
				_extraCategories = categoryClientList;
				statsStore.setState(getCurrentState());

			},function(error){
				console.error("Error retrieving extra categories: ", error);
			});
		}

		function _getSomeReferenceComparisons(){

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

			_states.selectedState = _selectedCategory.states;

			_states.categoryStates = [_selectedCategory.states ,_selectedCategory.states];
			_states.userStates = _extraClients.map(function(clientCategories){
					return clientCategories.reduce(function(prev,current){
						if(current.name === _selectedCategory.name){
							prev = current.states;
						}
						return prev;
					},{});
				});
			_states.referenceStates = [_selectedCategory.states, _selectedCategory.states];

			return {
				states: _states,
				clientList: _clientList,
				selectedClient: _selectedClient,
				categoryList: _categoryList,
				selectedCategory: _selectedCategory,
				statsSections: _statsSections,
				expressions: _expressions,
				expressionVariables: _expressionVariables
			};
		}

		function onChangeCategory (categoryName){
			_selectedCategory = categoryName;
			_expressionVariables = createExpressionVariables();

			statsStore.setState(getCurrentState());
			console.log("Category was changed: ", categoryName);
		}

		function createExpressionVariables(){
			var expressionVariables = {};
			var cat = _categoryList[0];
			var variables = ["$A", "$B", "$C", "$D", "$E", "$F", "$G", "$H", "$I", "$J", "$K", "$L", "$M", "$N", "$O", "$P", "$Q", "$R", "$S", "$T", "$U"];

			if(cat === null || cat === undefined || cat.states === undefined || cat.states[0] === undefined){
				return expressionVariables;
			}

			var fields = Object.keys(cat.states[0]);
			fields.map(function(field, index){
				var variable = variables[index];
				expressionVariables[variable] = field;
			});

			return expressionVariables;
		}

		function onAddExpression(expression){
			var expr = _parseRawExpression(expression);
			_expressions.push(expr);
			console.log("expression added: ", expr);
			statsStore.setState(getCurrentState());

			//Store in client storage
			localStorage.setItem("expressions", JSON.stringify(_expressions));
		}

		function _parseRawExpression(expression){
			// We take in a string with user defined vatiables
			// then we replace them with a reference to a field in a state
			// we do this by replacing ex. $A with state['time']
			// we then eval this string in a function that takes
			// state as a parameter

			var exprX = expression.computerReadablexFunction;
			var exprY = expression.computerReadableyFunction;
			var exprHumanReadableX = exprX;
			var exprHumanReadableY = exprY;

			var variables = Object.keys(_expressionVariables);

			variables.forEach(function(variable){
				exprX = exprX.replace(variable,"state['"+_expressionVariables[variable]+"']");
				exprY = exprY.replace(variable,"state['"+_expressionVariables[variable]+"']");
				exprHumanReadableX = exprHumanReadableX.replace(variable,_expressionVariables[variable]);
				exprHumanReadableY = exprHumanReadableY.replace(variable,_expressionVariables[variable]);
			});

			// Yes, eval is no good, however this is client side, and is a prototype
			// functionality vs time, this wins
			return {
				name: expression.name,
				computerReadablexFunction: exprX,
				computerReadableyFunction: exprY,
				humanReadablexFunction: exprHumanReadableX,
				humanReadableyFunction: exprHumanReadableY,
				xFunction: function(state){return eval(exprX);},
				yFunction: function(state){return eval(exprY);}
			};
		}

		function onChangeClient(clientId){

			_selectedClient = clientId;
			_updateStates();
			statsStore.setState(getCurrentState());
			console.log("Client changed to: "+clientId);
		}

		function _updateStates(){
			serverBroker.getClientCategoriesById(_selectedClient).then(function(categoryList){
				_categoryList = categoryList;
				console.log("Got new client files:",_categoryList);
				statsStore.setState(getCurrentState());
			},function(error){
				alert("Client not found..");
			});
		}

		return {
			onChangeCategory: onChangeCategory,
			onChangeClient: onChangeClient,
			onAddExpression: onAddExpression,
			getCurrentState: getCurrentState
		};
	};

	var ExplorePageComponent = React.createClass({
		propTypes: {
			store: React.PropTypes.object,
			dispatcher: React.PropTypes.object
		},

		getInitialState: function(){
			this.props.store.addListener(this._onStateChange);
			return this.props.store.getState();
		},

		_onStateChange: function(state){
			this.setState(state);
			console.log("stateChange",this,state);
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

		_onClientChange: function(client){
			this.props.dispatcher.onChangeClient(client);
		},

		_onAddExpression: function(expression){
			this.props.dispatcher.onAddExpression(expression);
		},

		render: function() {
			var _this = this;
			var _expressionComponents = this.state.expressions.map(function(expression){
				return <ExpressionComponent expression={expression} states={_this.state.states}/>;

			});

			// Do not render expressions if no data is selected
			if(this.state.selectedCategory.name === undefined){
				_expressionComponents = [];
			}

			var clientChooser = <ClientChooser clientList={this.state.clientList} currentElement={this.state.selectedClient} onClientChange={this._onClientChange} />;
			var categoryNames = this.state.categoryList.map(function(category){return category.name;});
			var categoryChooser = <ClientChooser clientList={categoryNames} currentElement={this.state.selectedCategory.name} onClientChange={this._onCategoryChange} />;
			var addExpressionButton = <AddExpressionComponent onAddExpression ={this._onAddExpression} expressionVariables={this.state.expressionVariables}/>;

			return (
				<div className="flex row">
				<StatsBar sections={this.state.statsSections} />
				<div className="flex horizNav">
				{clientChooser}
				{categoryChooser}
				{addExpressionButton}
				</div>
				{_expressionComponents}
				</div>
			);
		}
	});

	var ExpressionComponent = React.createClass({
		propTypes: {
			expression: React.PropTypes.object
		},

		_onStateChange: function(state){
			this.setState(state);
			console.log("stateChange",this,state);
		},

		_onFileChange: function(file){

			this.props.dispatcher.onChangeFile(file);
		},

		render: function() {
			var expressionExplorations = [
				
				   <ExpressionExplorations name="Some users" states={this.props.states.userStates} expression={this.props.expression}/>,
				   <ExpressionExplorations name="Some categories" states={this.props.states.categoryStates} expression={this.props.expression}/>,
				   <ExpressionExplorations name="Some references" states={this.props.states.referenceStates} expression={this.props.expression} />
				   
			];

			return (
				<div className="flex">
				<ExpressionGraph expression={this.props.expression} state={this.props.states.selectedState}/>
				{expressionExplorations}
				</div>
			);
		}
	});

	var ExpressionGraph = React.createClass({
		propTypes: {
			expression: React.PropTypes.object,
			state: React.PropTypes.array //?
		},

		render: function() {
			var chart = <Chart data={this.props.state} xFunction={this.props.expression.xFunction} yFunction={this.props.expression.yFunction}/>;

			return (
				<div className="flex expressionGraph">

				<div className="title">{this.props.expression.name} <span className="delete" onClick={this.props.onDelete}>X</span> </div>
				{chart}
				<div className="subtitle">X: {this.props.expression.humanReadablexFunction}</div>
				<div className="subtitle">Y: {this.props.expression.humanReadableyFunction}</div>
				</div>
			);
		}
	});

	var ExpressionExplorations = React.createClass({
		propTypes: {
			name: React.PropTypes.string,
			expression: React.PropTypes.object,
			states: React.PropTypes.array //?
		},

		_onStateChange: function(state){
			this.setState(state);
		},

		_onFileChange: function(file){

			this.props.dispatcher.onChangeFile(file);
		},

		render: function() {
			var _this = this;
			var _graphs = this.props.states.map(function(state){
				return <Chart className="smallChart" data={state} xFunction={_this.props.expression.xFunction} yFunction={_this.props.expression.yFunction}/>;
			});

			return (
				<div className="flex row expressionExploration">
				<div className="title">{this.props.name}</div>
				{_graphs}
				</div>
			);
		}
	});

	var AddExpressionComponent = React.createClass({
		propTypes: {
			expressionVariables: React.PropTypes.object
		},

		onClickElement: function(element){
			this.props.onClick(element);
		},

		openBox: function(){
			this.setState({open: true});
		},

		closeBox: function(){
			this.setState({open: false});
		},

		onAddExpression: function(){
			var expr = {
				name: this.refs.name.getDOMNode().value,
				computerReadablexFunction: this.refs.xFunction.getDOMNode().value,
				computerReadableyFunction: this.refs.yFunction.getDOMNode().value
			};

			this.props.onAddExpression(expr);
			this.closeBox();
		},

		getInitialState: function(){
			return{open: false};
		},

		renderBox: function(){
			var _this = this;
			var variables = Object.keys(this.props.expressionVariables);
			var variableElements = variables.map(function(variable){
				return <div> {variable} : {_this.props.expressionVariables[variable]} </div>;
			});


			return (
				<div className="overlay">
				<div className="overlay" onClick={this.closeBox}>
				test
				</div>
				<div className="listButtonBox addExpression">

				{variableElements}

				Name: <input type="text" ref="name"/>
				X: <input type="text" ref="xFunction"/>
				Y: <input type="text" ref="yFunction"/>

				<div className="listBoxButton" onClick={this.onAddExpression} > Add expression </div>
				</div>
				</div>
			);
		},

		render: function() {
			var box = [];

			if(this.state.open){
				box = this.renderBox();
			}

			return (
				<div>
				<div className="listBoxButton" onClick={this.openBox} >
				<span>
				{this.props.currentElement || "None"}
				</span>
				<span>
				</span>
				</div>
				{box}
				</div>
			);
		}
	});




	return ExplorePage;
});



