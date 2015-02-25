define(['react','d3'],function(React,d3){

	var LocOverTimeChart = React.createClass({
		propTypes: {
			data: React.PropTypes.array,
			domain: React.PropTypes.object
		},

		getInitialState: function(){

			return {
				d3Chart: {}
			};
		},

		componentDidMount: function() {
			console.log("Comp did mount");
			var el = this.refs['chartContainer'].getDOMNode();
			var state = this.getChartState();
			var d3Chart = new D3Chart(el,{width: '100%',height:'300px'},state);
			this.setState({
				d3Chart: d3Chart
			});
		},

		componentDidUpdate: function() {
			this.state.d3Chart.update(this.getChartState());
		},

		getChartState: function() {
			return this.props.fileStates;
		},

		componentWillUnmount: function() {
			this.state.d3Chart.destroy();
		},

		render: function() {
			return (
				<div className="Chart" ref="chartContainer"></div>
			);
		}
	});


	var D3Chart = function(el,props,state){

		var _el = el;
		var _state = state;
		var _props = props;
		var svg;

		_constructor();
		function _constructor(){

			/*_state = [
				{time:0,numberOfLines:0,build:true,markers:0,testsFailed:5},
				{time:10,numberOfLines:10,build:false ,markers:10,testsFailed:3},
				{time:100,numberOfLines:130,build:true,markers:2,testsFailed:1},
				{time:120,numberOfLines:90,build:true,markers:0,testsFailed:0},
			]*/
		   console.log("State: ",_state);

			var margin = {top: 20, right: 20, bottom: 30, left: 50},
				width = 500 - margin.left - margin.right,
				height = 500 - margin.top - margin.bottom;


			//Add SVG element
			svg = d3.select(_el).append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.attr("class","chart")
			.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

			update(_state);
		}

		function update(state){
			_state = state;
			var scales = _setScales();
			_drawPoints();
		}

		function _setScales(){

		}

		function _drawPoints(){

			var margin = {top: 20, right: 20, bottom: 30, left: 50},
				width = 500 - margin.left - margin.right,
				height = 500 - margin.top - margin.bottom;

			//var x = d3.time.scale()
			var x = d3.scale.linear()
			.range([0, width]);

			var y = d3.scale.linear()
			.range([height, 0]);

			x.domain(d3.extent(_state, function(d) { return d.workingTime;  }));
			y.domain(d3.extent(_state, function(d) { return d.numberOfLines;  }));

			var xAxis = d3.svg.axis()
			.scale(x)
			.orient("bottom");

			var yAxis = d3.svg.axis()
			.scale(y)
			.orient("left");

			var line = d3.svg.line()
			.x(function(d) { return x(d.workingTime);  })
			.y(function(d) { return y(d.numberOfLines);  });
			// Add X-Axis
			svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + height + ")")
			.call(xAxis);

			// Add Y-Axis
			svg.append("g")
			.attr("class", "y axis")
			.call(yAxis)
			.append("text")
			.attr("transform", "rotate(-90)")
			.attr("y", 6)
			.attr("dy", ".71em")
			.style("text-anchor", "end")
			.text("LOC");

			// Add path
			svg.append("path")
			.datum(_state)
			.attr("class", "line")
			.attr("d", line);
		};

		function destroy(){

		}

		return {
			update:update,
			destroy:destroy
		};

	};

	return LocOverTimeChart;
});
