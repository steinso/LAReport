
"use strict";
import Config from "Config";
import $ from "jquery";

function FileStore(){
	var _files = {};

	function getFileContents(clientId, path){
		return new Promise(function(resolve, reject){

			var data = {
				clientId: clientId,
				path: path
			}

			$.getJSON(Config.SERVER_URL+"file/", data, function(file) {
				console.log("Fetched file: ",file, "for client " + clientId);
				resolve(file);
			});
		});
	}

	return{
		getFileContents: getFileContents
	};
}

export default new FileStore();
