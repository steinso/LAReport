"use strict";
import Chart from "components/charts/Chart";
import React from "react";
import Modal from "components/Modal";
import EditExpressionForm from "components/EditExpressionForm";
import ExpressionStore from "stores/ExpressionStore";

var ExpressionGraph = React.createClass({
	propTypes: {
		expression: React.PropTypes.object,
		onDelete: React.PropTypes.function,
		onEdit: React.PropTypes.function,
		state: React.PropTypes.array //?
	},

	getInitialState: function(){
		return {
			isEditing: false
		};
	},

	onClickEdit: function(){
		this.setState({
			isEditing: true
		});
		//function(){_this.props.onEdit(_this.props.expression);}
	},

	onFinishEdit: function(){
		this.setState({
			isEditing: false 
		});
	},

	onExpressionEdit: function(expr){
		console.log("Edited expression");
		console.log(expr);
		ExpressionStore.addRawExpression(expr);
		this.onFinishEdit();
	},

	onExpressionDelete: function(){
		this.props.onDelete(this.props.expression)
	},

	render: function() {
		var _this = this;
		var chart = <Chart data={this.props.state} expression={this.props.expression} />;
		var className = "flex expressionGraph ";

		if(this.props.className !== undefined && this.props.className !== null){
			className += this.props.className;
		}

		console.log("EXPR: ",this.props.expression);
		var expressionModal = (<Modal isOpen={_this.state.isEditing} onClickOverlay={_this.onFinishEdit}>
							   <EditExpressionForm expressionVariables={_this.props.expression.expressionVariables} expression={_this.props.expression} onConfirm={_this.onExpressionEdit}/>

							   </Modal>);


		return (
			<div className={className}>

			<div className="title">{this.props.expression.name} <span className="delete" onClick={_this.onClickEdit}> edit  |</span> <span className="delete" onClick={this.onExpressionDelete}>X</span> </div>
			{expressionModal}
			{chart}
			<div className="subtitle">X: {this.props.expression.humanReadablexFunction}</div>
			<div className="subtitle">Y: {this.props.expression.humanReadableyFunction}</div>
			</div>
		);
	}
});

export default ExpressionGraph;
