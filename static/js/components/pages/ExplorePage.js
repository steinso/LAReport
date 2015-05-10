"use strict";
import React from "react";
import Store from "Store";
import ClientChooser from "components/ClientChooser";
import StatsBar from "components/StatsBar";
import ExplorePageController from "controllers/ExplorePageController";
import ExpressionComponent from "components/ExpressionComponent";
import AddExpressionModal from "components/AddExpressionModal";


var ExplorePage = function(){
	function getElement() {
		var statsStore = new Store();
		var dispatcher = new ExplorePageController(statsStore);
		return React.createElement(ExplorePageComponent,{store: statsStore,dispatcher: dispatcher});
	}

	return {
		getElement: getElement
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
		var relevant_states = {
			"SomeUsers": this.state.states.userStates,
			"SomeCategories": this.state.states.categoryStates,
			"References": this.state.states.referenceStates
		}
		var _expressionComponents = this.state.expressions.map(function(expression){
			return <ExpressionComponent expression={expression} states={relevant_states} main={_this.state.states.selectedState}/>;

		});

		// Do not render expressions if no data is selected
		if(this.state.selectedCategory.name === undefined){
			_expressionComponents = [];
		}

		var clientChooser = <ClientChooser clientList={this.state.clientList} currentElement={this.state.selectedClient} onClientChange={this._onClientChange} />;
		var categoryNames = this.state.categoryList.map(function(category){return category.name;});
		var categoryChooser = <ClientChooser clientList={categoryNames} currentElement={this.state.selectedCategory.name} onClientChange={this._onCategoryChange} />;
		var addExpressionButton = <AddExpressionModal onAddExpression ={this._onAddExpression} expressionVariables={this.state.expressionVariables}/>;

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

export default ExplorePage;
