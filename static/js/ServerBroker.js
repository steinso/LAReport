define(['ClientId','providers/FileStatsProvider'],function(user,FileStatsProvider){
	/*
	 * Singleton that handles communication with the server
	 */

	var ServerBroker = function(){

		var getClientFilesById = function(clientId){
			return new Promise(function(resolve,reject){

				var fileStatsProvider = new FileStatsProvider();

				$.getJSON("timeLapse/"+clientId, function(data) {
					console.log("GOT ",data);
					console.log("Parsing data");
					data.forEach(function(file){
						fileStatsProvider.getStatsOfFile(file);
					})
					resolve(data);
				});
			});
		};

		var getClientList= function(){
			return new Promise(function(resolve,reject){

				$.getJSON("client", function(data) {
					resolve(data);
				});
			});
		};

		var getClientId = function(name){
			return new Promise(function(resolve,reject){

				$.getJSON("client/"+name, function(data) {
					var id= data.id;
					resolve(id);
				});
			});
		};

		return{
			getClientFilesById: getClientFilesById,
			getClientId: getClientId,
			getClientList: getClientList
		};
	};
	return ServerBroker;
});
