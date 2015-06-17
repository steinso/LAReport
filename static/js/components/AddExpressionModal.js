"use strict";
import React from "react";
import Modal from "components/Modal";
import EditExpressionForm from "components/EditExpressionForm";


var AddExpressionModal = React.createClass({
	propTypes: {
		expressionVariables: React.PropTypes.object
	},

	onClickElement: function(element){
		this.props.onAddExpression(element);
		this.closeBox();
	},

	openBox: function(){
		this.setState({open: true});
	},

	closeBox: function(){
		this.setState({open: false});
	},

	getInitialState: function(){
		return{open: false};
	},

	renderBox: function(){
			return (
			<Modal isOpen={this.state.open} onClickOverlay={this.closeBox}>
			<EditExpressionForm onConfirm={this.onClickElement} expressionVariables={this.props.expressionVariables}/>
			</Modal>
		);
	},

	render: function() {
		var box = this.renderBox();

		return (
			<div>
			<div className="listBoxButton" onClick={this.openBox} >
			<span className="heading"></span>
			<span className="content">
			{this.props.currentElement || "Add expr"}
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
