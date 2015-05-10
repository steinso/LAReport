var timelapse = require('../../GitTimeLapse.js');
var should = require('should');

describe("Gti timelapse",function(){
	describe("gitGetFiles",function(){
		var list = ['index.html','test.js'];
		it("shuold return accurate list of files given absolute directory:",function(done){
			timelapse.getGitFiles("/home/stan/projects/errorLogger/filesDev/gitTest").then(function(result){

				result.should.eql(list);
				done();
			},function(error){
				console.log(error);
				done('');
			});
			});
		it("should return accurate list of files given relative directory:",function(done){
			timelapse.getGitFiles("../filesDev/gitTest").then(function(result){

				result.should.eql(list);
				done();
			},function(error){
				console.log(error);
				console.log("Im right before done!");
				done();
			});
		});

	});
});
