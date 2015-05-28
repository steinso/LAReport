//define(["react", "d3", "Store", "jsx!components/MarkerTypesList", "ServerBroker", "models/Workspace", "ClientId", "jsx!components/StatsBar"], function(React, d3, Store, MarkerTypesList, ServerBroker, Workspace, clientId, StatsBar){
//define(["react", "d3", "Store", "ServerBroker", "models/Workspace", "ClientId", "jsx!components/StatsBar"], function(React, d3, Store, ServerBroker, Workspace, clientId, StatsBar){
import React from "react";
import Store from "Store";
import MarkerStore from "stores/MarkerStore";
import StatsBar from "components/StatsBar";

	var OverallStatsPage = function(){

		function getElement() {

			var statsStore = new Store();
			var dispatcher = new Dispatcher(statsStore);

			return React.createElement(OverallStatsPageComponent,{store: statsStore,dispatcher: dispatcher});
		}

		return {
			getElement: getElement
		};
	};

	var Dispatcher = function(statsStore){
		var _markerTypes = [];
		var _markerTypesByCategory = [];
		var _statsSections = [];

		constructor();
		function constructor(){
			statsStore.setState(getCurrentState());
			_updateStates();
		}

		function getCurrentState(){
			_markerTypesByCategory.Overall = _markerTypes;
			return {
				statsSections: _statsSections,
				markerTypesByCategory: _markerTypesByCategory
			};
		}

		function _updateStates(){
			MarkerStore.getMarkerTypes().then(function(markerTypes){
				_markerTypes = markerTypes;
				statsStore.setState(getCurrentState());
			});

			MarkerStore.getMarkerTypesByCategory().then(function(markerTypes){
				_markerTypesByCategory = markerTypes;
				statsStore.setState(getCurrentState());
			});
		}

		return {
			getCurrentState: getCurrentState
		};
	};

	var MarkerListByCategory = React.createClass({
		getInitialState: function(){
			return {
				selected: Object.keys(this.props.markerTypesByCategory)[0]
			};
		},
		onSelectCategory: function(category){
			this.setState({
				selected: category
			});
		},
		render: function() {
			var current = this.props.markerTypesByCategory[this.state.selected];
			var categories = Object.keys(this.props.markerTypesByCategory);
			var _self = this;
			var categoryElements = categories.map(function(category){
				var className = "";
				if(category === _self.state.selected){
					className += "selected";
				}

				return <li onClick={function(){_self.onSelectCategory(category);}} className={className}>{category}</li>;
			});

			var markerList;
			if(current !== undefined){
				markerList = <MarkerTypesList markerTypes={current} />;
			}

			return (
				<div>
				<ul className="horizMenu">{categoryElements}</ul>
				{markerList}
				</div>
			);
		}
	});

	var MarkerTypesList = React.createClass({
			render: function() {

				var rows = this.props.markerTypes.map(function(type){
					var max = 0;
					var mostFrequentMsg = "";
					for(var msg in type.messages){
						if(type.messages[msg] > max){
							max = type.messages[msg];
							mostFrequentMsg = msg;
						}
					}

					return <tr> <td> {type.occurences} </td> <td> {type.categoryName} </td> <td className="left"> {mostFrequentMsg}</td> </tr>;
				});

				return (
					<table>
					<tbody>
					<tr>
						<td>#</td>
						<td>Category #</td>
						<td>Most frequent message</td>
					</tr>
					{rows}
					</tbody>
					</table>
				);
			}
	});

	var OverallStatsPageComponent = React.createClass({
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
		},

		render: function() {
			return (
				<div className="flex">
				<StatsBar sections = {this.state.statsSections} />
				<MarkerListByCategory markerTypesByCategory={this.state.markerTypesByCategory} />
				</div>
			);
		}
	});

	export default OverallStatsPage;

