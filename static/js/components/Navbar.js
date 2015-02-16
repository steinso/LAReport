define(['react'],function(React){

var NavBar= React.createClass({
	propTypes:{

		pages: React.PropTypes.array,
		onChangePage: React.PropTypes.func
	},
	onClickPage: function(page){
		this.props.onChangePage(page);

	},
		render: function() {
			var navElements = [];
			var self = this;
			this.props.pages.forEach(function(page){
				var iconClass = "navIcon fa fa-"+page.icon;
				navElements.push(
					<li onClick={function(){self.onClickPage(page)}}>
					<i className={iconClass}></i>
								 {page.name}
				    </li>
				);
			})
			return (
				<ul>
				{navElements}				
				</ul>
			);
		}
	});

	return NavBar;
});
