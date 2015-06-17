"use strict";
import React from "react";

var Modal = React.createClass({
	propTypes: {
		isOpen: React.PropTypes.boolean,
		onClickOverlay: React.PropTypes.function
	},

	render: function(){
		var modal = <div></div>;

		if(this.props.isOpen){
		modal = (
			<div className="overlay">
				<div className="overlay" onClick={this.props.onClickOverlay}>
				</div>
				<div className="listButtonBox addExpression">
					{this.props.children}
				</div>
			</div>
		);
		}

		return modal;
	}
});


export default Modal;
