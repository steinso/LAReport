"use strict";
import Config from "Config";
import ClientProcessor from "processors/ClientProcessor";
import $ from "jquery";

function ClientStore(){
	var _clientList = [];
	var _clients = {};

	function getClient(clientId){
		return new Promise(function(resolve, reject){

			$.getJSON(Config.SERVER_URL+"timeLapse/"+clientId, function(client) {

				console.log("Parsing client data");
				_clients[client.clientId] = ClientProcessor.process(client);

				resolve(_clients[client.clientId]);
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
