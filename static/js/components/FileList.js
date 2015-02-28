
define(['react'],function(React){

var FileList = React.createClass({
		handleClick: function(fileName){
			this.props.onFileChange(fileName);

		},
		render: function() {
			var rows = [];
			var self = this;
			this.props.fileNames.forEach(function(fileName){
				rows.push(<li className="fileRow" onClick={function(){self.handleClick(fileName)}}> {fileName} </li>);
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
