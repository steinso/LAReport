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
		var line;
		var markersArea;
		var testsArea;
		var tooltip;

		var yAxis;
		var xAxis;
		var x;
		var y;

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

			//var x = d3.time.scale()
			x = d3.scale.linear()
			.range([0, width]);

			var xScale = function(){

				var outLow = 0;
				var outHigh = 0;
				var ranges = {};
				var currentShift = 0;

				// Input
				function range(inputValues){
					var last = 0;
					var threshold = 1;
					for(var i=0;i<inputValues.length;i++){
						if(last - inputValues[i] > threshold){
							var r = {};
							r.x = inputValues[i].x;
							r.shift = (last - inputValues[i]);
							ranges.push(r);
						}
						last = inputValues[i];
					}
				}

				// Output
				function domain(input){
					if(input.length!=2 || input[0]>input[1]){
						throw new Error("Domain not properly defined as array with 2 elements");
					}
					outHigh = input[0];
					outHigh = input[1];
				}


				function scale(value){
					var shift = 0;
					for(var i=0;i<ranges.length;i++){
						if(value>ranges[i].x){
							shift+= ranges[i].shift;
						}
					}
					return value - shift;

				}

				return function(value){
					scale(value);
					this.range=range;
					this.domain=domain;
					}
			}

			y = d3.scale.linear()
			.range([height, 0]);

			x.domain(d3.extent(_state, function(d) { return d.workingTime;  }));
			y.domain(d3.extent(_state, function(d) { return d.numberOfLines;  }));

			xAxis = d3.svg.axis()
			.scale(x)
			.orient("bottom");

			yAxis = d3.svg.axis()
			.scale(y)
			.orient("left");

			// Loc line
			line = d3.svg.line()
			.x(function(d) { return x(d.workingTime);  })
			.y(function(d) { return y(d.numberOfLines);  })
			.interpolate('step-after');

			// Markers area
			markersArea = d3.svg.area()
			.x(function(d) { return x(d.workingTime);  })
			.y1(function(d) { return y(d.numberOfMarkers*5);  })
			.y0(height)
			.interpolate('step-after');

			testsArea = d3.svg.area()
			.x(function(d) { return x(d.workingTime);  })
			.y1(function(d) { return y(d.numberOfFailedTests*10);  })
			.y0(height)
			.interpolate('step-after');



			// Add X-Axis
			svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + height + ")")
			.call(xAxis)
			.append("text")
			.attr("y", -15)
			.attr("x", width)
			.attr("dy", ".71em")
			.style("text-anchor", "end")
			.text("Time Spent (min)");


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
			console.log("CREATE: Setting path state: ",_state,svg.selectAll("path.loc").data());
			var lines = svg.append("g")
			.attr("class","lines")
			
			lines.selectAll("path.loc").data([_state]).enter()
			.append("path")
			.attr("class", "line loc")
			.attr("d", line);


			lines.selectAll("path.markers").data([_state]).enter()
			.append("path")
			.attr("class", "area markers")
			.attr("d", markersArea);

			lines.selectAll("path.tests").data([]).enter()
			.append("path")
			.attr("class", "area tests")
			.attr("d", testsArea);

			var breaksGroup = svg.append("g")
			.attr("class","breaks")


			// Add tooltip element
			tooltip = d3.select("body").append("div")   
			    .attr("class", "chartTooltip")               
				.style("opacity", 0);



			update(_state);
		}

		function update(state){
			console.log("Updating chart: ",state)
			_state = state;
			var scales = _setScales();
			_drawPoints(state);
		}

		function showToolTip(d){
			tooltip.html("Idle for: "+(d.idle/60000).toFixed(1)+" min")
			tooltip.transition().duration(150)
			.style("opacity",1)
			.style("left", (d3.event.pageX - tooltip[0][0].offsetWidth/2) + "px")     
			.style("top", (d3.event.pageY - 45) + "px")
			.style("visibility","visible")

							            
		}                  

		function hideToolTip(d){
			tooltip.transition().duration(150)
			.style("opacity",0)
			.style("visibility","hidden")
		}

		function _setScales(){

		}

		function _drawPoints(state){
		   window.line = line;
		   window.svg = svg;
		   window.state = _state;
			console.log("UPDATE: Setting path state: ",state,svg.selectAll(".lines path").data());
			console.log("Name: ",state[0].name)
			
			x.domain([0,d3.max(_state, function(d) { return d.workingTime;  })]);
			y.domain([0,d3.max(state, function(d) { return d.numberOfLines; })]);
			console.log("Range: ",d3.extent(state, function(d) { return d.numberOfLines; }).reverse())

			xAxis = d3.svg.axis()
			.scale(x)
			.orient("bottom");

			yAxis = d3.svg.axis()
			.scale(y)
			.orient("left");
		//	svg.selectAll(".x.axis").call(xAxis);
			svg.transition().duration(500).selectAll(".y.axis").call(yAxis)
			svg.transition().duration(500).selectAll(".x.axis").call(xAxis)
			
			
			svg.selectAll(".lines path.loc").data([state])
			.transition().duration(500)
			.attr("class", "line loc")
			.attr("d", line);

			var markerPath = svg.selectAll(".lines path.markers").data([state])
			markerPath.enter().append("path")
			markerPath.transition().duration(500)
			.attr("class", "area markers")
			.attr("d", markersArea);

			markerPath.exit().remove()


			var tests = _state.filter(function(state){if(state.numberOfFailedTests > 0){return state;}})
			console.log("tests",tests);

			var testPath = svg.selectAll(".lines").selectAll("path.tests").data([tests])
			testPath.enter().append("path")
			testPath.transition().duration(500)
			.attr("class", "area tests")
			.attr("d", testsArea);

			testPath.exit().remove();

			var breaks = _state.filter(function(state){if(state.idle !== undefined){return state;}})

			var breakElements = svg.selectAll(".breaks");
			var bel = breakElements.selectAll(".dot").data(breaks)
			
			bel.enter().append("circle")
			bel
			.attr("class","dot")
			.attr("r",4.5)
			.attr("cx",function(d){return x(d.workingTime)})
			.attr("cy",function(d){return y(d.numberOfLines)})
			.on("mouseover",showToolTip)
			.on("mouseout",hideToolTip)

			bel.exit().remove();




		}

		function destroy(){

		}

		return {
			update:update,
			destroy:destroy
		};

	};

	return LocOverTimeChart;
});
