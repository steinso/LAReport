/**
 *
 *  DB "Schema"
 *  User -> Repo -> File -> FileStates -> Marker
 *  FileState -> Category
 *  Repo -> RepoState -> FileState
 *
 * Marker: {Type:'error',}
 */
var neo4j= require('neo4j');
var db = new neo4j.GraphDatabase("http://localhost:7474");

var DBNeo4jAdapter = function(){

	function addState(user,state){
		var query = "CREATE (u:User {name:{name}}) RETURN u";
		var params = {name:'stein'};

		db.cypher({query:query,params:params},function(error,result){
			console.log('Err',error,'Result',result);
		});
	}

	function getFileStates(user,path){

	}

	function getFiles(user){

	}

	// TODO: Not sure how tests should fit in the graph
	// 		Category should not depend on "test" as it is too general
	function addCategory(name,tests){
		var params = {categoryName:name};
		var query = "MATCH (c:Category {name:{categoryName}})";
		tests.forEach(function(test,index){
			var id = "t"+index;
			var part = ", ("+id+":Test {name: {"+id+"Name})";
			query+= part;
			params[id+'Name'] = test.name;
		});


		tests.forEach(function(test,index){
			var id = "t"+index;
			query += " MERGE (c) -[:HAS_TEST]-> ("+id+")";
		});

		return query;
	}


	return {
		addState:addState,
		getFileStates:getFileStates,
		addCategory:addCategory
	};
};

var ad = new DBNeo4jAdapter();

var c = ad.addCategory("Oving1",[{name:'test1'},{name:'test2'}]);
console.log(c)
