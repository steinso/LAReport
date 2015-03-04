"use strict";

var express = require("express");
var app = express();
var gitConverter= require("./GitTimeLapseNodeGit.js");
var Log = require("./Logger.js");
var StateAnalytics = require("./StateAnalytics");
var GitFilesToObjectsConverter = require("./GitFilesToObjectsConverter.js");
var request = require("request");

app.get("/client",function(req,res){

	request.get("http://localhost:50811/client",function(error,response,body){
		res.send(body);
	});
});

app.get("/timeLapse/:clientId", function(req, res){
    var log = new Log("unknown", "Timelapse");
	//var clientId ="8ec9722482776dafe71dc6b29c57616c5ad12279";
	var clientId = req.params.clientId;

	request.get("http://localhost:50811/repoTimelapse/"+clientId,function(error,response,body){
		res.send(body);
	});
	/*
    //var commits = gitcommits.generatecommitsOfGitRepo("/srv/LAHelper/logs/597cd4dc32743cca14f26abc73dc994049018ea0");
    var Commits= gitConverter.getCommitsFromRepo("/srv/LAHelper/logs/8ec9722482776dafe71dc6b29c57616c5ad12279");
    //var Commits= gitConverter.getCommitsFromRepo("/srv/LAHelper/logs/78e6d96d44929f294d58d686dc07253416d748ec");
    Commits.then(function(commits){
        console.log(commits);
        GitFilesToObjectsConverter.convert(commits).then(function(states){
                StateAnalytics.getAnalyticsOfStates(states).then(function(states){

                    var returnedData = JSON.stringify(states);
                    res.send(returnedData);
                    log.debug("Success");
                    log.print();
                }, function(error){
                    console.log("Error: ", error);
                    res.send("Error: "+error);
                });

            }, function(error){
                console.log("Error: ", error);
                res.send("Error: "+error);
            }
        );

    }, function(error){
        res.send("Error : "+error);
        log.error("Error");
        log.print();
    });
	*/

});

app.use(express.static(__dirname + "/static"));

var port = 50809;
app.listen(port, function(){
    console.log("LAReport server listening on port "+port);
});
