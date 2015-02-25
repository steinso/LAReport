define([],function(){
/**
 * State object to use as communication broker between react components
 * and services etc.
 * It implements a Observer/ callback listeners
 *
 */
var Store = function(params){
		var _listeners = [];
		var _state = {};
	
		function addListener(listener){
		  _listeners.push(listener);
		}

		function removeListener(listener){
			delete _listeners[_listeners.indexOf(listener)];
		}

		function getState(){
			return _state;
		}
	
		function setState(state){
			_state = state;
			_notifyListeners();
		}

		function _notifyListeners(){
			
			_listeners.map(function(listener){
				listener(_state);
			});
		}

		return {
			addListener:addListener,
			removeListener:removeListener,
			getState:getState,
			setState:setState
		};
	};

	return Store;
});
