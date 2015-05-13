"use strict";
import React from "react";
import Store from "Store";
import ClientChooser from "components/ClientChooser";
import StatsBar from "components/StatsBar";
import ExamineExpressionPageController from "controllers/ExamineExpressionPageController";
import ExpressionComponent from "components/ExpressionComponent";
import AddExpressionModal from "components/AddExpressionModal";


var ExamineExpressionPage = function(){
	function getElement() {
		var statsStore = new Store();
		var dispatcher = new ExamineExpressionPageController(statsStore);
		return React.createElement(ExamineExpressionPageComponent,{store: statsStore,dispatcher: dispatcher});
	}

	return {
		getElement: getElement
	};
};

var ExamineExpressionPageComponent = React.createClass({
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

	_onAddExpression: function(expression){
		this.props.dispatcher.onAddExpression(expression);
	},

	render: function() {
		var _this = this;
		var category = _this.state.selectedCategory;
		var states = _this.state.users.map(function(user){
			var userCategory = user.getCategory(category.name, category.type);
			if(userCategory === false){return false}

			return {
				title: user.clientId.substr(0,5),
				states: userCategory.states 
			};
		});
		states = states.filter((state)=>{return state !== false;})


		var userStates = {"User": states};

		var _expressionComponents = this.state.expressions.map(function(expression){
			return <ExpressionComponent expression={expression} main={_this.state.mainCategoryStates} states={userStates}/>;

		});

		// Do not render expressions if no data is selected
		if(this.state.selectedCategory.name === undefined){
			_expressionComponents = [];
		}

		var categoryNames = this.state.categoryList.map(function(category){return category.name;});
		var categoryChooser = <ClientChooser clientList={categoryNames} currentElement={this.state.selectedCategory.name} onClientChange={this._onCategoryChange} />;
		var addExpressionButton = <AddExpressionModal onAddExpression ={this._onAddExpression} expressionVariables={this.state.expressionVariables}/>;

		return (
			<div className="flex row">
			<StatsBar sections={this.state.statsSections} />
			<div className="flex horizNav">
			{categoryChooser}
			{addExpressionButton}
			</div>
			{_expressionComponents}
			</div>
		);
	}
});

export default ExamineExpressionPage;

