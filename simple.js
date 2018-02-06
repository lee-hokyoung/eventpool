var util = require('util');
var _url = require('url');
var querystring = require("querystring");
var $parseUrlVal = function($val){
	$parsed = _url.parse($val);
	if($parsed.protocol && $parsed.slashes && $parsed.path){
		return "<a href='"+$val+"' target='_blank'>"+$val+"</a>";
	}else{
		return $val;
	}
}
module.exports = function($scope,phone,$notFound){
	$ontology = _url.parse($scope.ontology['@id']);
	$notFound = !!$notFound;
	var filterUrl = $scope.filterUrl;
	var filterName = $scope.filterName;
	var filterAttrName = $scope.filterAttrName;
	var parseDesc = $scope.parseDesc;
	if($notFound){
			$page = '<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en"><head><title>Resource not found</title><meta charset="utf-8"><base href="http://' + $ontology.host +'/">';
			$page += '<link rel="stylesheet" type="text/css" href="static/css/simple.css" /></head><body>';
			$page += '<div id="header"><div><h1 id="title">Resource not found!</h1>';
			$page += '<h2>Please check the requested URI/URL</h2>';
			$page += '<div id="footer"><br/><br/>Powered by <a href="http://linkeddata.snu.ac.kr/">서울대학교 차세대융합기술연구원 Linked Data연구 센터</a> System using nodejs</div></body></html>'
		return $page;
	}



var $imgPropertyName = $scope.fromOntology('그림') ? ($scope.fromOntology('그림'))['@id'] : '그림';
var $YouTubePropertyName = $scope.fromOntology('Youtube') ? ($scope.fromOntology('Youtube'))['@id'] : 'Youtube';
var $wikiPropertyName = $scope.fromOntology('wiki') ? ($scope.fromOntology('wiki'))['@id'] : 'wiki';
$page = '';
$render = {};
for (var $attr in phone) {
	if($attr[0] == '@' && $attr != '@incoming'){
		continue;
	}
	$value = phone[$attr];
	switch($attr){
		case "@incoming":
			var $c = 0;
			var $r =
			'<td class="property">' +
			'<span><a href="'+$scope.filterUrl($attr,1)+'">' +filterAttrName($attr)+ '</a></span></td><td>';
			$value.forEach(function($val){
				if($val['@rewritten']) return;
				$c++;
				$r += "<li>";
				$r += '<a href="' +filterUrl($val['@from'],1)+ '">' +filterName($val['@from'])+ '</a> (' + filterAttrName('@as') + ' <a href="' +filterUrl($val['@property'],1)+ '">' +filterName($val['@property'])+ '</a>)<br/>';
				$r += "</li>";
			});
			$r += '</ul></li></td>';
			$render[$attr] = $c > 0 ? $r : '';
		break;
		default:
			var $numbered = false;
			if($value['@list']){
				$value = $value['@list'];
				$numbered = true;
			}
			if($value['http://www.w3.org/2002/07/owl#unionOf']){
				$value = $value['http://www.w3.org/2002/07/owl#unionOf']['@list'];
				$numbered = true;	
			}
			var $r =
			'<td class="property">' +
			'<span><a href="'+$scope.filterUrl($attr,1)+'">' +filterAttrName($attr)+ '<!--'+$attr+'--!></a></td><td>'+
			($numbered ? '<ul class="numberedList">' : '<ul>');
			
			if(util.isArray($value)){
				$value.forEach(function($val){
					$r += "<li>";
					if($val['@id']){
						$r += '<a href="' +filterUrl($val['@id'],1)+ '">' +filterName($val['@id'])+ '</a>';
					}else{
						$r += $parseUrlVal($val['@value'] != undefined ? $val['@value'] : $val)+ '';
						if($val['@language']){
							$r += '<code>' +$val['@language']+ '</code>';
						}
					}
					$r += "</li>";
				});
			}else{
				var $val = $value;
				$r += "<li>";
				if($val['@id']){
					$r += '<a href="' +filterUrl($val['@id'],1)+ '">' +filterName($val['@id'])+ '</a>';
				}else{
					$r += $parseUrlVal($val['@value'] != undefined ? $val['@value'] : $val)+ '';
					if($val['@language']){
						$r += '<code>' +$val['@language']+ '</code>';
					}
				}
				$r += "</li>";
			}
			$r += '</ul></li></td>';
			$render[$attr] = $r;
		break;
			 
	}
	
};
	
	$page = '<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en"><head><title>'+ $scope.filterName(phone['@id'],1) +'</title><meta charset="utf-8"><base href="http://' + $ontology.host +'/">';
	$query = {query:"DESCRIBE <" + phone['@id'] +">"};
	$rdfURI = "sparql?" + querystring.stringify($query);
	$page += '<link rel="alternate" type="application/rdf+xml" href="'+ $rdfURI +'&output=xml" title="RDF" /><link rel="stylesheet" type="text/css" href="static/css/simple.css" /></head><body>'
	
	$page += '<div id="header"><div><a href="'+ phone['@id'] +'"><h1 id="title">'+ $scope.filterName(phone['@id'],1) +'</h1></a><div id="homelink"> &nbsp;at <a href="http://' + $ontology.host +'/">' + $ontology.host +'</a></div></div><div id="rdficon"><a href="'+ $rdfURI +'&output=xml" title="RDF data"><img src="static/img/rdf-icon.gif" alt="[This page as RDF]" /></a></div></div>';
	
	$page += '<table class="description"><tr><th width="25%">Property</th><th>Value</th></tr>';
	
	var odd = true;
	for($attr in $render){
		if(!$render[$attr]){
			continue;
		}
		$page += odd ? '<tr class="odd">' : '<tr class="even">';
		$page += $render[$attr];
		$page += '</tr>' 
		odd = !odd;
	}
	
	$page += '</table>';
	
	$page += '<div id="footer">This page shows information obtained from the SPARQL endpoint at <a class="sparql-uri" href="http://' + $ontology.host +'/sparql">http://' + $ontology.host +'/sparql</a>.<br />';
	$page += '<a href="'+ $rdfURI +'&output=ttl">As Turtle</a> | <a href="'+ $rdfURI +'&output=xml">As RDF/XML</a> | <a href="'+ $rdfURI +'&output=nt">As nTriples</a> | <a href="'+ $rdfURI +'&output=json">As JSON</a>';
	$page += '<br/><br/>Powered by <a href="http://linkeddata.snu.ac.kr/">서울대학교 차세대융합기술연구원 Linked Data연구 센터</a> System using nodejs</div></body></html>';
	
	return $page;
	
}