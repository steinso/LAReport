define(['ClientId'],function(user){
	/*
	 * Singleton that handles communication with the server
	 */

	var ServerBroker = function(){

		var getClientFilesById = function(clientId){
			return new Promise(function(resolve,reject){

				$.getJSON("/timeLapse/"+clientId, function(data) {
					console.log("GOT ",data);

					resolve(data);
				});
			});
		};

		var getClientList= function(){
			return new Promise(function(resolve,reject){

				$.getJSON("/client", function(data) {
					resolve(data);
				});
			});
		};

		var getClientId = function(name){
			return new Promise(function(resolve,reject){

				$.getJSON("/client/"+name, function(data) {
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
