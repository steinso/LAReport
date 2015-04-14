define(["react","jsx!components/Navbar"], function(React, NavBar){

var MainReportPageComponent = React.createClass({

		propTypes: {
			pages: React.PropTypes.array
		},

		getInitialState: function(){
			return{
				currentPage: this.props.pages[0].getComponent()
			};
		},

		onChangePage: function (page) {
			var component = page.getComponent();
			this.setState({currentPage: component});
		},

		render: function() {
			var CurrentComponent = this.state.currentPage;

			//Cant use just JSX here as we need to render the CurrentComponent
			return React.createElement("div",null,
									(
										<div className="rightNavigation">
										<NavBar pages={this.props.pages} onChangePage={this.onChangePage} />
										</div>
									),
									React.createElement("div",{className: "pageBody"}, CurrentComponent)
					);
		}
	});

	return MainReportPageComponent;
});
