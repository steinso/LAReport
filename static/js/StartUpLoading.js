import LoadingBar from "LoadingBar";
import $ from "jquery";

// Extends LoadingBar
var StartUpLoading = function(){
	var loading;
	var progressElement;
	var loadingElement;

	var _constructor = function(){

		loading = new LoadingBar(_loadingFinished,_updateLoadingBar);
		progressElement = $(".loadingProgressElement");
		loadingElement = $(".loadingElement");
	};

	var _loadingFinished = function(){
		loadingElement.remove();
	};

	var _updateLoadingBar = function(){
		var percent = loading.getProgress();
		progressElement.style("width",percent+"%");
	};

	_constructor();

	return loading;
};

export default StartUpLoading;

