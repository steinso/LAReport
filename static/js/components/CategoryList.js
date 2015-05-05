
import React from 'react';
import FileList from 'components/FileList';

var CategoryList = React.createClass({
	propTypes: {
		categories: React.PropTypes.array,
		onFileChange: React.PropTypes.func,
		selectedElement: React.PropTypes.string

	},
	handleClick: function(file){
		this.props.onFileChange(file);

	},
	render: function() {
		var rows = [];
		var self = this;
		var className = "categoryRow";

		this.props.categories.forEach(function(file){
			if(file.name === this.props.selectedElement){
				className += " selected";
			}
			rows.push(<li className={className} onClick={function(){self.handleClick(file)}}> {file.name} </li>);

			if(file.name === this.props.selectedElement){
				rows.push(<li className="files"><FileList files={file.files} onFileChange={this.handleClick} /> </li>);
			}
		}.bind(this))

		return (
			<ul className="fileList">
			{rows}
			</ul>
		);
	}
});
export default CategoryList; 
