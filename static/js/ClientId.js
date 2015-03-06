
define([],function(){

		var ClientId = function(){

			var authToken;
			var nickName;
			var id;
			var privilege;
			privilege = "user";

			return{
				get id(){return id;},
				set id(val){id=val;},
				get nickName(){return nickName;},
				set nickName(val){nickName=val;},
				get privilege(){return privilege;},
				set privilege(val){privilege=val;},
				get authToken(){return authToken;},
				set authToken(val){authToken=val;}
			};
		};

		return new ClientId();
});
