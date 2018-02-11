var util = require('util');
var cache = false;
module.exports = function($scope,$req){
	var objs = [];
	if(!$req.body["CSRF"])
		return JSON.stringify([]);
	if(cache){
		objs = cache;
	}else{
		$scope.classes['http://library.k-history.kr/resource/저작'].objs.forEach(function(obj){
				if(obj['http://library.k-history.kr/resource/그림'] && obj['http://purl.org/dc/elements/1.1/description'] && obj['http://library.k-history.kr/resource/저작_초판발표년도']){
					if(parseInt($scope.toOntology(util.isArray(obj['http://library.k-history.kr/resource/저작_초판발표년도']) ? obj['http://library.k-history.kr/resource/저작_초판발표년도'][0]['@id'] : obj['http://library.k-history.kr/resource/저작_초판발표년도']['@id']).substr(1,4))){
						objs.push({
							"name": $scope.filterName(obj["@id"]),
							"year": $scope.toOntology(util.isArray(obj['http://library.k-history.kr/resource/저작_초판발표년도']) ? obj['http://library.k-history.kr/resource/저작_초판발표년도'][0]['@id'] : obj['http://library.k-history.kr/resource/저작_초판발표년도']['@id']).substr(1,4),
							"desc": obj['http://purl.org/dc/elements/1.1/description']['@value'],
							"pic": util.isArray(obj['http://library.k-history.kr/resource/그림']) ? obj['http://library.k-history.kr/resource/그림'][0]["@value"] : obj['http://library.k-history.kr/resource/그림']["@value"],
							"dbid": obj["@id"]
						});
					}
				}
		});
		cache = objs;
	}
	return JSON.stringify(objs)
}