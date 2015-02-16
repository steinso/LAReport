define(function(){
	var ClientDataAdapter = function(){

		var convertServerData = function(data){
			var files = _generateFiles(data);
			var markers = _convertMarkers(data);
			var tests = _convertTests(data);
			return{markers:markers,
				tests:tests,
				files:files
			};
		};

		var _generateFiles = function(data){
			var files = [];
			data.map(function(serverfile){
				var file = _generateFile(serverfile);

			});
		};

		var _generateFile = function(serverfile){
			var file = new File(serverfile);
			return file;
		};

		var _convertMarkers = function(data){

		};
		
		var _convertTests = function(data){


			return tests;

		};

		return {
			convertServerData:convertServerData
		};
	};
	return ClientDataAdapter;
});
