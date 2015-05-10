var should = require("should");
import StateCombiner from "../../static/js/processors/StateCombiner";

var files = [{
				states: [{
					time: 1,
					numberOfLines: 0,
					numberOfMarkers: 0,
					numberOfFailedTests: 0
				},
				{
					time: 5,
					numberOfLines: 5,
					numberOfMarkers: 0,
					numberOfFailedTests: 0
				},{
					time: 10,
					numberOfLines: 10,
					numberOfMarkers: 0,
					numberOfFailedTests: 0
				}]
			},{
				states: [{
					time: 6,
					numberOfLines: 100,
					numberOfMarkers: 0,
					numberOfFailedTests: 0
				}]
			},{
				states: [{
					time: 6,
					numberOfLines: 1,
					numberOfMarkers: 0,
					numberOfFailedTests: 0
				},
				{
					time: 8,
					numberOfLines: 2,
					numberOfMarkers: 0,
					numberOfFailedTests: 0
				},{
					time: 15,
					numberOfLines: 5,
					numberOfMarkers: 0,
					numberOfFailedTests: 0
				}]
			}];


var avgFiles = [{
				states: [{
					time: 1430931614000,
					numberOfLines: 0,
					numberOfMarkers: 0,
					numberOfFailedTests: 0
				},
				{
					time: 1430931714000,
					numberOfLines: 5,
					numberOfMarkers: 0,
					numberOfFailedTests: 0
				},{
					time: 1430931814000,
					numberOfLines: 10,
					numberOfMarkers: 0,
					numberOfFailedTests: 0
				}]
			},{
				states: [{
					time: 1430931714000,
					numberOfLines: 0,
					numberOfMarkers: 0,
					numberOfFailedTests: 0
				}]
			},{
				states: [{
					time: 1430931714000,
					numberOfLines: 0,
					numberOfMarkers: 0,
					numberOfFailedTests: 0
				},
				{
					time: 1430931800000,
					numberOfLines: 8,
					numberOfMarkers: 0,
					numberOfFailedTests: 0
				},{
					time: 1430931914000,
					numberOfLines: 15,
					numberOfMarkers: 0,
					numberOfFailedTests: 0
				}]
			}];

describe("StateCombiner should combine states",function(){
	it("should be able to add states",function(){
			
			var combinedStates = StateCombiner.add(files);
			combinedStates.should.have.length(6);
			console.log("Len "+ combinedStates.length);

	});

	it("should be able to avarage states",function(){
			
			var combinedStates = StateCombiner.average(avgFiles);
			combinedStates.should.have.length(6);
			console.log("Len "+ combinedStates.length);

	});

});

