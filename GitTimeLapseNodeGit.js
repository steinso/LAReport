var open = require("nodegit").Repository.open;
var timer = require("./Timer.js");
var exec = require('child_process').exec;
var fs = require('fs');


/*
 *
 * Object: 
 * [{ //commit
 *		time: ,
 *		files:[ 
 *			{
 *			name:
 *			fileContents:
 *		}]
 * }]
 */


var getCommitsFromRepo = function(repoPath){
	return new Promise(function(resolve,reject){

		var watch = timer.create("getCommits");
		watch.start();

		getFileListFromGitRepo(repoPath).then(function(files){
			getFileCommits(repoPath,files).then(function(commits){
				watch.stop();
				console.log(watch.average(), "ms <- Generated commits for ",repoPath,commits.length);

				resolve(commits);
			},function(error){reject(error);});	
		});
	});
};

// ls-files is not available through nodegit, so it must be fetched manually
var getFileListFromGitRepo = function(dir){

	return new Promise(function(resolve,reject){

		exec("git ls-files",{cwd:dir},function(error,stdout,stderr){
			if(error !== null || stderr !== ""){
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

var getFileCommits = function(repoPath,files){
	return new Promise(function(resolve,reject){

		var commits = [];
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

			history.on("end",function(_commitObjs){
				resolve(commits);
			});

			history.on("error",function(error){
				reject(error);
			});

			history.on("commit", function(commit) {

				generateCommitObject(commit,filesInRepo).then(function(_commit){
					commits.push(_commit);

				},function(error){
					console.log("Could not parse commit: "+error);
				});
			});

			// Start emitting events.
			history.start();
		});
	});
};


var generateCommitObject = function(_commit,filesInRepo){
	return new Promise(function(resolve,reject){

		var commit = {};
		commit.time = _commit.date();
		commit.sha = _commit.sha();
		commit.msg = _commit.message();
		commit.files = [];

		//Get file contents from commit
		filesInRepo.map(function(filename){
			_commit.getEntry(filename).then(function(entry){
				entry.getBlob().then(function(blob){
					var file = {};
					file.name = filename;
					file.fileContents = String(blob);
					commit.files.push(file);
					resolve(commit);
				});
			}); 
		});
	});
};

module.exports = {
	getCommitsFromRepo:getCommitsFromRepo
};
