var open = require("nodegit").Repository.open;
var timer = require("./Timer.js");
var exec = require('child_process').exec;
var fs = require('fs');


/*
 *
 * Object: 
 * [{ //state
 *		time: ,
 *		files:[ 
 *			{
 *			name:
 *			fileContents:
 *		}]
 * }]
 */

var getGitFiles = function(dir){

	return new Promise(function(resolve,reject){

		exec("git ls-files",{cwd:dir},function(error,stdout,stderr){
			if(error != null || stderr != ""){
				reject(error+" \nstderr: "+stderr);
				return;
			}

			var files = stdout.split("\n");
			//Remove empty element
			files = files.filter(function(el) {return el.length !== 0});
			resolve(files);
		});
	});
};

var getStatesFromRepo = function(repoPath){
	return new Promise(function(resolve,reject){

	var watch = timer.create("getStates");
	watch.start();
	getGitFiles(repoPath).then(function(files){
		getFileStates(repoPath,files).then(function(states){
			watch.stop();
			console.log(watch.average(), "ms <- Generated states for ",repoPath);
			resolve(states);
		},function(error){reject(error);});	
	});
	});
};

var getFileStates = function(repoPath,files){
	return new Promise(function(resolve,reject){

		console.log("Getting file states");
		var states = [];
		var filesInRepo = files;
		// Open the repository directory.
		open(repoPath)
		// Open the master branch.
		.then(function(repo) {
			return repo.getMasterCommit();
		})
		// Display information about commits on master.
		.then(function(firstCommitOnMaster) {
			// Create a new history event emitter.
			var history = firstCommitOnMaster.history();

			history.on("end",function(commits){

				resolve(states);

			});

			history.on("error",function(error){
				reject(error);
			});
			// Listen for commit events from the history.
			history.on("commit", function(commit) {
				var state = {};
				state.time = commit.date();
				state.sha = commit.sha();
				state.msg = commit.message();
				state.files = [];

				states.push(state);

				// Give some space and show the message.
				filesInRepo.map(function(filename){
					commit.getEntry(filename).then(function(entry){
						entry.getBlob().then(function(blob){
							var file = {};
							file.name = filename;
							file.fileContents = String(blob);
							state.files.push(file);
						});
					}); //TODO HERE
				});
			});

			// Start emitting events.
			history.start();
		});
	});
};


module.exports = {
	getStatesFromRepo:getStatesFromRepo
};
