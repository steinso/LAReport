"use strict";

require("dotenv").load();
var express = require("express");
var app = express();
var Log = require("./Logger.js");
var request = require("request");
var Promise = require("es6-promise").Promise;
var LASTORE_URL = "http://localhost:50812/";
var PORT = 50809;

//CORS middleware
app.use(function(req, res, next) {

	if(process.env.ENVIRONMENT!=="Development"){next();return;}

	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	res.header('Access-Control-Allow-Headers', 'Content-Type');

	next();
});

app.get("/client/:nickname",function(req,res){

	var nickname = req.params.nickname;
	var url = LASTORE_URL+"client/"+nickname;
    var log = new Log("unknown", "Get client id by name:"+nickname);

	request.get(url,function(error,response,body){
		log.print();
		res.send(body);
	});
});

app.get("/client",function(req,res){

	var url = LASTORE_URL+"client";
    var log = new Log("unknown", "Get client list");

	request.get(url,function(error,response,body){
		log.print();
		res.send(body);
	});
});

app.get("/timeLapse/:clientId", function(req, res){

	var clientId = req.params.clientId;
	var url = LASTORE_URL+"repoStates/"+clientId;
    var log = new Log(clientId, "Timelapse");

	request.get(url,function(error,response,body){
		log.print();
		res.send(body);
	});
});

app.get("/markertypes", function(req, res){

	var url = LASTORE_URL+"markertypes";
    var log = new Log("unknown", "MarkerTypes");

	request.get(url,function(error,response,body){
		log.print();
		res.send(body);
	});
});

app.get("/markertypes/category", function(req, res){

	var url = LASTORE_URL+"markertypes/category";
    var log = new Log("unknown", "CatMarkerTypes");

	request.get(url,function(error,response,body){
		log.print();
		res.send(body);
	});
});

app.get("/category/user", function(req, res){

	var url = LASTORE_URL+"category/user";
    var log = new Log("unknown", "Users in category:"+req.query);

	request({url: url, method: "GET", qs: req.query},function(error,response,body){
		log.print();
		res.send(body);
	});
});

app.use(express.static(__dirname + "/static"));

app.listen(PORT, function(){
    console.log("LAReport server listening on port "+PORT);
});
