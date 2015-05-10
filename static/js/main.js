"use strict";
import React from "react";
import $ from "jquery";
import StartUpLoading from "StartUpLoading";
import ServerBroker from "ServerBroker";
import MainReportPageComponent from "components/MainReportPageComponent";
import OverallStatsPage from "components/pages/OverallStatsPage";
import StatsPage from "components/pages/StatsPage";
import ExplorePage from "components/pages/ExplorePage";
import ExamineExpressionPage from "components/pages/ExamineExpressionPage";
import InspectPage from "components/pages/InspectPage";
import clientId from "ClientId";

require("style.css");

	var startUpLoading = new StartUpLoading();

	var initialiseUi = function(){

		startUpLoading.setDone();
		var pages = [
			{name: "Overview", icon: "heartbeat", getComponent: function(){

			}},
			{name: "Stats", icon: "line-chart", getComponent: function(){
				var Page = new OverallStatsPage();
				return Page.getElement();
			}},
			{name: "Examine", icon: "eye", getComponent: function(){
				var Page = new ExamineExpressionPage();
				return Page.getElement();
			}},
			{name: "Explore", icon: "magic", getComponent: function(){
				var Page = new ExplorePage();
				return Page.getElement();
			}},
			{name: "Individual", icon: "area-chart", getComponent: function(){
				var Page = new StatsPage();
				return Page.getElement();
			}},
			{name: "Inspect", icon: "code", getComponent: function(){
				var Page = new InspectPage();
				return Page.getElement();
			}}
			];

			var mainElement = React.createElement(MainReportPageComponent,{pages: pages});

			React.render(
				mainElement,
				document.getElementById("body")
			);
	};

	function startup(){
		var serverBroker = new ServerBroker();
		if(clientId.id == null){
			var nickname= prompt("Enter your nickname:");
			clientId.id = nickname;
			serverBroker.getClientId(nickname).then(function(id){
				if(id === undefined){
					alert("Kallenavn("+nickname+") finnes ikke i databasen, prøv Å sett et nytt kallenavn. Hvis dette ikke fungerer, vennligst gi beskejd.");
				}
				clientId.id = id;
				initialiseUi();
			});
		}else{
				initialiseUi();
		}
	}

	startup();
