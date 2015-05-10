"use strict";
import Config from "Config";
import $ from "jquery";


function MarkerStore(){

		var getMarkerTypes = function(){
			return new Promise(function(resolve, reject){
				$.getJSON(Config.SERVER_URL+"markertypes/", function(data) {
					resolve(data);
				});
			});
		};

		var getMarkerTypesByCategory = function(){
			return new Promise(function(resolve, reject){
				$.getJSON(Config.SERVER_URL+"markertypesbycategory/", function(data) {
					resolve(data);
				});
			});
		};
		return {
			getMarkerTypesByCategory: getMarkerTypesByCategory,
			getMarkerTypes: getMarkerTypes
		};
}

export default new MarkerStore();
