"use strict";
import React from "react";

var EditExpressionForm = React.createClass({
	propTypes: {
		expressionVariables: React.PropTypes.object,
		expression: React.PropTypes.object,
		onConfirm: React.PropTypes.function
	},

	onClickElement: function(element){
		if(this.props.expression === undefined){
			this.onAddExpression(element);
		}else{
			this.onEditExpression(element);
		}
	},

	onAddExpression: function(){
		var expr = {
			name: this.refs.name.getDOMNode().value,
			xName: this.refs.xName.getDOMNode().value,
			yName: this.refs.yName.getDOMNode().value,
			expressionVariables: this.props.expressionVariables,
			rawxFunction: this.refs.xFunction.getDOMNode().value,
			rawyFunction: this.refs.yFunction.getDOMNode().value
		};

		this.props.onConfirm(expr);
	},

	onEditExpression: function(expr){
		var expr = {
			id: this.props.expression.id,
			name: this.refs.name.getDOMNode().value,
			xName: this.refs.xName.getDOMNode().value,
			yName: this.refs.yName.getDOMNode().value,
			expressionVariables: this.props.expressionVariables,
			humanReadablexFunction: this.props.expression.exprHumanReadableX,
			humanReadableyFunction: this.props.expression.exprHumanReadableY,
			rawxFunction: this.refs.xFunction.getDOMNode().value,
			rawyFunction: this.refs.yFunction.getDOMNode().value
		};

		this.props.onConfirm(expr);
	},

	render: function(){
		var _this = this;
		console.log(this.props);
		var variables = Object.keys(this.props.expressionVariables);
		var variableElements = variables.map(function(variable){
			return <div> {variable} : {_this.props.expressionVariables[variable]} </div>;
		});

		var placeHolders = {
			name: "",
			X: "",
			XName: "",
			Y: "",
			YName: ""
		};

		if(this.props.expression !== undefined){
			placeHolders.name = this.props.expression.name || "";
			placeHolders.XName = this.props.expression.xName|| "";
			placeHolders.YName = this.props.expression.yName|| "";
			placeHolders.X= this.props.expression.rawxFunction || "";
			placeHolders.Y = this.props.expression.rawyFunction || "";
		}

		return (

			<div>
			<div className="variables">
			{variableElements}
			</div>

			<div className="form">
			<div> X: <input type="text" ref="xFunction" defaultValue ={placeHolders.X} />    </div>
			<div> Y: <input type="text" ref="yFunction" defaultValue ={placeHolders.Y} />    </div>
			<div> Name: <input type="text" ref="name" defaultValue={placeHolders.name} /></div>
			<div> XName: <input type="text" ref="xName" defaultValue ={placeHolders.XName} /></div>
			<div> YName: <input type="text" ref="yName" defaultValue ={placeHolders.YName} /></div>
			</div>

			<div className="listBoxButton" onClick={this.onClickElement} > <span className="content"> Save </span> </div>
			</div>
		);
	}
});

export default EditExpressionForm;
