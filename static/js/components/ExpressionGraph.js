"use strict";
import Chart from "components/charts/Chart";
import React from "react";

var ExpressionGraph = React.createClass({
	propTypes: {
		expression: React.PropTypes.object,
		state: React.PropTypes.array //?
	},

	render: function() {
		var chart = <Chart data={this.props.state} xFunction={this.props.expression.xFunction} yFunction={this.props.expression.yFunction}/>;
		var className = "flex expressionGraph ";

		if(this.props.className !== undefined && this.props.className !== null){
			className += this.props.className;
		}

		return (
			<div className={className}>

			<div className="title">{this.props.expression.name} <span className="delete" onClick={this.props.onDelete}>X</span> </div>
			{chart}
			<div className="subtitle">X: {this.props.expression.humanReadablexFunction}</div>
			<div className="subtitle">Y: {this.props.expression.humanReadableyFunction}</div>
			</div>
		);
	}
});

export default ExpressionGraph;
