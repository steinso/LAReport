import React from "react";

var ListButton = React.createClass({
		onClickElement: function(element){
			this.props.onClick(element);
		},

		onClickButton: function(){
			this.setState({open:!this.state.open})
		},

		getInitialState:function(){
			return{open:false}
		},

		renderListBox:function(){
			var elements = [];
			var self = this;
			this.props.elements.forEach(function(element){
				var className = "element ";
				if(element === this.props.currentElement){
					className+="selected";
				}
				elements.push(<span className={className} onClick={function(){self.onClickElement(element)}}> {element.substring(0,10)+"..."} </span>);
			}.bind(this))
			return (
				<div className="overlay" onClick={this.onClickButton}>
				<div className="listButtonBox">
				{elements}
				</div>
				</div>
			)
		},
		
		render: function() {
			var button,box;

			if(this.state.open){
				box = this.renderListBox();
			}

			return (
					<div className="listBoxButton" onClick={this.onClickButton} >
					<span className="heading">{this.props.heading}</span>
					<span className="content">
				{this.props.currentElement || "None"}
				</span>
				<span>
				{box}
				</span>
				</div>
			)
		}

});

export default ListButton;
