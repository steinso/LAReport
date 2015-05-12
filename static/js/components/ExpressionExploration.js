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
			return (<div>
					<Chart className="smallChart" data={state} xFunction={_this.props.expression.xFunction} yFunction={_this.props.expression.yFunction}/>
					<span> UserName  </span>
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
