"use strict";
import Config from "Config";
import ClientProcessor from "processors/ClientProcessor";
import $ from "jquery";

function ClientStore(){
	var _clientList = [];
	var _clients = {};

	function getClient(clientId){
		return new Promise(function(resolve, reject){

			$.getJSON(Config.SERVER_URL+"timeLapse/"+clientId, function(data) {

				console.log("Parsing client data");
				_clients[clientId] = ClientProcessor.process(data);

				resolve(_clients[clientId]);
			});
		});
	}

	function getClientList(){
		return new Promise(function(resolve, reject){
			$.getJSON(Config.SERVER_URL+"client", function(_clientList) {
				resolve(_clientList);
			});
		});
	}
	function getClientIdByName(name){
		return new Promise(function(resolve,reject){

			$.getJSON(Config.SERVER_URL+"client/"+name, function(client) {
				var id = client.id;
				resolve(id);
			});
		});
	}

	return{
		getClientList: getClientList,
		getClient: getClient,
		getClientIdByName: getClientIdByName
	};
}

export default new ClientStore();
