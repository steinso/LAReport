
var app  = require("../../LAReportServer.js");
var assert = require("assert");
var request = require("request");
var should = require("should");

var port = 44988;

function defaultGetOptions(path) {
	var options = {
		"host": "localhost",
		"port": port,
		"path": path,
		"method": "GET",
	};
	return options;

}

describe("app", function () {

	before (function (done) {
		app.listen(port, function (err, result) {
			if (err) {
				done(err);
			} else {
				done();
			}
		});

		after(function (done) {
			app.close();
		});

		it("should exist", function (done) {
			assert.equal(app !== null,true);
			done();
		});

		it("should be listening at localhost:"+port+" otherwise configure port in test file", function (done) {
			request.get("http://localhost"+port+"/", function (error,response,body) {
				response.statusCode.should.eql(404);
				done();
			});
		});
	});
})

