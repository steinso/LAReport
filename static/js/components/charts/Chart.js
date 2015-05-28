define(['react','d3'],function(React,d3){

	/**
	 * Chart component, renders a chart depending on inputs. 
	 **/

	var Chart = React.createClass({
		propTypes: {
			data: React.PropTypes.array,
			//xFunction: React.PropTypes.function,
			//yFunction: React.PropTypes.function,
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

			var d3Chart = new D3Chart(el,{xFunction: this.props.xFunction, yFunction: this.props.yFunction}, state);

			this.setState({
				d3Chart: d3Chart
			});
		},

		componentDidUpdate: function() {
			this.state.d3Chart.update(this.getChartState());
		},

		getChartState: function() {
			return {
				selected: this.props.selected,
				states: this.props.data
			};
		},

		componentWillUnmount: function() {
			this.state.d3Chart.destroy();
		},

		render: function() {
			var className = "Chart " + (this.props.className || "");
			return (
				<div className={className} ref="chartContainer"></div>
			);
		}
	});


	var D3Chart = function(el,props,data){

		var _el = el;
		var _states = data.states;
		var svg;
		var line;

		var yAxis;
		var xAxis;
		var x;
		var y;
		var margin;
		var width;
		var height;

		// Properties 
		var xFunction = props.xFunction;
		var yFunction = props.yFunction;

		_constructor(data);
		function _constructor(data){

			console.log("Loc chart State: ",_states);

			margin = {top: 20, right: 20, bottom: 30, left: 50},
			width = el.clientWidth;
			width = width - margin.left - margin.right,
			height = el.clientHeight;
			height = height - margin.top - margin.bottom;

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
			x.domain(d3.extent(_states, xFunction));
			y.domain(d3.extent(_states, yFunction));

			// Create the axis
			xAxis = d3.svg.axis()
			.scale(x)
			.orient("bottom");

			yAxis = d3.svg.axis()
			.scale(y)
			.orient("left");

			// Create the line function
			line = d3.svg.line()
			.x(function(d) { return x(xFunction(d)); })
			.y(function(d) { return y(yFunction(d)); })
			.interpolate("step-after");

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

			lines.selectAll("path.loc").data([_states]).enter()
			.append("path")
			.attr("class", "line loc")
			.attr("d", line);

			// Create test group
			svg.append("g")
			.attr("class","tests");


			//Create selected group
			svg.append("g")
			.attr("class","selected");

			update(data);
		}

		function update(data){
			if(data.states === undefined){
				console.warn("[Chart]: Got undefined states",data);
				return;
			}
			_states = data.states;
			_drawPoints(data.states);
			if(data.selected !== null && data.selected !== undefined){
				_drawSelected(data.selected);
			}
		}

		function _drawPoints(state){

			// Set new domain
			x.domain([0,d3.max(state, xFunction)]);
			y.domain([0,d3.max(state, yFunction)]);

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



			var tests = state.filter(function(state){return state.ranTest});

			var breakElements = svg.selectAll(".tests");
			var bel = breakElements.selectAll(".testRan").data(tests)

			bel.enter().append("circle");

			bel.attr("class","testRan")
			.attr("r",1.5)
			.attr("cx",function(d){return x(xFunction(d));})
			.attr("cy",function(d){return y(yFunction(d));});

			bel.exit().remove();

		}

		function _drawSelected(state){
			
			var selected = svg.selectAll(".selected").selectAll("circle").data([state]);
			selected
			.attr("r",4)
			.attr("cx",function(d){return x(xFunction(d));})
			.attr("cy",function(d){return y(yFunction(d));})
			selected.enter().append("circle")
		}

		function destroy(){

		}

		return {
			update: update,
			destroy: destroy
		};
	};

	return Chart;
});
