define(['LoadingBar'],function(LoadingBar){

// Extends LoadingBar
var StartUpLoading = function(){
	var loading;
	var progressElement;
	var loadingElemt;

	var _constructor = function(){

		loading = new LoadingBar(_loadingFinished,_updateLoadingBar);
		progressElement = $('.loadingProgressElement');
		loadingElement = $('.loadingElement');
		
	};

	var _loadingFinished = function(){
		loadingElement.remove();	
	};

	var _updateLoadingBar = function(){
		var percent = loading.getProgress();
		progressElement.style('width',percent+"%");
	};
	
	_constructor();

	return loading;
};

return StartUpLoading;

});
