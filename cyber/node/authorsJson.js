var util = require('util');
var cache = false;
module.exports = function($scope,$req){
	var objs = [];
	if(!$req.body["CSRF"])
		return JSON.stringify([]);
	if(cache){
		objs = cache;
	}else{
		$scope.classes['http://library.k-history.kr/resource/저작자'].objs.forEach(function(obj){
				if(obj['http://library.k-history.kr/resource/그림'] && obj['http://purl.org/dc/elements/1.1/description']){
					var desc = util.isArray(obj['http://purl.org/dc/elements/1.1/description']) ? obj['http://purl.org/dc/elements/1.1/description'][0]['@value'] : obj['http://purl.org/dc/elements/1.1/description']['@value'];
					objs.push({
							"name": $scope.filterName(obj["@id"]),
							"desc": desc,
							"pic": util.isArray(obj['http://library.k-history.kr/resource/그림']) ? obj['http://library.k-history.kr/resource/그림'][0]["@value"] : obj['http://library.k-history.kr/resource/그림']["@value"],
							"dbid": obj["@id"]
						});
				}
		});
		cache = objs;
	}
	return JSON.stringify(objs)
}