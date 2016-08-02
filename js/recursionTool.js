(function() {
	var app = angular.module('recursionTool', []);

	app.run(function($rootScope) {
		$rootScope.dbDetails = []; //shared variable, contains names of table and columns for semantic check
		$rootScope.finalEmpty = "";
		$rootScope.finalHeader = [];
		$rootScope.finalData = {};
		$rootScope.withStep = false;
		
	    $rootScope.$on('execQueryEmit', function(event, args) {
	        $rootScope.$broadcast('execQueryBroadcast', args);
	    });
	    
	    
	});
	
	/*
	 * Controller for input form
	 */
	app.controller('inputController', function($scope, $rootScope) {
		$scope.result = "result";	
		$scope.validInput = "";
		$scope.explain = "";
		$scope.nonRecursiveReason = "";
		$scope.parser = require('./parser/sqlparser.js');
		$scope.gistParser = require('./parser/gistparser.js');
		$scope.parsed = "";
		$scope.parseErr = "";
		$scope.parseSuccess = false;
		$scope.parseError = false;
		$scope.semanticErr = "";
		$scope.semanticError = false;
		$scope.withSuccess = false;
		$scope.recSteps = 10;
		
		var exampleRecursion = 'WITH RecRel(abflug,ankunft) AS\n'+
			'(\n\tSELECT flug.abflug, flug.ankunft FROM flug WHERE flug.abflug = "VIE"\n'+
				'\tUNION ALL\n'+
				'\tSELECT step.abflug, step.ankunft\n'+ 
			 	'\tFROM RecRel AS rec JOIN flug AS step ON (rec.ankunft = step.abflug) \n)\n'+
			'SELECT * FROM RecRel';
		
		var exampleRecursionConcat = 'WITH RecRel(stufe,pfad,abflug,ankunft) AS\n'+
		'(\n\tSELECT 1, concat(flug.abflug," - ",flug.ankunft),flug.abflug, flug.ankunft FROM flug WHERE flug.abflug = "VIE"\n'+
		'\tUNION ALL\n'+
		'\tSELECT 1+rec.stufe, concat(rec.pfad," - ",step.ankunft),step.abflug, step.ankunft\n'+ 
	 	'\tFROM RecRel AS rec JOIN flug AS step ON (rec.ankunft = step.abflug) \n)\n'+
	'SELECT * FROM RecRel'; 
		
		$scope.editor = CodeMirror.fromTextArea(document.getElementById("inputText"), {
			lineNumbers : true,
			matchBrackets : true,
			mode : "text/x-mysql"
		});
		
		//whenever value of editor changes, try to parse it
		$scope.editor.on("change", function() {
			$rootScope.withStep = false;
			$scope.parseQuery($scope.editor.getValue().trim());
			$scope.result = JSON.stringify($scope.parsed);
			$scope.$apply();

		  });
		
		$scope.highlightError = function(start,end){
			$scope.editor.markText({line:start.line,ch:start.column}, {line:end.line,ch:end.column});
		}
		
		$scope.example = function(){
			$scope.editor.setValue(exampleRecursion);
		};
		
		$scope.exampleConcat = function(){
			$scope.editor.setValue(exampleRecursionConcat);
		}
		
		/* Syntax Check */
		$scope.parseQuery = function(sql){
			if(sql == ""){
				$scope.parseSuccess = false;
				$scope.parseError = false;
				document.getElementById("submitQueryButton").disabled=true;
				return;
			}
			try{
				$scope.parsed = $scope.parser.parse(sql);
				$scope.parseError = false;
				var semCheck = $scope.semanticCheck($scope.parsed);
				if(semCheck.bool){
					$scope.semanticError = false;
					$scope.parseSuccess = true;
					
					if($scope.withSuccess){
						$scope.validInput = "Valid input: Recursive query";
					}
					else{
						$scope.validInput = "Valid input: Step-by-Step Solution not available ("+$scope.nonRecursiveReason+")";
					}
					
					document.getElementById("submitQueryButton").disabled=false;
			}
				else{
					$scope.semanticErr = semCheck.err;
					$scope.semanticError = true;
					$scope.parseSuccess = false;
					document.getElementById("submitQueryButton").disabled=true;
				}
			}
			catch(err){
				console.log(err);
				$scope.parseErr = err["name"]+" at line "+err["location"]["start"]["line"]+", column "+err["location"]["start"]["column"];
				//$scope.highlightError(err.location.start,err.location.end);
				$scope.parseSuccess = false;
				$scope.parseError = true;
				document.getElementById("submitQueryButton").disabled=true;
			}
		};
		
		/* Semantic Check */
		$scope.semanticCheck = function(parsed){
			var db = $rootScope.dbDetails;
			var result = {};
			result.bool = true;
			var aliases = [];
			var t_aliases = [];
			var clause_name = "";
			var clause_att = [];
			
			//basic semantic check (table, column names)
			function process(key,value) {
				if(value == null) return; //necessary for something like "select * from flug, flughafen", somehow doesnt get caught before
				if(value.hasOwnProperty('clause_name') && value.hasOwnProperty('clause_att')){
					clause_name = value.clause_name; //to check if outer query references the correct with-clause
					clause_att = value.clause_att.slice(); //number of attributes need to be the same in clause and query definition
				}
				if(value.hasOwnProperty('table') && value.hasOwnProperty('column')){
					if(value.table == clause_name && clause_att.indexOf(value.column) != -1){
						console.log(value.table+"."+value.column+" property found");
						return;
					}
				
				   for(var i = 0; i < db.length; i++){
					   if(value.table == db[i].table){
						   if(db[i].column.indexOf(value.column) != -1 || value.column == '*'){
							   console.log(value.table+"."+value.column+" property found");
							   return
						   }
					   }
				   }
				   
				   for(var i in t_aliases){
					   if(value.table == t_aliases[i].alias){
						   if(t_aliases[i].table == clause_name && clause_att.indexOf(value.column) != -1){
							   console.log(value.table+"."+value.column+" property found");
							   return;
						   }
						   for(var j in db){
							   if(db[j].table == t_aliases[i].table && db[j].column.indexOf(value.column) != -1){
								   console.log(value.table+"."+value.column+" property found");
								   return
							   }
						   }
					   }
				   }

				   console.log(value.table+"."+value.column+" NOT found");
				   result.bool = false;
				   result.err = value.table+"."+value.column+" not found in database, aliases: "+aliases;
				   return;
				}
					   
				else if(value.hasOwnProperty('table')){
				   for(var j = 0; j < db.length; j++){
					   if(value.table == db[j].table || aliases.indexOf(value.table) != -1 || value.table == clause_name){
						  console.log(value.table+" property found");
						  return;
					   };
				   }
				   console.log(value.table+" NOT found");
				   result.bool = false;
				   result.err = "Table "+value.table+" not found in database";
				   return;
				}
				
				else if(value.hasOwnProperty('column')){
					if(value.column == '*'){
						console.log(value.column+" property found");
						return;
					}
					for(var k = 0; k < db.length; k++){
						   if(db[k].column.indexOf(value.column) != -1 || aliases.indexOf(value.column) != -1){
							  console.log(value.column+" property found");
							  return;
						   }
					}
					console.log(value.column+" NOT found");
					result.bool = false;
					result.err = "Column "+value.column+" not found in database, aliases: "+aliases;
					return;
				}
			
			}

			//with-specific semantic
			function process_with(key,value){
				if(value == null) return;
				if(value.hasOwnProperty('outer_query')){ //check correct reference
					var ref = value.outer_query.select_cores[0].from[0].table;
					if(ref == clause_name){
						console.log(ref+" correct clause name");
					}
					else{
						console.log(ref+" is NOT the correct clause name");
						result.bool = false;
						result.err = "Clause reference "+ref+" does not match its definition "+clause_name;
						return;
					}
				}
			
				//TODO improvable
				if(value.hasOwnProperty('query_def')){//check number of attributes
					var q = value.query_def.select_cores;
					for(i in q){
						var res = q[i].results;

						//special case 'select * from xy'
						if(res.length == 1 && res[0].hasOwnProperty('column') && res[0].column == '*'){
								
							var table = q[i].from[0].table;
							for(j in db){
								if(db[j].table == table){
									if(db[j].column.length == clause_att.length){
										console.log("Correct number of attributes");
									}
									else{
										result.bool = false;
										result.err = "Clause definition and query definition have different number of attributes";
										return;
									}
								}
							}
						}
						
						else{
							var count = 0;
							for(j in res){
								if(res[j].hasOwnProperty('column') && res[j].column == '*'){
									var t = res[j].table;
									for(var k in t_aliases){
										if(t_aliases[k].alias == t){
											t = t_aliases[k].table;
										}
									}
									for(var k in db){
										if(db[k].table == t){
											count += db[k].column.length;
										}
									}
								}
								else{
									count++;
								}
							}
							
							if(count == clause_att.length){
								console.log("Correct number of attributes");
							}
							else{
								result.bool = false;
								result.err = "Clause definition and query definition have different number of attributes";
								return;
							}
						}
						
						
						
					}
				}
			}
			
			/*
			 * checklist:
			 * 		1. with-clause
			 * 		2. query definition has compound operator (union all!)
			 * 		3. 2nd part has join
			 * 		4. 2nd part has recursive reference
			 * 		5. outer query selects with-clause
			 */
			function checkIfRecursion(o){
				$scope.withSuccess = false;
				
				//1. actual with-clause
				if(!o.hasOwnProperty("clause_name")){
					$scope.nonRecursiveReason = "No With-Clause";
					return;
				}

				//2. contains union all
				if(o.query_def.select_cores.length < 2){
					$scope.nonRecursiveReason = "No Compound-Operator (Union All)";
					return;
				}
				
				var compound = o.query_def.select_cores[1];
				if(!(compound.hasOwnProperty("compound_operator") && compound.compound_operator.trim().toLowerCase() == "union all")){
					$scope.nonRecursiveReason = "No Compound-Operator (Union All)";
					return;
				}
				
				//3. 2nd part has join
				var ref = o.query_def.select_cores[1].from;
				var join = false;
				for(var i in ref){
					if(ref[i].hasOwnProperty("join_constraint")){
						if(ref[i].join_constraint != null){
							join = true;
							break;
						}
					}
				}
				
				if(!join){
					$scope.nonRecursiveReason = "No Join in 2nd part of inner query";
					return;
				}
				
				//4. 2nd part has recursive reference
				var clause = o.clause_name;
				var recRef = false;
				for(var i in ref){
					if(ref[i].hasOwnProperty("table") && ref[i].table == clause){
						recRef = true;
						break;
					}
				}
				
				if(!recRef){
					$scope.nonRecursiveReason = "No recursive reference to With-Clause";
					return;
				}
				
				//5. outer query selects with-clause at least once
				var outerFrom = o.outer_query.select_cores[0].from;
				var withRef = false;
				for(var i in outerFrom){
					if(outerFrom[i].hasOwnProperty("table") && outerFrom[i].table == clause){
						withRef = true;
					}
				}

				if(!withRef){
					$scope.nonRecursiveReason = "Outer query does not select With-Clause";
					return;
				}
				
				
				$scope.withSuccess = true;
			}
			
			function traverse(o,func) {

			    for (var i in o) {			   
			    	func.apply(this,[i,o[i]]);
			        if (o[i] !== null && typeof(o[i])=="object") {
			            //going on step down in the object tree
			            traverse(o[i],func);
			        }
			    }
			}
			
			function getAliases(o) {
				for (var i in o) {
					if(o[i] == null) return;
					if(o[i].hasOwnProperty("alias")){
						aliases.push(o[i].alias);
						if(o[i].hasOwnProperty("table")){
							t_aliases.push({table:o[i].table, alias:o[i].alias});
						}
						
					}
					
			        if (o[i] !== null && typeof(o[i])=="object") {
			            //going on step down in the object tree
			            getAliases(o[i]);
			        }
			    }
			}
			
			getAliases(parsed);
			traverse(parsed,process);
			traverse(parsed,process_with);
			checkIfRecursion(parsed[0]);
			console.log(result);
			return result;
		};
		
		
		$scope.submitQuery = function(){
			var sql = $scope.parsed;
			$scope.result = sql;

			$scope.$emit('execQueryEmit', [sql,$scope.withSuccess,$scope.recSteps]);
		};
		
		
	});
	
	/*
	 * Controller for databases
	 */
	app.controller('dbController', function($scope, $rootScope) {
		loadLocalData();
		$scope.db;
		$scope.flugdb = 
			{
				"flug": [
					{"abflug":"VIE", "ankunft":"FRA", "id":0},
					{"abflug":"FRA", "ankunft":"LHR", "id":1},
					{"abflug":"VIE", "ankunft":"BUD", "id":2},
					{"abflug":"VIE", "ankunft":"VCE", "id":3},
					{"abflug":"VCE", "ankunft":"FCO", "id":4},
					{"abflug":"VIE", "ankunft":"ZRH", "id":5},
					{"abflug":"ZRH", "ankunft":"CDG", "id":6},
					{"abflug":"CDG", "ankunft":"MAD", "id":7},
					//{"abflug":"CDG", "ankunft":"FRA", "id":8},
					{"abflug":"MAD", "ankunft":"LIS", "id":9}
				],
		
				"flughafen": [
					{"standort":"Wien", "land":"Österreich", "iata":"VIE", "id":0},
					{"standort":"Frankfurt", "land":"Deutschland", "iata":"FRA", "id":1},
					{"standort":"London", "land":"England", "iata":"LHR", "id":2},
					{"standort":"Budapest", "land":"Ungarn", "iata":"BUD", "id":3},
					{"standort":"Venedig", "land":"Italien", "iata":"VCE", "id":4},
					{"standort":"Rom", "land":"Italien", "iata":"FCO", "id":5},
					{"standort":"Zürich", "land":"Schweiz", "iata":"ZRH", "id":6},
					{"standort":"Paris", "land":"Frankreich", "iata":"CDG", "id":7},
					{"standort":"Madrid", "land":"Spanien", "iata":"MAD", "id":8},
					{"standort":"Lissabon", "land":"Portugal", "iata":"LIS", "id":9}
				]
			};
		
		$scope.db = $scope.flugdb;
		$scope.tables = Object.keys($scope.db);
		
		$scope.columns = [];
		for(var i in $scope.tables){
			$scope.columns.push(Object.keys($scope.db[$scope.tables[i]][0]));
		}
		
	
		
		//transforms json data into a more "practical" array for printing with angular
		/*
		 * 'printable' array has the following parts:
		 * 		printable.head contains name of all tables
		 * 		printable.col contains name of all columns for each table
		 * 		printable.data contains data of each table
		 */
		
		
		$scope.printable = [];
		
		for(var i in $scope.tables){
			var obj = {};
			obj.head = $scope.tables[i];
			obj.col = $scope.columns[i];

			var data = [];
			for(var j in $scope.db[$scope.tables[i]]){
				var row = [];
				for( var k in $scope.columns[i]){
					row[k] = $scope.db[$scope.tables[i]][j][$scope.columns[i][k]]
					//console.log($scope.db[$scope.tables[i]][j][$scope.columns[i][k]]);
				}
				data.push(row);
			};
		
			obj.data = data;
			
			$scope.printable.push(obj);
		};
	  
		
		
		//console.log($scope.printable);
	
		var details = [];
			
		for(var i in $scope.tables){
			var obj = {};
			obj.table = $scope.tables[i];
			obj.column = $scope.columns[i];
		
			details.push(obj);
		};
		
		
		$rootScope.dbDetails = details;
		
		$scope.formatInfo = {};
		$scope.stepCount = 0;
		$scope.formatCount = 0;
		$scope.format = "init";
		$scope.finalResult = false;
		
		
		$scope.nextStep = function(){
			$scope.removeStyle();
			
			if($scope.formatCount%2 == 0){
				$scope.stepCount += 1;
				$scope.highlightNew();
				$scope.formatCount += 1;
			}
			else{
				$scope.formatCount += 1;
				$scope.highlightJoin();
			}
			
		};
		
		$scope.previousStep = function(){
			$scope.removeStyle();
			
			if($scope.stepCount == 1 && $scope.formatCount == 1){
				$scope.stepCount = $scope.formatCount = 0;
				$scope.removeStyle();
				return;
			}
			
			if($scope.formatCount%2 == 1){
				$scope.stepCount -= 1;
				$scope.highlightJoin();
				$scope.formatCount -= 1;
			}
			else{
				$scope.formatCount -= 1;
				$scope.highlightNew();
			}
			
		};
		
		$scope.showFullResult = function(){
			$scope.removeStyle();
			$scope.stepCount = $scope.fullData.length;
			$scope.formatCount = $scope.fullData.length*2-1;
		};
		
		$scope.highlightJoin = function(){
			$("#thRec"+$scope.formatInfo.columnRecIndex).addClass('danger');
			$(".tdRec"+$scope.formatInfo.columnRecIndex).addClass('danger');
			$("#thJoin"+$scope.formatInfo.columnJoinIndex).addClass('danger');
			$(".tdJoin"+$scope.formatInfo.columnJoinIndex).addClass('danger');
		}
		
		$scope.highlightNew = function(){
			$("#step"+($scope.stepCount-1)+">tr").addClass('success');
		};
		
		$scope.removeStyle = function(){
			$("#step"+($scope.stepCount-1)+">tr").removeClass('success');
			$("#thRec"+$scope.formatInfo.columnRecIndex).removeClass('danger');
			$(".tdRec"+$scope.formatInfo.columnRecIndex).removeClass('danger');
			$("#thJoin"+$scope.formatInfo.columnJoinIndex).removeClass('danger');
			$(".tdJoin"+$scope.formatInfo.columnJoinIndex).removeClass('danger');
		};
		
		$scope.$on('execQueryBroadcast', function(event, data) {
			console.log("received in dbCtrl:"+JSON.stringify(data));
			var query = "";
			var withSuccess = data[1];
			var args = data[0];
			var recSteps = data[2];
			
			
			//indicates with-clause
			if(args[0].hasOwnProperty("clause_name")){
				var clause = args[0]["clause_name"];
				var att = args[0]["clause_att"];
				query = args[0]["query_def"];
				var outer = args[0]["outer_query"];
				
				if(Object.keys($scope.db).indexOf(clause) >= 0 ){
					delete $scope.db[clause];
					console.log("RECREL\n"+JSON.stringify($scope.db));
				}
				
				
				query = addWithAlias(query, att);
				
				if(withSuccess){ //recursive
					$scope.header = [];
					$scope.initData = [];
					$scope.initEmpty = "";
					$scope.stepData = [];
					$scope.fullData = [];
					$scope.currentStep = 0;
					$scope.fullResult = false;
					$scope.maxStep = recSteps;
					$scope.stepCount = 0;
					$scope.formatCount = 0;
					$scope.format = "init";
					$scope.formatInfo = {};
					
					
					$rootScope.withStep = true; //starts step-by-step solution
					
					//1: init step, so its result is already available
					var init = JSON.parse(JSON.stringify(query)); //copy
					var sc = query.select_cores.slice();
					init.select_cores = [sc[0]];
					console.log("INIT\n"+JSON.stringify(init));
					
					var initQuery = $scope.processSql([init]);
					console.log("INITQUERY\n"+JSON.stringify(initQuery));
					
					var initResult = SQLike.q(initQuery);
					
					if(initResult.length == 0){
						$scope.initEmpty = true;
						result = {};
						return;
					}
					else{
						$scope.db[clause] = initResult;
						$scope.header = Object.keys(initResult[0]);
						$scope.initData = initResult;
						$scope.fullData.push(initResult);
					}
					
					
					
					//2. some preparations for step-case
					var step = JSON.parse(JSON.stringify(query));
					delete sc[1].compound_operator;
					step.select_cores = [sc[1]];
					step = addWithAlias(step, att);
					
					console.log("INIT\n"+JSON.stringify(initResult));
					
					var stepQuery, stepResult, unionResult, stepSize = 0;

					//3. actual loop for 'recursion'
					for(var i = 1; ; i++){
						stepQuery = $scope.processSql([step]);
						stepResult = SQLike.q(stepQuery);

						//checks if the last step added something to the result
						if(stepSize == stepResult.length){
							$scope.maxStep = stepSize;
							console.log("NO CHANGE AT STEP "+i);
							break;
						}
						
						//stores the rows added to the result (for step-by-step solution)
						var temp = [];
						for(var j = stepSize; j < stepResult.length; j++){
							temp.push(stepResult[j]);
						}
						$scope.stepData.push(temp);
						$scope.fullData.push(temp);
						stepSize = stepResult.length;
						
						unionResult = SQLike.q({UnionAll: [initQuery,stepQuery]});
						$scope.db[clause] = unionResult;
						//console.log("STEPQUERY\n"+JSON.stringify(stepQuery));
						//console.log("STEP"+i+"\n"+JSON.stringify(stepResult));
						//console.log("UNIONRESULT"+i+"\n"+JSON.stringify($scope.db[clause]));
					}
					//console.log("STEPDATA\n"+JSON.stringify($scope.stepData));
				}
				
				else{//non-recursive with
					var withQuery = $scope.processSql([query]);
					var withResult = SQLike.q(withQuery);
					$scope.db[clause] = withResult;
				}
				
				query = $scope.processSql([outer]);
				
				//get format information for step-by-step solution
				/*
				 *	name of table.column of recursive join (just to write down)
				 *	column index of above columns in respective table (highlighting)
				 *	join constraint and operator (just in case)
				 */
				
				var j1 = step.select_cores[0].from[0];
				var j2 = step.select_cores[0].from[1];
				
				var t1 = t1a = t2 = t2a = "";
				if(j1.table == clause){ //t1 is the recursive table
					t1 = j1.table;
					t2 = j2.table;
					if(j1.hasOwnProperty("alias")){
						t1a = j1.alias;
					}
					if(j2.hasOwnProperty("alias")){
						t2a = j2.alias;
					}
				}
				else{
					t1 = j2.table;
					t2 = j1.table;
					if(j1.hasOwnProperty("alias")){
						t2a = j1.alias;
					}
					if(j2.hasOwnProperty("alias")){
						t1a = j2.alias;
					}
				}
				
				var jc = j2.join_constraint;
				var c1 = c2 = op = constraint = "";
				if(jc.length == 2){//ON
					var joinc;
					if(jc[1].length == 3){//without brackets
						joinc = jc[1];
					}
					else{ //with brackets
						joinc = jc[1][2];
					}
					
					op = joinc[1];
					
					if(joinc[0].table === t1 || joinc[0].table === t1a){
						c1 = joinc[0].column;
						c2 = joinc[2].column;
					}
					else{
						c1 = joinc[2].column;
						c2 = joinc[0].column;
					}
					
					constraint = "ON";
				}
				
				else{//USING
					c1 = c2 = jc[3][1];
					op = "=";
					constraint = "USING";
				}
				
				
				$scope.formatInfo.tableRec = $scope.db[t1];
				$scope.formatInfo.tableRecName = t1;
				$scope.formatInfo.tableRecA = t1a;
				$scope.formatInfo.columnRec = c1;
				$scope.formatInfo.tableJoin = $scope.db[t2];
				$scope.formatInfo.tableJoinName = t2;
				$scope.formatInfo.tableJoinA = t2a;
				$scope.formatInfo.columnJoin = c2;
				$scope.formatInfo.constraint = constraint;
				$scope.formatInfo.op = op;
				$scope.formatInfo.columnRecIndex = Object.keys($scope.db[t1][0]).indexOf(c1);
				$scope.formatInfo.columnJoinIndex = Object.keys($scope.db[t2][0]).indexOf(c2);
				
			}
			
			else{ //normal select
				query = $scope.processSql(args);
			}
			
			/* some test queries
			query = {};
			query.Select = ['f_abflug', function(){return this.f_ankunft;}, '|as|', 'destination', 'f_id'];
			query.From = {};
			query.From['f'] = $scope.db['flug'];
			query.Where = function(){return this.f.id>3;};
			*/
			/*
			
			query1 = {};
			query1.Select = ['abflug', '|count|', 'abflug', '|sum|', 'id'];
			query1.From = $scope.db['flug'];
			query1.Where = function(){return true;}; 
			query1.GroupBy = ['abflug'];
			query1.Having = function(){return this.count_abflug > 1;};
			
			query2 = {};
			query2.Select = ['flug_abflug', '|count|', 'flug_abflug', '|sum|', 'flug_id'	];
			query2.From = {};
			query2.From['flug'] = $scope.db['flug'];
			query2.Where = function(){return true;};
			query2.GroupBy = ['flug_abflug'];
			query2.Having = function(){return this.count_flug_abflug > 1;};
			
			*/
			/*
			query4 = {};
			query4.Select = ["hallo",'flug_abflug'];
			query4.From = {};
			query4.From['flug'] = $scope.db['flug'];
			query4.Where = function(){return true;};
			
			*/
			/*
			query5 = {};
			query5.Select = [function(){return this.abflug+" "+this.ankunft},'|as|','name'];
       		query5.From = {};
       		query5.From = $scope.db['flug'];
       
			query = query5;
			*/
			
			//alert("final query: \n\n"+JSON.stringify(query));
			console.log('%c final query: %c'+JSON.stringify(query),'color: green; background: orange', 'color:green');
			var result = SQLike.q(query);
			//alert("final result: \n\n"+JSON.stringify(result));
			console.log('%c final result: %c'+JSON.stringify(result), 'color: green; background: orange', 'color:green');
			
			
			
			if(result.length == 0){
				$rootScope.finalEmpty = true;
			}
			else{
				$rootScope.finalEmpty = false;
				$rootScope.finalHeader = Object.keys(result[0]);
				$rootScope.finalData = result;
			}
			
		});
		
		//adds alias to columns to match clause-definition
		//TODO simple implementation -> needs improvement (more cases)
		//does not work with something like 'select a.*, b.column from...'
		function addWithAlias(query, att){
			var select = query.select_cores[0].results;
			
			//special case 'select * from xy'
			if(select.length == 1 && select[0].hasOwnProperty("column") && select[0].column == '*'){
				select.shift(); //remove 'select *'
				
				var tab = query.select_cores[0].from[0].table;
				var aliasTable = "";
				if(query.select_cores[0].from[0].hasOwnProperty("alias")){
					aliasTable = query.select_cores[0].from[0].alias;
				}
				else{
					aliasTable = tab;
				}

				var count = 0;
				for(var i in $scope.db[tab][0]){
					var col = {};
					col.table = aliasTable;
					col.column = i;
					col.alias = att[count];
					select.push(col);
					count++;
				}
			}
			
			//simple case with every column listed (no '*')
			else{
				for(var i in select){
					select[i].alias = att[i];
				}
			}
			return query;
		}
		
		
		/*
		 * https://msdn.microsoft.com/en-us/library/ms189499.aspx
		 * Logical Processing Order of the SELECT statement
		 * 1. FROM
		 * 2. ON
		 * 3. JOIN
		 * 4. WHERE
		 * 5. GROUP BY
		 * 6. WITH CUBE or WITH ROLLUP
		 * 7. HAVING
		 * 8. SELECT
		 * 9. DISTINCT
		 * 10. ORDER BY
		 * 11. TOP
		 * 
		 */
		$scope.processSql = function(sql){
			var db = $scope.db;
			console.log("PROCESS\n"+JSON.stringify(sql));
			//compound operator
			if(sql[0]['select_cores'].length > 1){
				var compoundTables = [];
				
				for(var j in sql[0]['select_cores']){
					var singleSQL = JSON.parse(JSON.stringify(sql)); //copy original object, avoid referencing it
					
					singleSQL[0]['select_cores'] = [];
					singleSQL[0]['select_cores'].push(sql[0]['select_cores'][j]);
					
					compoundTables.push($scope.processSql(singleSQL));
					
					if(singleSQL[0]['select_cores'][0].hasOwnProperty('compound_operator')){
						compoundTables.push(singleSQL[0]['select_cores'][0]['compound_operator']);
					}
				}
				
				var first = compoundTables.shift();
				var query = compoundQuery(first,compoundTables);
				return query;
				
			}
			
			//SFW-statement from parser
			var dbselect = sql[0]['select_cores'][0];
			var keys = Object.keys(sql[0]['select_cores'][0]);
			
			//other keywords for query
			var dbkeys = Object.keys(sql[0]);
			
			//console.log("keys: "+keys);
			//console.log("dbkeys: "+dbkeys);
			//console.log(JSON.stringify(sql[0]['select_cores']));
			/*
			var query = {
					Select: ['*'],
					From: db['flug'],
					Where: function(){return this.abflug=="VIE";}
			};
			*/
			
			return querySQL(db,dbselect,keys,dbkeys,sql);
			
			
		};
		
		function compoundQuery(first,q){
			if(q.length == 0){
				return first;
			}
			
			if(typeof q[1] === 'string' || q[1] instanceof String){
				var compoundOp = getCompoundOp(q[1]);
				var query = {};
				query[compoundOp] = [];
				query[compoundOp].push(first);
				query[compoundOp].push(q[0]);
//				var query = {Union:[
//				                    {Select:['*'],
//				                    	From:$scope.db['flug'],
//				                    	Where:function(){return this.id==5;}},
//				                    {Union:[{Select:['*'],
//				                    		From:$scope.db['flug'],
//				                    		Where:function(){return this.id==3;}},
//				                    		{Select:['*'],
//				                    		From:$scope.db['flug'],
//				                    		Where:function(){return this.id==4;}}]}]};
				
				q.splice(0,2); //remove first 2 elements of query to continue

				return compoundQuery(query,q);
			}	
			
		}
		
		//returns correct name for query
		function getCompoundOp(op){
			switch(op.toLowerCase().trim()){
			case "union":
				return "Union";
				break;
				
			case "union all":
				return "UnionAll";
				break;
				
			case "intersect":
				return "Intersect";
				break;
				
			case "intersect all":
				return "IntersectAll";
				break;
				
			case "except":
				return "Except";
				break;
				
			case "except all":
				return "ExceptAll";
				break;
			
			};
		};
		
		function querySQL(db,dbselect,keys,dbkeys,sql){
			var query = {};
			
			//go through keywords and process them
			for(var i in keys){
				switch(keys[i]){
				case "results":
					var col = [];
					var c = "";
					for(var j in dbselect[keys[i]]){
//						if(dbselect[keys[i]][j]['column'] == '*'){
//							console.log("column: "+dbselect[keys[i]][j]['column']);
//							col.push(dbselect[keys[i]][j]['column']);
//							continue;
//						}
						
						if(dbselect[keys[i]][j].hasOwnProperty("func")){
							var f = dbselect[keys[i]][j].func.toLowerCase();
							var att = dbselect[keys[i]][j].att;
							
							for(var k in att){
								if(att[k] != null && att[k] instanceof Object){
									var temp = att[k].table+"_"+att[k].column;
									att[k] = temp;
								}
							}

							col.push('|'+f+'|');
							col.push(att);
							
							if(dbselect[keys[i]][j].hasOwnProperty("alias")){
								var a = dbselect[keys[i]][j].alias;
								col.push('|as|');
								col.push(a);
							}
						}
						
						if(dbselect[keys[i]][j].hasOwnProperty("numeric")){
							var n = flatten(dbselect[keys[i]][j].numeric);
							
							for(var k in n){
								if(n[k] == null){
									n.splice(k,1);
								}
								if(n[k] != null && n[k] instanceof Object){
									var temp = n[k].table+"_"+n[k].column;
									n[k] = temp;
								}
								
							}
							console.log(n);
							
							col.push('|calc|');
							col.push(n);
							
							if(dbselect[keys[i]][j].hasOwnProperty("alias")){
								var a = dbselect[keys[i]][j].alias;
								col.push('|as|');
								col.push(a);
							}
						}
						
						if(dbselect[keys[i]][j].hasOwnProperty("string")){
							var s = dbselect[keys[i]][j].string;
							col.push('|concat|');
							col.push([s]);
							
							if(dbselect[keys[i]][j].hasOwnProperty("alias")){
								var a = dbselect[keys[i]][j].alias;
								col.push('|as|');
								col.push(a);
							}
						}
						
						if(dbselect[keys[i]][j].hasOwnProperty("column")){
							c = dbselect[keys[i]][j].column;
						}
						
						if(dbselect[keys[i]][j].hasOwnProperty("agg")){
							var agg = dbselect[keys[i]][j].agg;
							col.push('|'+agg+'|');
						}
						
						if(dbselect[keys[i]][j].hasOwnProperty("table")){
							var t = dbselect[keys[i]][j].table;
							if(c == '*'){
								cols = Object.keys(db[t][0]); //get all columns of specific table
								for(var k in cols){
									col.push(t+"_"+cols[k]);
								}
								continue;
							}
							
							else{
								col.push(t+"_"+c);
							}
							
							if(dbselect[keys[i]][j].hasOwnProperty("alias")){
								var a = dbselect[keys[i]][j].alias;
								col.push('|as|');
								col.push(a);
							}
						}
						if(dbselect[keys[i]][j].hasOwnProperty("column") && !dbselect[keys[i]][j].hasOwnProperty("table")){
							if(c == '*'){
								col.push(c);
							}
							else{
								alert("select error");
							}
						}
					}
				
					
					//console.log(col);
					
					if(keys[i*1+1] == "distinct"){//casting i to int before
						query.SelectDistinct = col;
					}
					else{
						query.Select = col;
					}
					
					//i'm not sure why this is necessary, but it works...
					if(keys.indexOf("where") == -1){
						query.Where = new Function("return true;");
					}
					
					break;
				
				
				case "from":
					var dbfrom = dbselect[keys[i]].slice(); //copy of array, no reference!
					var t1 = db[dbfrom[0]['table']];
					var t1Name = dbfrom[0]['table'];
					var t1Alias = "";
					
					//just replace with alias-table
					if(dbselect[keys[i]][0].hasOwnProperty("alias")){
						t1Alias = dbselect[keys[i]][0].alias;
						db[t1Alias] = db[t1Name];
						t1 = db[t1Alias];
						t1Name = t1Alias;
						
					}
					
					//single table
					if(dbselect[keys[i]].length == 1){
						query.From = {};
						query.From[t1Name] = t1;
						//query.From = t1;
					}
					
					//multiple tables (join)
					else{
						dbfrom.shift(); //remove first element (saved in var t1)
						//console.log(JSON.stringify(dbfrom));
						
						var t2 = "";
						var t2Name = "";
						var t2Alias = "";
						var joinop = "";
						
					
						
						//only one join
						if(dbfrom.length == 1){
							var joinC = dbfrom[0]['join_constraint'];
							//console.log(JSON.stringify(joinC));
							
							t2 = db[dbfrom[0]['table']];
							t2Name = dbfrom[0]['table'];
							joinop = dbfrom[0]['join_op'];
							
							//just replace with alias-table
							if(dbfrom[0].hasOwnProperty("alias")){
								t2Alias = dbfrom[0].alias;
								db[t2Alias] = db[t2Name];
								t2 = db[t2Alias];
								t2Name = t2Alias;
								
							}
							
							query.From = {};
							query.From[t1Name] = t1;
							//join implicit (where condition)
							if(joinC == null){
								query = getJoin(joinop,query,t2,t2Name);
								
								//apparently sqlike cant process multiple tables without a where
								//...or i'm just unable to make it work
								if(keys.indexOf("where") == -1){
									query.Where = new Function("return true;");
								}
							}
							
							//join with using
							else if(joinC[0][1].trim().toLowerCase() == "using"){
								var use = fixJoinParse(joinC[3]);
								query = getJoin(joinop,query,t2,t2Name);
								query.Using = use;
							}
							
							//join with on
							else if(joinC[0][1].trim().toLowerCase() == "on"){
								if(joinC[1].length == 3){//without brackets
									//console.log("join on: "+JSON.stringify(joinC[1]));
									var onFunc = buildSQLWhereFunction(joinC[1],"");
									query = getJoin(joinop,query,t2,t2Name);
									query.On = new Function("return "+onFunc);
								}
								else if(joinC[1].length == 5){//with brackets
									//console.log("join on: "+JSON.stringify(joinC[1][2]));
									var onFunc = buildSQLWhereFunction(joinC[1][2],"");
									query = getJoin(joinop,query,t2,t2Name);
									query.On = new Function("return "+onFunc);	
								}
								else{
									console.log("join on error");
								}
							}
						}
						else{
							//TODO multiple joins
						}
					}
					break;
					
					
					
				//pattern: [column, =<>AND/OR... , literal/column]
				//multiple: [column, =<>AND/OR..., [pattern]]	
				case "where":
					//console.log("first where "+JSON.stringify(dbselect[keys[i]]));

					var whereFunc = buildSQLWhereFunction(dbselect[keys[i]],"");
					//console.log(whereFunc);

					//query.Where = new Function("return /^V.*$/.test('V%')");
					query.Where = new Function("return "+whereFunc);
					
					break;
				
				//also contains 'having'
				case "group_by":
					//0: 'group', 1: 'by', 2: first table.column, 3: other table.column, 4: 'having'
					var gp = dbselect[keys[i]];
					
					var col = [];
					
					//first column
					var c1 = gp[2][1][0].column;
					if(gp[2][1][0].hasOwnProperty("table")){
						var t = gp[2][1][0].table;
						col.push(t+'_'+c1);
					}
					else{
						col.push(c1);
					}
					

					//other columns
					for(var i in gp[3]){
						var c = gp[3][i][2][1][0].column;
						
						if(gp[3][i][2][1][0].hasOwnProperty("table")){
							var t = gp[3][i][2][1][0].table;
							col.push(t+"_"+c);
						}
						else{
							col.push(c);
						}
					}
					
					
					//console.log("group by: "+col);
					query.GroupBy = col;
					
					var having = gp[4];
					if(having != null){
						var t = "",c,l,op,agg = "";
						c = having[1][0].column;
						l = having[1][2].literal;
						op = having[1][1];
						
						if(having[1][0].hasOwnProperty("table")){
							t = having[1][0].table+'_';
						}
						if(having[1][0].hasOwnProperty("agg")){
							agg = having[1][0].agg+'_';
						}
						
						var havingFunc = agg+t+c+op+l;
					//	console.log("having: "+havingFunc);
						query.Having = new Function("return this."+havingFunc);
					}
					
					
					break;
				}
				
				
			}
			
			for(var i in dbkeys){
				switch(dbkeys[i]){
					
				case "order_by":
					var order = sql[0][dbkeys[i]];
					order = flatten(order);
					orderBy = [];
					
					for(var j in order){
						if(order[j] == null){
							continue;
						}

						if(order[j] != null && order[j] instanceof Object){
							orderBy.push(order[j]['table']+'_'+order[j]['column']);
						}
						else if(order[j].toLowerCase() == "asc"){
							orderBy.push("|asc|");
						}
						else if(order[j].toLowerCase() == "desc"){
							orderBy.push("|desc|");
						}
					}
					console.log("ordering: "+orderBy);
					query.OrderBy = orderBy;
					break;
					
				case "limit":
					query.Limit = sql[0][dbkeys[i]][1]['literal'];
					break;
				}
			}
			
			//console.log(query);
			//console.log(JSON.stringify(query));
			

			return query;
		}
		
		function isJSON(data){
			try { JSON.parse(data); return true;}
			catch(e) {return false;}
		}
		
		//parsing of on/using for joins is somewhat strange
		function fixJoinParse(o){
			o = flatten(o);
			for(var i in o){
				if(o[i] == ','){
					o.splice(i,1);
				}
			}
			return o;
		};
		
		//fix possible differences between sql(ike) and javascript, or just make it lowercase
		var fixOperator = function(op){
			var o = "";
			
			if(op instanceof Array){
				o = op[1];
			}
			else{
				o = op;
			}


			switch(o.toLowerCase().trim()){ 
			case '=':
				return '==';
				break;
				
			case 'and':
				return '&&';
				break;
				
			case 'or':
				return '||';
				break;
				
			case 'like':
				return 'like';
				break;
				
			case 'between':
				return 'between';
				break;
				
			case 'in':
				return 'in';
				break;
			}
			
			
			return op;
		};
		
		//create sql-like regular expression for wildcards
		RegExp.like = function (text) { 
			return new RegExp("^"+(RegExp.escape(text).replace(/%/g, ".*").replace(/_/g, "."))+"$"); 
		};
		
		function getRegExp(pattern){
			var lit = pattern.slice(); //copy (just in case)
			lit = lit.slice(1,-1);  //get rid of quotes
			
			return RegExp.like(lit);
		}
		
		//assigns the join operation to the correct variable
		function getJoin(op,query,t2,t2Name){

			if(op == "JOIN"){ //implicit join (with where condition)
				query.From[t2Name] = t2;
				return query;
			}
			
			switch(op.toLowerCase().trim()){
			case "join":
				query.Join = {};
				query.Join[t2Name] = t2;
				break;
				
			case "natural join": 
				query.NaturalJoin = {};
				query.NaturalJoin[t2Name] = t2;
				break;
				
			case "left join":
			case "left outer join":
				query.LeftJoin = {};
				query.LeftJoin[t2Name] = t2;
				break;
				
			//right (outer) join currently not in parser	
			case "right join":
			case "right outer join":
				query.RightJoin = {};
				query.RightJoin[t2Name] = t2;
				break;
			
		
			//full (outer) join currently not in parser	
			case "full join":
			case "full outer join":
				query.FullJoin = {};
				query.FullJoin[t2Name] = t2;
				break;
			
			case "cross join":
				query.CrossJoin = {};
				query.CrossJoin[t2Name] = t2;
				break;
			}
			
			return query;
		};
		
		
		//extracts literal and formats literal of query
		var getLiteral = function(o){
			var literal;

			//string
			if(o['literal'].length == 3){
				literal = o['literal'][1];
				literal = literal.join("");
				literal = "'"+literal+"'";
			}
			else{ //number
				literal = o['literal'];
			}
			
			return literal;
		};
		
		//recursively constructs 'where' function of query
		//assumption: multiple conditions are combined with AND, OR
		var buildSQLWhereFunction = function(o,q){
			var query = q;
			var not = false;
			var inBool = false;
			console.log(JSON.stringify(o));
			//indexes of simple case
			var indexV1 = 0;
			var indexV2 = 2;
			var indexV3 = null; //only needed for 'between'
			var indexOp = 1;
						
			//where x NOT IN (...)
			if(o.length == 4){
				if(o[1] != null){
					not = true;
				}
				
				inBool = true;
				indexOp = 2;
				indexV2 = 3;
				
//				var temp = o[indexV2][1];
//				o[indexV2] = temp;
			}
			
			//where x NOT LIKE "..."
			else if(o.length == 5){
				not = true;
				indexOp = 2;
				indexV2 = 3;
			}
			
			//where x (NOT) BETWEEN ... AND ...
			else if(o.length == 6){
				if(o[1] != null){
					not = true;
				}
				
				indexOp = 2;
				indexV2 = 3;
				indexV3 = 5;
			}
			
			//multiple where conditions/operators
			if(o[indexV2] instanceof Array && !inBool){
				var table = "";
				var table2 = "";
				var col = "";
				var col2 = "";
				var literal = "";
				console.log(JSON.stringify(o[indexOp]));
				console.log(JSON.stringify(o[indexV2][1]));
				var op = fixOperator(o[indexOp]);
				var op2 = fixOperator(o[indexV2][1]);
				
				if(o[indexV1].hasOwnProperty("column") && o[indexV2].hasOwnProperty("column")){
					col = o[indexV1]['column'];
					if(o[indexV1].hasOwnProperty("table")){
						table = o[indexV1]['table']+".";
					}
					
					col2 = o[indexV2]['column'];
					if(o[2].hasOwnProperty("table")){
						table2 = o[indexV2]['table']+".";
					}
					
				}
				
				if(o[indexV1].hasOwnProperty("column")){
					col = o[indexV1]['column'];
					literal = getLiteral(o[indexV2][0]);
					if(literal instanceof Array){
						literal = flatten(literal).join("");
					}
					if(o[indexV1].hasOwnProperty("table")){
						table = o[indexV1]['table']+".";
					}
				}
				
				else if(o[indexV1].hasOwnProperty("literal")){
					literal = getLiteral(o[indexV1]);
					if(literal instanceof Array){
						literal = flatten(literal).join("");
					}
					col = o[indexV2][0]['column'];
					if(o[indexV2].hasOwnProperty("table")){
						table = o[indexV2]['table']+".";
					}
				}
				
				
				if(col2 != ""){
					query += "this."+table+col+op+"this."+table2+col2+" "+op2;
				}
				else{
					if(op == 'like'){
						var regex = getRegExp(literal);
						//console.log("like regex: "+regex);
						
						if(not){
							query += '!'+regex+'.test(this.'+table+col+') '+op2;
						}
						else{
							query += regex+'.test(this.'+table+col+') '+op2;
						}		
					}
					
					else if(op == 'between'){
						var literal2 = getLiteral(o[indexV3]);
						if(literal2 instanceof Array){
							literal2 = flatten(literal).join("");
						}
						if(not){
							query += "!(this."+table+col+">"+literal+" && this."+table+col+"<"+literal2+") "+op2;
						}
						else{
							query += "this."+table+col+">"+literal+" && this."+table+col+"<"+literal2+" "+op2;
						}
					}
					
					else{
						query += "this."+table+col+op+literal+" "+op2;
					}
					
				}

				//console.log("query1: "+query);
				return buildSQLWhereFunction(o[indexV2][2],query);
				
				
			}
			
			else if(inBool){
				var col = o[indexV1]['column'];
				var table = "";
				
				if(o[indexV1].hasOwnProperty("table")){
					table = o[indexV1]['table']+".";
				}
				
				var inValues = [];
				var arr = flatten(o[3][1]);

				for(var i in arr){
					if(arr[i].hasOwnProperty("literal")){
						inValues.push(getLiteral(arr[i]));
					}
				}
			//	console.log("in values: "+inValues);
				var inValuesString = inValues.toString();
				
				alert(JSON.parse("[" + inValuesString + "]"));
				query += "alert(JSON.parse('['"+inValuesString+"']'.indexOf(this."+table+col+") != -1)";
				return query;
			}
			
			//simple case, one where condition, both sides are columns
			else if(o[indexV1].hasOwnProperty("column") && o[indexV2].hasOwnProperty("column")){
				var col = o[indexV1]['column'];
				var col2 = o[indexV2]['column'];
				var table = "";
				var table2 = "";
				
				if(o[indexV1].hasOwnProperty("table")){
					table = o[indexV1]['table']+".";
				}
				
				if(o[indexV2].hasOwnProperty("table")){
					table2 = o[indexV2]['table']+".";
				}
				
				var op = fixOperator(o[indexOp]);
				
				query += "this."+table+col+op+"this."+table2+col2;
			//	console.log("query2.5: "+query);
				
				return query;
			}
			
			//covers simple case with only one where-condition/operator
			else if(o[indexV2].hasOwnProperty("literal")){
				var literal = getLiteral(o[indexV2]);
				if(literal instanceof Array){
					literal = flatten(literal).join("");
				}
				
				var col = o[indexV1]['column'];
				var table = "";
				
				if(o[indexV1].hasOwnProperty("table")){
					table = o[indexV1]['table']+".";
				}
				
				var op = "";
				
				if(o[indexOp] instanceof Array){
					
					op = fixOperator(flatten(o[indexOp]));
				}
				else{
					op = fixOperator(o[indexOp]);
				}

				
				if(op == 'like'){
					var regex = getRegExp(literal);
				//	console.log("like regex: "+regex);
					
					if(not){
						query += '!'+regex+'.test(this.'+table+col+')';
					}
					else{
						query += regex+'.test(this.'+table+col+')';
					}
					
				}
				
				else if(op == 'in'){
					
				}
				
				else if(op == 'between'){
					var literal2 = getLiteral(o[indexV3]);
					if(literal2 instanceof Array){
						literal2 = flatten(literal).join("");
					}
					if(not){
						query += "!(this."+table+col+">"+literal+" && this."+table+col+"<"+literal2+")";
					}
					else{
						query += "this."+table+col+">"+literal+" && this."+table+col+"<"+literal2;
					}
				}
				
				else{
					console.log("table "+table);
					console.log("col "+col);
					console.log("op "+op);
					console.log("lit "+literal);
					
					query += "this."+table+col+op+literal;
				}
				
				
				console.log("query2: "+query);
				return query;
			}
			
			//simple case again, just with literal and column in reverse order
			else if(o[indexV1].hasOwnProperty("literal")){
				var literal = getLiteral(o[indexV1]);
				if(literal instanceof Array){
					literal = flatten(literal).join("");
				}
				var table = o[indexV2]['table']+".";
				var col = o[indexV2]['column'];
				var op = fixOperator(o[indexOp]);
				
//				console.log(col);
//				console.log(op);
//				console.log(literal);
//				console.log(col+op+literal);
				
				if(op == 'like'){
					var regex = RegExp.like(lit);
				//	console.log("like regex: "+regex);
					
					if(not){
						query += '!'+regex+'.test(this.'+table+col+')';
					}
					else{
						query += regex+'.test(this.'+table+col+')';
					}
					
				}
				
				else if(op == 'between'){
					var literal2 = getLiteral(o[indexV3]);
					if(not){
						query += "!(this."+table+col+">"+literal+" && this."+table+col+"<"+literal2+")";
					}
					else{
						query += "this."+table+col+">"+literal+" && this."+table+col+"<"+literal2;
					}
				}
				
				else{
					query += "this."+table+col+op+literal;
				}
				//console.log("query3: "+query);
				return query;
			}	
		};
		
		function flatten(arr) {
			  return arr.reduce(function (flat, toFlatten) {
			    return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
			  }, []);
			}
		
		
		// locally stored and predefined (csv-)files
		this.files = [ {
			dest : 'data/stueckliste.csv',
			description : 'Stueckliste (VO-Slides)',
			name : 'stueckliste'
		}, {
			dest : 'data/flights_simple.csv',
			description : 'Flights (simple)',
			name : 'flights_simple'
		}, {
			dest : 'data/gisttest.txt',
			description : 'gist format test',
			name : 'test'
		} ];

		// display of dropdown-button
		this.button = "Select Database";

		// selected db
		this.selected = "";
		
		
		this.loadGist = function(){
			alert("todo");
		};
		
		
		function loadLocalData(){
			$.get('data/local_data.txt', function(data) {
				var parsed = $scope.gistparser.parse(data);
				alert(JSON.stringify(parsed));
			});
		}
		
		
		
	});

	/*
	 * Custom directive for database selection
	 */
	app.directive('selectDatabase', function() {
		return {
			restrict : 'E',
			templateUrl : "select-database.html"
		};
	});

	/*
	 * Custom directive for db-display
	 */
	app.directive('displayDatabase', function() {
		return {
			restrict : 'E',
			templateUrl : "display-database.html"
		};
	});

	/*
	 * Custom directive for input form
	 */
	app.directive('inputForm', function() {
		return {
			restrict : 'E',
			templateUrl : "input-form.html"
		};
	});
	
	app.directive('displaySolution', function() {
		return {
			restrict : 'E',
			templateUrl : "display-solution.html"
		};
	});

})();