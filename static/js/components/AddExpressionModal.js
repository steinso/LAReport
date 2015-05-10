"use strict";
import React from "react";


var AddExpressionModal = React.createClass({
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

export default AddExpressionModal;
