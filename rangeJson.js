var util = require('util');
module.exports = function($scope,$req){
		var objs = {};
		if($req.body["property"]){
			var props;
			if($req.body["property"].lastIndexOf("||") == -1){
				props = [$req.body["property"]];
			}else{
				props = $req.body["property"].split("||");
			}
			for(var i in props){
				var prop = $scope.objs[props[i]];
				if(!prop) continue;
				var cl = prop['http://www.w3.org/2000/01/rdf-schema#range']["@id"];
				if($scope.classes[cl]){
					$scope.classes[cl].objs.forEach(function(obj){
						var label = $scope.filterName(obj["@id"]);
						if(!objs[label]) {
							objs[label] = [];
						}
						if(objs[label].lastIndexOf(obj["@id"]) == -1){
							objs[label].push(obj["@id"]);
						}
					});
				}
			}

		}
		return JSON.stringify(objs)
}