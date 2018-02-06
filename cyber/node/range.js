var $firstLetterHangeul = function(c){
	var JLT=["ㄱ","ㄲ","ㄴ","ㄷ","ㄸ","ㄹ","ㅁ","ㅂ","ㅃ","ㅅ","ㅆ","ㅇ","ㅈ","ㅉ","ㅊ","ㅋ","ㅌ","ㅍ","ㅎ"]
	var SBase=0xAC00;
	var SCount=11172;
	var TCount=28;
	var NCount=588;
	var SIndex = c.charCodeAt(0) - SBase;
	if(0> SIndex || SIndex >= SCount)
		return c.charAt(0).toUpperCase();
	return JLT[Math.floor(SIndex / NCount)];
}
var util = require('util');
var cache = {};
module.exports = function($scope,$req){
	var objs = [];
	if(!$req.body["CSRF"] || !$req.body["className"])
		return JSON.stringify([]);
	var className = '' + $req.body["className"];
	if(!$scope.fromOntology(className)){
		return JSON.stringify([]);
	}
	if(cache[className]){
		objs = cache[className];
	}else{
		var classObjs = $scope.objsForType($scope.fromOntology(className)['@id']);
		
		var $imgPropertyName = $scope.fromOntology('그림') ? ($scope.fromOntology('그림'))['@id'] : '그림';
		classObjs.forEach(function(obj){
				if(obj[$imgPropertyName] && obj['http://purl.org/dc/elements/1.1/description']){
					var desc = util.isArray(obj['http://purl.org/dc/elements/1.1/description']) ? obj['http://purl.org/dc/elements/1.1/description'][0]['@value'] : obj['http://purl.org/dc/elements/1.1/description']['@value'];
					objs.push({
							"name": $scope.filterName(obj["@id"]),
							"@firstLetter": $firstLetterHangeul($scope.filterName(obj["@id"])),
							"desc": desc,
							"pic": util.isArray(obj[$imgPropertyName]) ? obj[$imgPropertyName][0]["@value"] : obj[$imgPropertyName]["@value"],
							"dbid": obj["@id"]
						});
				}
		});
		cache[className] = objs;
	}
	objs.sort(function(a, b) {
		return a['name'].localeCompare(b['name']);
	});
	return JSON.stringify(objs);
}