"use strict";

function ExpressionStore(){

	var _expressions = [];
	var _subscribers = [];
	var idx = 0;


	function _constructor(){
		_loadStoredExpressions();
	}

	function addExpression(expression, id){
		var timestamp = Date.now();
		if(!id){
			id = ""+ timestamp + (idx++);
		}

		expression.id = id;
		expression.lastEdit = timestamp;

		_expressions.push(expression);

	}

	function deleteExpression(id, noSave){
		if(id === undefined){return;}
		_expressions = _expressions.filter(function(expr){
			if(expr.id === id){
				return false;
			}

			return true;
		});

		//Dynamic lanugage..
		if(noSave !== true){
			_saveExpressions();
		}
		console.log("Expression deleted: ",id);
	}

	function editExpression(expression){
		deleteExpression(expression.id,true);
		addExpression(expression,expression.id);

		_saveExpressions();
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

	function addRawExpression(expression){

		var expr = _parseRawExpression(expression);

		if(expression.id !== undefined){
			editExpression(expr);
		}else{
			addExpression(expr);
		}

		console.log("expression added: ", expr);

		//Store in client storage
		_saveExpressions();
	}

	function _parseRawExpression(expression){
		// We take in a string with user defined vatiables
		// then we replace them with a reference to a field in a state
		// we do this by replacing ex. $A with state['time']
		// we then eval this string in a function that takes
		// state as a parameter

		var exprX = expression.rawxFunction;
		var exprY = expression.rawyFunction;
		var exprHumanReadableX = exprX;
		var exprHumanReadableY = exprY;
		var expressionVariables = expression.expressionVariables;

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
			id: expression.id,
			name: expression.name,
			xName: expression.xName,
			yName: expression.yName,
			expressionVariables: expressionVariables,
			rawxFunction: expression.rawxFunction,
			rawyFunction: expression.rawyFunction,
			computerReadablexFunction: exprX,
			computerReadableyFunction: exprY,
			humanReadablexFunction: exprHumanReadableX,
			humanReadableyFunction: exprHumanReadableY,
			xFunction: function(state){return eval(exprX);},
			yFunction: function(state){return eval(exprY);}
		};
	}

	function subscribe(func){
		_subscribers.push(func);
	}

	function _notify(){
		_subscribers.forEach(function(s){
			s(_expressions);
		});
	}

	function _saveExpressions(){
		localStorage.setItem("expressions", JSON.stringify(_expressions));
		_notify();
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
		editExpression: editExpression,
		addRawExpression: addRawExpression,
		deleteExpression: deleteExpression,
		createExpressionVariables: createExpressionVariables,
		subscribe: subscribe,
		getExpressions: getExpressions
	};
}

export default new ExpressionStore();
