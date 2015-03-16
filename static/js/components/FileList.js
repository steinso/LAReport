
define(['react'],function(React){

var FileList = React.createClass({
		handleClick: function(fileName){
			this.props.onFileChange(fileName);

		},
		render: function() {
			var rows = [];
			var self = this;
			this.props.files.forEach(function(file){
				rows.push(<li className="fileRow" onClick={function(){self.handleClick(file.name)}}> {file.name} </li>);
			}.bind(this))

			return (
				<ul className="fileList">
				{rows}
				</ul>
			);
		}
	});
		return FileList; 
});
