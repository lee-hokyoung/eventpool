var util = require('util');
var _url = require('url');
var $parseUrlVal = function($val){
	$parsed = _url.parse($val);
	if($parsed.protocol && $parsed.slashes && $parsed.path){
		return "<a href='"+$val+"' target='_blank'>"+$val+"</a>";
	}else{
		return $val;
	}
}
module.exports = function($scope,phone,$notFound){
	$notFound = !!$notFound;
	var filterUrl = $scope.filterUrl;
	var filterName = $scope.filterName;
	var filterAttrName = $scope.filterAttrName;
	var parseDesc = $scope.parseDesc;
	if($notFound){
		$page = '<div id="content" style="padding-left: 10px; padding-right: 10px;">' +
			'<h1>Resource not found!</h1>' +
			'<h6>' +
			'Please check the requested URI/URL.' +
			'</h6>';
			$page += 
			'<a href="javascript:" onclick="history.go(-1)">&lt; Back</a>' +
			'<div id="push"></div>' +
			'</div> <!-- /#content -->';
		return $page;
	}



var $imgPropertyName = $scope.fromOntology('그림') ? ($scope.fromOntology('그림'))['@id'] : '그림';
var $YouTubePropertyName = $scope.fromOntology('Youtube') ? ($scope.fromOntology('Youtube'))['@id'] : 'Youtube';
var $wikiPropertyName = $scope.fromOntology('wiki') ? ($scope.fromOntology('wiki'))['@id'] : 'wiki';
var $lifeYearsPropertyName = $scope.fromOntology('생몰년') ? ($scope.fromOntology('생몰년'))['@id'] : '생몰년';

var $audioPlayerPropertyName = $scope.fromOntology('발음') ? ($scope.fromOntology('발음'))['@id'] : '발음';

var $picturesInBottomPropertyName = $scope.fromOntology('pictures_in_bottom') ? ($scope.fromOntology('pictures_in_bottom'))['@id'] : 'pictures_in_bottom';


$page = '<div id="content" class="facetInner" style="padding-left: 10px; padding-right: 10px;">';
$render = {};
$LiIndex = 0;
for (var $attr in phone) {
	if($attr[0] == '@' && $attr != '@incoming'){
		continue;
	}
	$value = phone[$attr];
	switch($attr){
		case $picturesInBottomPropertyName:
			if(!util.isArray($value)){
				$value = [phone[$attr]];
			}
			$render[$attr] = '<li>' +
			'<div>';
			for($key in $value){
				$render[$attr] += '<a href="'+ $value[$key]['@value'] +'"><img src="' +$value[$key]['@value']+ '" rel="noreferrer" class="phoneBot "></a>';
			}
			$render[$attr] += '</div>';
			$render[$attr] += '</li>';
		break;
		case $imgPropertyName:
			var imId = 0;
			if(!util.isArray($value)){
				$value = [phone[$attr]];
			}
			$render[$attr] = '<li>' +
			'<div class="phone-images" >';
			for($key in $value){
				$render[$attr] += '<a target="_blank" href="'+ $value[$key]['@value'] +'"><img src="' +$value[$key]['@value']+ '" id="img'+ (++imId) +'" rel="noreferrer" class="phone'+ (imId==1 ? ' active' : '') +'"></a>';
			}
			$render[$attr] += '</div>';/* +
			'<ul class="phone-thumbs" style="clear: both;">';
			imId = 0;
			for($key in $value){
				$render[$attr] += '<li><img src="' +$value[$key]['@value']+ '" rel="noreferrer" onclick="setImg(' + (++imId) + ')"></li>';
			}
			
			$render[$attr] += '</ul>';
			*/
			$render[$attr] += '</li>';
		break;
		case "http://www.w3.org/2003/01/geo/wgs84_pos#lat_long":
			$render[$attr] = '<script>';
			if(util.isArray($value)){
				$value.forEach(function(latLng){
					var arr = latLng['@value'].match(/([0-9]+\.[0-9]+)/g);
					$render[$attr] += 'GoogleMapsLocations.push([' + arr.join(",") + ']);';
				});
			}else{
				var arr = $value['@value'].match(/([0-9]+\.[0-9]+)/g);
				$render[$attr] += 'GoogleMapsLocations.push([' + arr.join(",") + ']);';
			}
			$render[$attr] += '</script>' +
			//'<li>' +
			'<div id="GoogleMapsCanvas" style="width: 100%; height: 500px;"></div>'
			/*
'<span>' + filterAttrName($attr) + '</span>'+
			'<ul>' +
			parseDesc($value) +
			'</ul>'+
*/
			//'</li>';
		break;
		case "http://purl.org/dc/elements/1.1/description":
			$render[$attr] = '<span class="innerDesc">' +
			parseDesc($value) +
			'</span><br/><br/>';
			;
		break;
		case $audioPlayerPropertyName:
			$render[$attr] = 
			'<span class="audioContainer"><audio loop><source src="'+ ($value['@value'] ? $value['@value'] : $value)+'" type="audio/mpeg">Your browser does not support the audio element.</audio><a class="playPauseAudio" href="javascript:"><i class="fa fa-play"></i></a></span>';
		break;
		case $YouTubePropertyName:
			$render[$attr] = 
			'<li>' +
			'<span>' + filterAttrName($attr) + '</span>'+
			'<ul><iframe width="448" height="252" src="//www.youtube.com/embed/'+ ($value['@value'] ? $value['@value'] : $value)+'" frameborder="0" allowfullscreen></iframe></ul>'+
			'</li>';
		break;
		case "@incoming":
			var $c = 0;
			var $r =
			'<li>' +
			'<span>' +filterAttrName($attr)+ '</span><ul>';
			$value.forEach(function($val){
				if($val['@rewritten']) return;
				$c++;
				$r += "<li>";
				$r += '<dd><a href="' +filterUrl($val['@from'])+ '">' +filterName($val['@from'])+ '</a> (' + filterAttrName('@as') + ' <a href="' +filterUrl($val['@property'])+ '">' +filterName($val['@property'])+ '</a>)<br/></dd>';
				$r += "</li>";
			});
			$r += '</ul></li>';
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
			'<li>' +
			'<span>' +filterAttrName($attr)+ '<!--'+$attr+'--!></span>'+
			($numbered ? '<ul class="numberedList">' : '<ul>');
			
			if(util.isArray($value)){
				var j = 0;
				var thisIdx = $LiIndex++;
				$value.forEach(function($val){
					$r += j < 15 ? "<li>" : "<li class='hiddenLi"+thisIdx+"' style='display: none;'>";
					j++;
					if($val['@id']){
						$r += '<dd><a href="' +filterUrl($val['@id'])+ '">' +filterName($val['@id'])+ '</a></dd>';
					}else{
						$r +='<dd>' +$parseUrlVal($val['@value'] != undefined ? $val['@value'] : $val)+ '';
						if($val['@language']){
							$r += '<code>' +$val['@language']+ '</code>';
						}
						$r += '</dd>';
					}
					$r += "</li>";
				});
				if(j > 15){
						$r += "<li><a href='javascript:' onclick='$(\".hiddenLi"+thisIdx+"\").toggle(); this.innerHTML = (this.innerHTML == \"&laquo;Show more&raquo;\") ? \"&laquo;Hide&raquo;\" : \"&laquo;Show more&raquo;\";'>&laquo;Show more&raquo;</a></li>";
				}
			}else{
				var $val = $value;
				$r += "<li>";
				if($val['@id']){
					$r += '<dd><a href="' +filterUrl($val['@id'])+ '">' +filterName($val['@id'])+ '</a></dd>';
				}else{
					$r +='<dd>' + $parseUrlVal($val['@value'] != undefined ? $val['@value'] : $val)+ '';
					if($val['@language']){
						$r += '<code>' +$val['@language']+ '</code>';
					}
					$r += '</dd>';
				}
				$r += "</li>";
			}
			$r += '</ul></li>';
			$render[$attr] = $r;
		break;
			 
	}
	
};

$OC = $scope.fromOntology("OrderedCollection");

$page +='<div class="row">' +
'<div class="col-md-12">'

	$page += '<code class="simpleHref"><a href="' + $scope.filterUrl(phone['@id'],1) + '">Linked Data로 보기</a></code>' +
			 '<h1>'
			 
	
	if($render[$audioPlayerPropertyName]){
		$page += $render[$audioPlayerPropertyName];
		delete $render[$audioPlayerPropertyName];
	}
	
	$page += $scope.filterName(phone['@id'],1);
	
	if(phone[$lifeYearsPropertyName]){
		$page += '<span class="life_years">(' + (phone[$lifeYearsPropertyName]['@value'] != undefined ? phone[$lifeYearsPropertyName]['@value'] : phone[$lifeYearsPropertyName])  + ')</span>';
	}
	
	$page +='</h1>' +
			'<h6>' +
			'Instance of: ';
if(util.isArray(phone['@type'])){
	phone['@type'].forEach(function(ofClass){
		$page += '<code><a href="' +filterUrl(ofClass)+ '">' +filterName(ofClass)+ '</a></code>&nbsp;';
	});
}else if(typeof phone['@type'] == 'string'){
	$page += '<code><a href="' + filterUrl(phone['@type']) + '">' +filterName(phone['@type'])+ '</a></code>'
}else{
	console.log("ERROR ON",phone['@id']);
}
$page += '</h6>';



$page +=
'</div><!--/col-md-12--></div>' +
'<div class="row content-row"><div class="col-md-3">' +
'<ul style="list-style: none;">';

//TODO Left Renderizer

if($imgPropertyName && $render[$imgPropertyName]){
	$page += $render[$imgPropertyName];
	delete $render[$imgPropertyName];
}

$page +=    '</ul>' +
			'</div><!-- /.col-md-3 -->' +
			'<div class="col-md-9">';



$Ann = $scope.fromOntology("displayOnAnnotation");
if($OC[$Ann["@id"]]){
	$page += 	'<ul class="property">';
	var list = $OC[$Ann["@id"]]["@list"];
	for($attr in list){
		if($render[list[$attr]["@id"]]){
			$page += $render[list[$attr]["@id"]];
			delete $render[list[$attr]["@id"]];
		}
	}
	$page += 	'</ul>';
}
$page += "<hr />"

$TopRight = $scope.fromOntology("displayOnTop");
if($OC[$TopRight["@id"]]){
	$page += 	'<ul class="property">';
	var list = $OC[$TopRight["@id"]]["@list"];
	for($attr in list){
		if($render[list[$attr]["@id"]]){
			$page += $render[list[$attr]["@id"]];
			delete $render[list[$attr]["@id"]];
		}
	}
	$page += 	'</ul>';
}	

$page += "<hr />"

$Middle = $scope.fromOntology("displayOnMiddle");
if($OC[$Middle["@id"]]){
	var list = $OC[$Middle["@id"]]["@list"];
	var $paget = '';
	for($attr in list){
		if($render[list[$attr]["@id"]]){
			$paget += $render[list[$attr]["@id"]];
			delete $render[list[$attr]["@id"]];
		}
	}
	if($paget){
		$page += 	'<p style="font-size:2em; font-weight:bold; margin:-5px 0px;">연관정보</p><ul class="property">';
		$page += $paget;
		$page += 	'</ul>';
		$page += "<hr />"
	}
}



$Bottom = $scope.fromOntology("displayOnBottom");
if($OC[$Bottom["@id"]]){
	
	var list = $OC[$Bottom["@id"]]["@list"];
	var $paget = '';
	for($attr in list){
		if($render[list[$attr]["@id"]]){
			$paget += $render[list[$attr]["@id"]];
			delete $render[list[$attr]["@id"]];
		}
	}
	if($paget){
		$page += 	'<p style="font-size:2em; font-weight:bold; margin:-5px 0px;">Related Information</p><ul class="property">';
		$page += $paget;
		$page += 	'</ul>';
	}
}

$page +=    '</div><!-- /.col-md-9 -->' +
			'<div class="col-md-12">';
			
if($render["http://www.w3.org/2003/01/geo/wgs84_pos#lat_long"]){
	$page += $render["http://www.w3.org/2003/01/geo/wgs84_pos#lat_long"];
	delete $render["http://www.w3.org/2003/01/geo/wgs84_pos#lat_long"];
}


$paget = '';
for($attr in $render){
	$paget += $render[$attr];
}
if($paget){
	$page += 	'<ul class="dottedBottom dottedTop property">' + $paget;
}else{
	$page += 	'<ul class="dottedBottom">';
}
$page += 	'</ul>';


$page +=    '</div><!-- /.col-md-12 -->' +
			'</div><!-- /.row -->';





/*

'</ul>' +
'	  </div>' +
'<div class="container-fluid">' +
'	  <div class="row">' +
'	  <div class="col-md-4">' +
'	  <ul style="list-style: none;">' +
'  <li ng-repeat="(attr,value) in specs" ng-if="filterName(attr) == '그림'">' +
'  	<div ng-switch="filterName(attr)" style="clear:both;">' +
'  		<div ng-switch-when="그림">' +
'		    <div class="phone-images" >' +
'		    <img ng-if="!isArr(value)" ng-src="' +value['@value']+ '" rel="noreferrer" class='phone' ng-class="{active: mainImageUrl==obj['@value'] || (!ImageSet && $index == 0)}">' +
'		    <img ng-repeat="obj in value" ng-if="isArr(value)" ng-src="' +obj['@value']+ '" class='phone' ng-class="{active: mainImageUrl==obj['@value'] || (!ImageSet && $index == 0)}">' +
'		    </div>' +
'		    <ul ng-if="isArr(value)" class="phone-thumbs" style="clear: both;">' +
'			  <li ng-repeat="obj in value">' +
'			    <img ng-src="' +obj[\'@value\']+ '" ng-click="setImage(obj[\'@value\'])">' +
'			  </li>' +
'			</ul>	' +
'	  	</div>' +
'  	</div>' +
'  </li>' +
'</ul>' +
'	  </div>' +
'	  <div class="col-md-8">' +
'	  <ul>' +
'  <li ng-repeat="(attr,value) in specs" ng-if="filterName(attr) != '그림' && attr != 'http://www.w3.org/2004/02/skos/core#hiddenLabel'">' +
'  	<div ng-switch="filterName(attr)" style="clear:both;">' +
'	  	<div ng-switch-when="http://www.w3.org/2003/01/geo/wgs84_pos#lat_long">' +
'		    <span>' +filterAttrName(attr)+ '</span>' +
'		    <!-- [if !IE] -->' +
'		    <google-map ng-if="!isArr(value)" center="generateLatLng(value)" zoom="mapZoom" mark-click="true" draggable="true" style="width:400px;">' +
'					<marker coords="generateLatLng(value,1)">' +
'						<marker-label ng-if="LatLngHasLabel(false,0)" anchor='22 0' content='LatLngLabel(false,0)'>' +
'						</marker-label>' +
'					</marker>' +
'			</google-map>' +
'			<google-map ng-if="isArr(value)" center="generateLatLng(value[0])" zoom="mapZoom" mark-click="true" draggable="true" style="width:400px;">' +
'					<marker ng-repeat="coords in value" coords="generateLatLng(coords,$index+1)">' +
'						<window coords="generateLatLng(coords,$index+1)">' +
'                    <a href="' +LatLngUrl(value,$index)+ '">' +LatLngLabel(value,$index)+ '</a>' +
'						<br />' +
'            </window>' +
'					</marker>' +
'					' +
'			</google-map>' +
'			<!-- [endif] -->' +
'	  	</div>' +
'	  	<div ng-switch-when="http://purl.org/dc/elements/1.1/description">' +
'		    <span>' +filterAttrName(attr)+ '</span>' +
'			<ul>' +
'				<li ng-bind-html="parseDesc(value)">' +
'				</li>' +
'			</ul>' +
'	  	</div>' +
'	  	<div ng-switch-when="wiki">' +
'		    <span>' +filterAttrName(attr)+ '</span>' +
'			<ul>' +
'				<dd ng-if="value['@id']"><a href="' +filterUrl(value['@id'])+ '">' +filterName(value['@id'])+ '</a></dd>' +
'				    <dd ng-if="!value['@id']">' +
'				    <a href="' +value['@value'] ? value['@value'] : value+ '">' +value['@value'] ? value['@value'] : value+ '</a>' +
'				    <code ng-if="value['@language']">' +value['@language']+ '</code>' +
'				</dd>' +
'			</ul>' +
'	  	</div>' +
'	  	<div ng-switch-when="YouTube">' +
'		    <span>' +filterAttrName(attr)+ '</span>' +
'			<ul>' +
'				<youtube code="value['@value'] ? value['@value'] : value"></youtube>' +
'			</ul>' +
'	  	</div>' +
'	  	<div ng-switch-default>' +
'		    <span>' +filterAttrName(attr)+ '</span>' +
'		    <ul ng-class="{numberedList: (attr == 'http://www.w3.org/2004/02/skos/core#memberList')}">' +
'			    <li ng-if='!isArr(value) && !isArr(value["@list"])'>' +
'				    <dd ng-if="value['@id']"><a href="' +filterUrl(value['@id'])+ '">' +filterName(value['@id'])+ '</a></dd>' +
'				    <dd ng-if="!value['@id']">' +
'				    ' +value['@value'] ? value['@value'] : value+ '' +
'				    <code ng-if="value['@language']">' +value['@language']+ '</code>' +
'				    </dd>' +
'			    </li>' +
'			    <li ng-if='!isArr(value) && isArr(value["@list"])'ng-repeat="valueIn in value['@list']">' +
'				    <dd ng-if="valueIn['@id']"><a href="' +filterUrl(valueIn['@id'])+ '">' +filterName(valueIn['@id'])+ '</a></dd>' +
'				    <dd ng-if="!valueIn['@id']">' +
'				    ' +valueIn['@value'] ? valueIn['@value'] : valueIn+ '' +
'				    <code ng-if="valueIn['@language']">' +valueIn['@language']+ '</code>' +
'				    </dd>' +
'' +
'			    </li>' +
'			    <li ng-if='isArr(value)' ng-repeat="valueIn in value">' +
'				    <dd ng-if="valueIn['@id']"><a href="' +filterUrl(valueIn['@id'])+ '">' +filterName(valueIn['@id'])+ '</a></dd>' +
'				    <dd ng-if="!valueIn['@id']">' +
'				    ' +valueIn['@value'] ? valueIn['@value'] : valueIn+ '' +
'				    <code ng-if="valueIn['@language']">' +valueIn['@language']+ '</code>' +
'				    </dd>' +
'			    </li>' +
'		    </ul>' +
'	  	</div>' +
'  	</div>' +
'  </li>' +
'</ul>' +
'	  </div>' +
'	  </div>' +
'</div>' +
'</div>' +
*/
$page += 
//'<a href="javascript:" onclick="history.go(-1)">&lt; Back</a>' +
'<div id="push"></div>' +
'</div> <!-- /#content -->'+
'</div> <!-- /#section -->';

	return $page;
	
}
