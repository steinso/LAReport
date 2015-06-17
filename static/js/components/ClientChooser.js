define(['react'],function(React){

var ClientChooser = React.createClass({
		handleClick: function(clientId){
			this.props.onClientChange(clientId);
		},
		render: function() {
			return (
				<div className="clientChooser">
				<ListButton elements={this.props.clientList} currentElement={this.props.currentElement} onClick={this.handleClick} />
				</div>
			);
		}
	});



		return ClientChooser; 

});
