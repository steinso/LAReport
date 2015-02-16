var express = require('express');
var app = express();
var gitSnapshots = require('./GitTimeLapseNodeGit.js');
var Log = require('./Logger.js');
var StateAnalytics = require("./StateAnalytics");

app.get('/timeLapse', function(req, res){
	var log = new Log('unknown',"Timelapse");

	//var Snapshots = gitSnapshots.generateSnapshotsOfGitRepo("/srv/LAHelper/logs/597cd4dc32743cca14f26abc73dc994049018ea0");
	var Snapshots = gitSnapshots.getStatesFromRepo("/srv/LAHelper/logs/597cd4dc32743cca14f26abc73dc994049018ea0");
	Snapshots.then(function(snapshots){
		StateAnalytics.runAllAnalyticsOnStates(snapshots).then(
			function(states){

			var returnedData = JSON.stringify(snapshots);
			res.send(returnedData);
			log.debug("Success");
			log.print();
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
