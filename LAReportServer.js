"use strict";

var express = require("express");
var app = express();
var Log = require("./Logger.js");
var request = require("request");
var Promise = require("es6-promise").Promise;

app.get("/client/:nickname",function(req,res){

	var nickname = req.params.nickname;
	var url = "http://localhost:50812/client/"+nickname;
    var log = new Log("unknown", "Get client id by name:"+nickname);

	request.get(url,function(error,response,body){
		log.print();
		res.send(body);
	});
});

app.get("/client",function(req,res){

	var url = "http://localhost:50812/client";
    var log = new Log("unknown", "Get client list");

	request.get(url,function(error,response,body){
		log.print();
		res.send(body);
	});
});

app.get("/timeLapse/:clientId", function(req, res){
	//var clientId ="8ec9722482776dafe71dc6b29c57616c5ad12279";
	var clientId = req.params.clientId;
//	var url = "http://localhost:50811/repoTimelapse/"+clientId;
	var url = "http://localhost:50812/repoStates/"+clientId;
    var log = new Log(clientId, "Timelapse");

	request.get(url,function(error,response,body){
		log.print();
		res.send(body);
	});
});

app.use(express.static(__dirname + "/static"));

var port = 50809;
app.listen(port, function(){
    console.log("LAReport server listening on port "+port);
});
