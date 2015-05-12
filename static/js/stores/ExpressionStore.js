"use strict";

function ExpressionStore(){

	var _expressions = [];


	function _constructor(){
		_loadStoredExpressions();
	}

	function addExpression(){

	}

	function removeExpression(){

	}

	function getExpressions(){
		return _expressions;
	}

	function createExpressionVariables(state){
		var expressionVariables = {};
		var variables = ["$A", "$B", "$C", "$D", "$E", "$F", "$G", "$H", "$I", "$J", "$K", "$L", "$M", "$N", "$O", "$P", "$Q", "$R", "$S", "$T", "$U"];

		if(state === null || state === undefined){
			return expressionVariables;
		}

		var fields = Object.keys(state);
		fields.map(function(field, index){
			var variable = variables[index];
			expressionVariables[variable] = field;
		});

		return expressionVariables;
	}

	function addRawExpression(expression, expressionVariables){
		var expr = _parseRawExpression(expression, expressionVariables);
		_expressions.push(expr);
		console.log("expression added: ", expr);

		//Store in client storage
		localStorage.setItem("expressions", JSON.stringify(_expressions));
	}

	function _parseRawExpression(expression, expressionVariables){
		// We take in a string with user defined vatiables
		// then we replace them with a reference to a field in a state
		// we do this by replacing ex. $A with state['time']
		// we then eval this string in a function that takes
		// state as a parameter

		var exprX = expression.computerReadablexFunction;
		var exprY = expression.computerReadableyFunction;
		var exprHumanReadableX = exprX;
		var exprHumanReadableY = exprY;

		var variables = Object.keys(expressionVariables);

		variables.forEach(function(variable){
			// Same as global replace, but requires less fiddling and has higher performance
			exprX = exprX.split(variable).join("state['"+expressionVariables[variable]+"']");
			exprY = exprY.split(variable).join("state['"+expressionVariables[variable]+"']");
			exprHumanReadableX = exprHumanReadableX.split(variable).join(expressionVariables[variable]);
			exprHumanReadableY = exprHumanReadableY.split(variable).join(expressionVariables[variable]);
		});

		// Yes, eval is no good, however this is client side, and is a prototype
		// functionality vs time, this wins
		return {
			name: expression.name,
			expressionVariables: expressionVariables,
			computerReadablexFunction: exprX,
			computerReadableyFunction: exprY,
			humanReadablexFunction: exprHumanReadableX,
			humanReadableyFunction: exprHumanReadableY,
			xFunction: function(state){return eval(exprX);},
			yFunction: function(state){return eval(exprY);}
		};
	}


	function _loadStoredExpressions(){
		try{
			if(JSON.parse(localStorage.getItem("expressions")).constructor === Array){
				_expressions = JSON.parse(localStorage.getItem("expressions")).map(_parseRawExpression);
				console.log("Loaded",_expressions);
			}
		}catch(e){
			console.log("No saved expressions found", e);
		}
	}

	_constructor();

	return {
		addExpression: addExpression,
		addRawExpression: addRawExpression,
		removeExpression: removeExpression,
		createExpressionVariables: createExpressionVariables,
		getExpressions: getExpressions
	};
}

export default new ExpressionStore();
