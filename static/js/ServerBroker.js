define([],function(){
	var ServerBroker = function(){
		var getClientFilesById = function(clientId){
			return new Promise(function(resolve,reject){

				$.getJSON("/timeLapse/"+clientId, function(data) {

					resolve(data);
				});
			}); 
		};

		return{
			getClientFilesById:getClientFilesById
		};
	};
	return ServerBroker;
});
