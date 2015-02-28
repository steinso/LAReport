define([],function(){
	var Workspace = function(workspaceStates){
		var _states = [];
		var _fileList = [];

		_constructor(workspaceStates);
		function _constructor(states){
			states.map(function(state){
				addState(state);
			});
		}

		function getFileList (){
			return _fileList;
		}

		function getStates() {
			return _states;
		}

		function addState(state) {
			_addFilesToList(state.files);
			_states.push(state);
		}

		function _addFilesToList(files){
			files.map(function(file){
				var inList = _fileList.indexOf(file.name);
				if(inList<0){
					_fileList.push(file.name);
				}
			});	

		}

		return {
			getFileList:getFileList,
			addState:addState,
			getStates:getStates
		};

	};

	return Workspace;
});
