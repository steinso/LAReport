"use strict";
define(["react", "jquery", "StartUpLoading", "ServerBroker", "jsx!components/MainReportPageComponent", "jsx!components/pages/StatsPage", "jsx!components/pages/InspectPage", "ClientId"], function(React, $, StartUpLoading, ServerBroker, MainReportPageComponent, StatsPage, InspectPage, clientId){

	var startUpLoading = new StartUpLoading();

	var initialiseUi = function(){

		startUpLoading.setDone();
		var pages = [
			{name: "Overview", icon: "heartbeat", getComponent: function(){

			}},
			{name: "Stats", icon: "line-chart", getComponent: function(){
				var Page = new StatsPage();
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
	});
