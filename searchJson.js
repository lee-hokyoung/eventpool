var util = require('util');
module.exports = function($scope,$filter,$req){
		var objs = [];
		if($req.body["query"]){
			var objs2 = $filter($scope.facetObjs['http://www.w3.org/2002/07/owl#Thing'],{"@searchable":$req.body["query"]});
			for(var i = 0; i < objs2.length && i < 10; i++){
				objs.push({ "@id":objs2[i]['@id'],
							"@type": $scope.filterName(util.isArray(objs2[i]['@type']) ? objs2[i]['@type'][0] : objs2[i]['@type'] ),
							"value": $scope.filterName(objs2[i]['@id']),
							"label": $scope.filterName(objs2[i]['@id']) + " (" + $scope.filterName(util.isArray(objs2[i]['@type']) ? objs2[i]['@type'][0] : objs2[i]['@type'] ) +")"
						 });
			}
		}
		return JSON.stringify(objs);
}