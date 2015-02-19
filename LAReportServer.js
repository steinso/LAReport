var express = require('express');
var app = express();
var gitConverter= require('./GitTimeLapseNodeGit.js');
var Log = require('./Logger.js');
var StateAnalytics = require("./StateAnalytics");
var GitFilesToObjectsConverter = require("./GitFilesToObjectsConverter.js");

app.get('/timeLapse', function(req, res){
	var log = new Log('unknown',"Timelapse");

	//var commits = gitcommits.generatecommitsOfGitRepo("/srv/LAHelper/logs/597cd4dc32743cca14f26abc73dc994049018ea0");
	var Commits= gitConverter.getCommitsFromRepo("/srv/LAHelper/logs/597cd4dc32743cca14f26abc73dc994049018ea0");
	Commits.then(function(commits){
		GitFilesToObjectsConverter.convert(commits).then(function(states){
			StateAnalytics.getAnalyticsOfStates(states).then(function(states){

				var returnedData = JSON.stringify(states);
				res.send(returnedData);
				log.debug("Success");
				log.print();
			},function(error){
			console.log("Error: ",error);
			res.send("Error: "+error);
			});

		},function(error){
			console.log("Error: ",error);
			res.send("Error: "+error);
		}
														);

	},function(error){
		res.send("Error : "+error);
		log.error("Error");
		log.print();
	});

});

app.use(express.static(__dirname + '/static'));

var port = 50809;
app.listen(port,function(){
	console.log("LAReport server listening on port "+port);
});
