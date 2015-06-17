import React from "react";
import Chart from "components/charts/Chart";

var ExpressionExploration = React.createClass({
	propTypes: {
		name: React.PropTypes.string,
		expression: React.PropTypes.object,
		states: React.PropTypes.array //?
	},

	render: function() {
		var _this = this;
		var _graphs = this.props.states.map(function(state){
			if(state.states.length === undefined){
				console.warn("[ExpressionExploration]: Got state with no states array",state);
				return;
			}
			return (<div>
					<Chart className="smallChart" data={state.states} expression={_this.props.expression} />
					<span> {state.title}</span>
					</div>
				   );
		});

		return (
			<div className="flex row expressionExploration">
			<div className="title">{this.props.name}</div>
			{_graphs}
			</div>
		);
	}
});

export default ExpressionExploration;
