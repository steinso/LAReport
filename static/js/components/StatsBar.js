define(['react','d3'],function(React,d3){

	var StatsBar = React.createClass({
		propTypes: {
			sections: React.PropTypes.array
		},

		generateSection: function(section){
			switch(section.type){
				case "title":
					return <StatsBarTitle title={section.title} />
				break;

				case "stats":
					return <StatsBarStats title={section.title} value={section.value} avg={section.avg}/>
				break;
				throw new Error("StastBar: Type not recognised: "+section.type);
				return {}; 
			}


		},

		render: function() {
			var sections = [];
			var self = this;
			console.log("SECTIONS ",sections,this.props.sections);
			this.props.sections.forEach(function(section){
				sections.push(self.generateSection(section));
			});

			return (
				<div className="statsBar"> 
				{sections}
				</ div>
			);
		}
	});


var StatsBarTitle= React.createClass({
		render: function() {
			return (
				<div className="section title">{this.props.title}</div>
			);
		}
	});


var StatsBarStats= React.createClass({
		render: function() {
			return (
				<div className="section"><span className=""><span className="value">{this.props.value}</span> <span className="avg"> {this.props.avg}</span> </span> <span className="title"> {this.props.title} </span> </div>
			);
		}
	});

	return StatsBar;

});



