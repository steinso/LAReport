function LoadingBar(onFinished,onProgress){
	var progress = 0;
	var done =false;
	var listeners = [];

	var start = function(){
		progress = 0;
		done =false;
		listeners = [];
	};

	var setDone = function(){
		done = true;
		notify();
		onFinished();
	};

	var incProgress = function(percent){
		progress +=percent;
		notify();
		onProgress();
	};

	var notify = function(){
		listeners.map(function(listener){
			listener.onLoadingProgress(done);
		});
	};
	
	var registerListener = function(listener){
		listerners.push(listner);
	};

	return{
		setDone:setDone,
		incProgress:incProgress,
		getProgress:incProgress,
		registerListener:registerListener,
		start:start
	};
}
export default LoadingBar;
