define(['react','d3'],function(React,d3){

	/**
	 * Chart component, renders a chart with lines of code over time. Also includes
	 * views of markers and tests.
	 **/
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

		// D3 does not natively play nice with react, so we have to integrate
		// it with react and update the D3 class on comoponent update
		componentDidMount: function() {
			var el = this.refs["chartContainer"].getDOMNode();
			var state = this.getChartState();

			var d3Chart = new D3Chart(el,{width: "100%", height: "300px"}, state);

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

			console.log("Loc chart State: ",_state);

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

			// Specify the range (possible pixel output values)
			x = d3.scale.linear()
			.range([0, width]);

			y = d3.scale.linear()
			.range([height, 0]);

			// Specidy the domain of the input values
			x.domain(d3.extent(_state, function(d) { return d.workingTime; }));
			y.domain(d3.extent(_state, function(d) { return d.numberOfLines; }));

			// Create the axis
			xAxis = d3.svg.axis()
			.scale(x)
			.orient("bottom");

			yAxis = d3.svg.axis()
			.scale(y)
			.orient("left");

			// Create the line function
			line = d3.svg.line()
			.x(function(d) { return x(d.workingTime); })
			.y(function(d) { return y(d.numberOfLines); })
			.interpolate("step-after");

			// Create markers area function
			markersArea = d3.svg.area()
			.x(function(d) { return x(d.workingTime); })
			.y1(function(d) { return y(d.numberOfMarkers*5); })
			.y0(height) // Lower value of area for each point
			.interpolate("step-after");

			// Create tests area function
			testsArea = d3.svg.area()
			.x(function(d) { return x(d.workingTime); })
			.y1(function(d) { return y(d.numberOfFailedTests*10); })
			.y0(height) // Lower value of area for each point
			.interpolate("step-after");

			// Add X-Axis
			svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + height + ")")
			.call(xAxis) // Uses function on each created element
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

			// Add path elements
			var lines = svg.append("g")
			.attr("class","lines");

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

			// Create break group
			svg.append("g")
			.attr("class","breaks");


			// Add tooltip element
			tooltip = d3.select("body").append("div")
			.attr("class", "chartTooltip")
			.style("opacity", 0);

			update(_state);
		}

		function update(state){
			_state = state;
			_drawPoints(state);
		}

		function showToolTip(d){
			tooltip.html("Idle for: "+(d.idle/60000).toFixed(1)+" min");
			tooltip.transition().duration(150)
			.style("opacity",1)
			.style("left", (d3.event.pageX - tooltip[0][0].offsetWidth/2) + "px")
			.style("top", (d3.event.pageY - 45) + "px")
			.style("visibility","visible");
		}

		function hideToolTip(d){
			tooltip.transition().duration(150)
			.style("opacity",0)
			.style("visibility","hidden");
		}

		function _drawPoints(state){
			window.line = line;
			window.svg = svg;
			window.state = _state;

			// Set new domain
			x.domain([0,d3.max(_state, function(d) { return d.workingTime; })]);
			y.domain([0,d3.max(state, function(d) { return d.numberOfLines; })]);

			// Set new axis
			xAxis = d3.svg.axis()
			.scale(x)
			.orient("bottom");

			yAxis = d3.svg.axis()
			.scale(y)
			.orient("left");

			// Transition axis
			svg.transition().duration(500).selectAll(".y.axis").call(yAxis);
			svg.transition().duration(500).selectAll(".x.axis").call(xAxis);

			// Set new data and transition path
			svg.selectAll(".lines path.loc").data([state])
			.transition().duration(500)
			.attr("class", "line loc")
			.attr("d", line);

			// Set new data and create new elements (append is the subtraction of previous data)
			var markerPath = svg.selectAll(".lines path.markers").data([state]);
			markerPath.enter().append("path");
			markerPath.transition().duration(500)
			.attr("class", "area markers")
			.attr("d", markersArea);

			// Remove elements that are not part of data anymore
			markerPath.exit().remove();

			// Get test data
			var tests = _state.filter(function(state){if(state.numberOfFailedTests > 0){return state;}});

			// Create tests path element
			var testPath = svg.selectAll(".lines").selectAll("path.tests").data([tests]);
			testPath.enter().append("path");
			testPath.transition().duration(500)
			.attr("class", "area tests")
			.attr("d", testsArea);

			testPath.exit().remove();

			// Get breaks data
			var breaks = _state.filter(function(state){if(state.idle !== undefined){return state;}})

			var breakElements = svg.selectAll(".breaks");
			var bel = breakElements.selectAll(".dot").data(breaks)

			bel.enter().append("circle");

			bel.attr("class","dot")
			.attr("r",4.5)
			.attr("cx",function(d){return x(d.workingTime)})
			.attr("cy",function(d){return y(d.numberOfLines)})
			.on("mouseover",showToolTip)
			.on("mouseout",hideToolTip);

			bel.exit().remove();
		}

		function destroy(){

		}

		return {
			update: update,
			destroy: destroy
		};
	};

	return LocOverTimeChart;
});
