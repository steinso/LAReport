// REQUIRES NODE HARMONY eg. ES6 features (generators, Promises)
// This program creates JSON states from a git repository
//
// [{fileName:name,
// 	 commits:[{ id: id,
// 	 			contents:[],
// 	 			
// 	 }]]
//
//

var exec = require('child_process').exec;
var fs = require('fs');

var snapshotSeperator = "1234";
var startDir;

exec("pwd",function(error,stdout,stderr){
	startDir = stdout;
});

/*
var genTest = function* (init){
	var i = init;
	i+=yield i;
	i += yield i;
	return i;
};
var g = genTest(5);
console.log(g.next(5));
console.log(g.next(5));
console.log(g.next(5));
console.log(g.next(5));
console.log(g.next(5));

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


var generateCommitsForFile = function(fileName,dir,callBack){

	exec("git rev-list HEAD --count;",{cwd:dir},function(error,stdout,stderr){
		var numberOfCommits = stdout;
		console.log("Number:",stdout);

		getContentsFromLastXCommits(fileName,dir,numberOfCommits-1,function(stdout,error){
			//console.log(stdout);
			var snapshots = stdout.split(snapshotSeperator);
			callBack(snapshots,error);
		});
	});
};

var generateBashCommands= function(fileName,number){
	var output = "";
	for(var i=number;i>=0;i--){
		output+="git --no-pager show master~"+i+":"+fileName+";echo "+snapshotSeperator+";";
	}
	return output;
};

var getContentsFromLastXCommits = function(fileName,dir,commitNumberFromHead,callBack){
	var command = generateBashCommands(fileName,commitNumberFromHead); 
	console.log("Command",command);

	var contents = exec(command,{cwd:dir},function(error,stdout,stderr){
		//console.log(stdout,error,stderr,command);
		callBack(stdout,error+stderr);
	});
};
var generateSnapshotsObject = function(fileName,dir){
	return new Promise(function(resolve,reject){

		generateCommitsForFile(fileName,dir,function(result,error){
			console.log("Kaviar");
			if(error !== null){
				reject(error);
			}
			var snapshots = {fileName:fileName,commits:result};

			resolve(snapshots);
		});
	});
};

var generateSnapshotsOfGitRepo = function(dir){

	return new Promise(function(resolve,reject){

		getGitFiles(dir).then(function(result){

			console.log("Results",result);

			var snapshotPromises = [];
			for(var file in result){
				file = result[file];

				var promise = generateSnapshotsObject(file,dir);
				snapshotPromises.push(promise);
			}
			//Wait till all snapshots have been created before fulfilling
			Promise.all(snapshotPromises).then(function(result){resolve(result);},function(error){reject(error);});
		},function(error){reject(error);});

	});
};	

/*generateSnapshotsOfGitRepo("866fa3d5245197ebf806943a7a2d26395e8cd7b8").then(function(fileSnapshots){
	console.log("All files have been collected",fileSnapshots.length);
	console.log(fileSnapshots.reduce(function(pile,obj){return pile+obj.fileName+",";},""));
});
*/

module.exports ={
	generateSnapshotsOfGitRepo:generateSnapshotsOfGitRepo,
	getGitFiles:getGitFiles
};
