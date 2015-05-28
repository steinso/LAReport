import ExpressionExploration from "components/ExpressionExploration";
import ExpressionGraph from "components/ExpressionGraph";
import React from "react";

var ExpressionComponent = React.createClass({
	propTypes: {
		expression: React.PropTypes.object,
		states: React.PropTypes.object,
		main: React.PropTypes.array
	},

	render: function() {
		var stateCategories = Object.keys(this.props.states);
		var _this = this;

		var expressionExplorations = stateCategories.map(function(category){
			var states = _this.props.states[category];
			return <ExpressionExploration name={category} states={states} expression={_this.props.expression} className=""/>;
		});

		var main = [];
		if(this.props.main !== null && this.props.main !== undefined){
			main = <ExpressionGraph expression={this.props.expression} state={this.props.main} className="main"/>;
		}

		return (
			<div className="flex">
			{main}
			{expressionExplorations}
			</div>
		);
	}
});


export default ExpressionComponent;
