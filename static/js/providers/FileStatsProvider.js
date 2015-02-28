define(['jquery'],function($){

	var FileStatsProvider= function(userId){
		_userId = userId;

		function getStatsByFileName(fileName){
			return new Promise(function(resolve,reject){

				$.getJSON("/timeLapse/"+_userId, function(data) {
					var fileData = []; 
					console.log(data);
					var startDate = +new Date(data[0].time);
					data.map(function(state){
						var file = state.files.filter(function(file){
							if(file.name == fileName){ return true;	}
							return false;
						});
						if(file.length === 0){return;} 

						var fileState = file[0];
						fileState.time = state.time;
						fileState.workingTime = +new Date(state.time)-startDate;
						fileState.workingTime /= 1000*60;
						fileData.push(fileState);
						
					});
					console.log("Filedata:",fileData);
					if(fileData.length<1){
						reject("File not found: "+fileName);
					}
					resolve(fileData);
				});

			});
		}

		return{
			getStatsByFileName:getStatsByFileName
		};
	};

	return FileStatsProvider; 
});
