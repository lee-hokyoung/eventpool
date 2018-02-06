var util = require('util');
module.exports = function($scope,$filter,$restrictions,$menu){
	$page = '<div id="section" class="facets">';
	if(!$restrictions){
		$restrictions = {};
	}
	var classFiltered = $scope.classes;
	if($restrictions['class']){
		classFiltered = {};
		var addSubclasses = function(cl){
			if(cl.subclassesCnt > 0){
				cl.subclasses.forEach(function(cl2){
					addSubclasses(cl.subclasses[cl2]);	
				});
			}
			classFiltered[cl.spec['@id']] = cl;
		};
		addSubclasses($scope.classes[$restrictions['class']['@id']]);
	}
	var filteredCount = {};
	var filteredObjs = {};
	if($restrictions['filters']){
		//console.log($restrictions);
		for (var type in classFiltered){
			filteredObjs[type] = $scope.classes[type].objs.filter(function(obj){
					if(typeof obj != "object")
						return false;
					var good = true;
					for(var property in $restrictions['filters']){
						if(property == "@searchable"){
							var oFil = $filter([obj],{"@searchable": $restrictions['filters']["@searchable"]});
							good = oFil.length > 0;
							if(!good) break;
						}else{
							var lprop = property.split("||");
							var lgood = false;
							for(var p in lprop){
								if(!obj[lprop[p]]) continue;
								var lvals = obj[lprop[p]];
								if(!util.isArray(lvals)){
									lvals = [lvals];
								}
								var rvals = $restrictions['filters'][property].split("||");
								for(var r in rvals){
									for (var s in lvals){
										if(lvals[s]["@id"] == rvals[r]){
											lgood = true;
											break;
										}
									}
									if(lgood) break;	
								}
								if(lgood) break;
							}
							good = lgood;
							if(!good) break;
						}
					}
					if(good){
						var cls = obj["@type"];
						if(!util.isArray(cls)) cls = [cls];
						var alreadyCnt = {};
						cls.forEach(function(type){
							var currClass = $scope.classes[type];
							while(currClass && currClass.spec){
								if(alreadyCnt[currClass.spec["@id"]]) break;
								alreadyCnt[currClass.spec["@id"]] = true;
								if(filteredCount[currClass.spec["@id"]]){
									filteredCount[currClass.spec["@id"]]++;
								}else{
									filteredCount[currClass.spec["@id"]] = 1;
								}
								currClass = $scope.classes[currClass["isSubFrom"]];
							}
						});
						
					}
					return good;
			});
			//console.log(filteredCount);
		}
		$page += '<script>currentRestrictions=' + JSON.stringify({restrictions: $restrictions['filters']}) +'</script>';
	}
	var filterUrl = $scope.filterUrl;
	var filterName = $scope.filterName;
	var filterAttrName = $scope.filterAttrName;
	var parseDesc = $scope.parseDesc;
	var $imgPropertyName = $scope.fromOntology('그림') ? ($scope.fromOntology('그림'))['@id'] : false;
	var $showOnHomePropertyName = $scope.fromOntology('showOnHome') ? ($scope.fromOntology('showOnHome'))['@id'] : false;
	var $showOnNavigatorPropertyName = $scope.fromOntology('showOnNavigator') ? ($scope.fromOntology('showOnNavigator'))['@id'] : false;
	var renderSubClasses = function (cl,$recShow,$notFirst){
		
		
		$notFirst = !!$notFirst;
		$recShow = !!$recShow;
		
		$res = '<ul class="classTree"'+ ($notFirst && !$recShow ? ' style="display: none;"' : '')+ '>';
		for (var $id in cl){
			var sub = cl[$id];
			if(typeof sub != 'object')
				continue;
			if($restrictions['filters'] && !filteredCount[sub.spec['@id']]){
				continue;
			}
			if(!$recShow && !$notFirst && sub.spec[$showOnNavigatorPropertyName] && sub.spec[$showOnNavigatorPropertyName]['@value'] == 'false'){
				continue;
			}
			$res += '<li>';
			if(($restrictions['filters'] ? filteredCount[sub.spec['@id']] : $scope.countArr[sub.spec['@id']]) > 0){
			$res += '<div class="badge pull-left">' + ($restrictions['filters'] ? filteredCount[sub.spec['@id']] : $scope.countArr[sub.spec['@id']]) + '</div>';
			}
			$res += '<div class="listDiv1"><span class="class-icon' + (sub.subclassesCnt > 0 ? ' toExpand' + ($recShow ? ' minus' : '') +'" onClick="toggleList(this)"' : '"') +'></span>' +
			'<a' + ($scope.toOntology(sub.spec['@id']) ? ' href="javascript:" onclick=\'moveRestrictionsToURI("/facets/' + $scope.toOntology(sub.spec['@id']) : '') + '")\'>';
			if($restrictions['class'] && sub.spec['@id'] == $restrictions['class']['@id']){
				$res += '<b>' + sub.label +	'</b>';
			}else{
				$res += sub.label;
			}
			$res += '</a></div>';
			$res += renderSubClasses(sub.subclasses,$recShow,true);
			$res += '</li>';
		}
		$res += '</ul>';
		return $res;
	}
	$page += '<div id="content" style="padding-left: 10px; padding-right: 10px;">' +
'<div class="container-fluid">' +
'	  <div class="row">' +
	'  <!--[if IE]>' +
'	    <div class="col-md-4">' +
    '  <![endif]-->' +
	'<!--[if !IE]> -->' +
'	    <div class="col-md-3">' +
    '<!-- <![endif]-->' +
'	      <!--<b><img width="24px" src="static/img/diamond_icon.png" /> Facet navigation</b>-->' +
'	      ' +
/*
'	      <div ng-if="query['@type']" class="panel panel-default panel-primary" style="margin-top:10px;">' +
'	      		<div class="panel-heading" style="height: 35px;">' +
'	      			New restriction' +
'	      		</div>' +
'	      		<div class="panel-body" style="width: 100%; white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">' +
'	      			Property:' +
'		      		<br /><select ng-model="newQueryType" ng-disabled="query['@type'] == ''" style="width: 100%;">' +
'		      			<option value=""> -- select --</option>' +
'			  			<option ng-repeat="a in classes[query['@type']].spec['http://topbraid.org/facet#defaultFacets']['@list']" value="{{a['@id']}}">{{filterName(a['@id'])}}</option>' +
'		      		</select>' +
'		      		<br />' +
'			  		Value:' +
'			  		<br />' +
'		      		<select ng-disabled="query['@type'] == '' || newQueryType == ''" ng-model="query[newQueryType]" style="width: 100%;">' +
'		      			<option value> -- select --</option>' +
'			  			<option ng-repeat="c in facetObjs[facetTypes[facetTypesLookUp[newQueryType]]['range']] track by $index" value="{{c['@id']}}">{{filterName(c['@id'])}}</option>' +
'			  		</select>' +
'			  		<br />' +
'			  		<br />' +
'			  		<button type="button" class="btn btn-default btn-sm" ng-click="updateQuery()">' +
'			  			Add Restriction' +
'		  			</button>' +
'	      		</div>' +
'	      </div>' +
'	      ' +
'	      <div class="panel panel-default panel-info" ng-repeat="(nameRest,rest) in filteredQuery" ng-if="nameRest != '@searchable' && nameRest != '@type'" style="margin-top: 10px;">' +
'			  <div class="panel-heading" style="height: 35px;">' +
'			    <div style="line-height: 35px; float: right; cursor: pointer; position: relative; top: -10px;" ng-click="removeFromQuery(nameRest)">&times;</div>' +
'			    <div style="line-height: 35px; white-space: nowrap;overflow: hidden;text-overflow: ellipsis;"><h3 style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;" class="panel-title">{{filterName(nameRest)}}</h3></div> ' +
'			  </div>' +
'			  <div class="panel-body" style="width: 220px; white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">' +
'			    <a href="{{filterUrl(rest)}}">{{filterName(rest)}}</a>' +
'			  </div>' +
'		  </div>' +
*/
'<div class="panel panel-default panel-primary" style="margin-top:10px;">' +
'<div class="panel-heading" style="height: 35px;">' +
($restrictions['class'] ? '	      			<a href="/facets" style="cursor:pointer;"><span class="badge pull-right" style="font-size: 10px; cursor:pointer;">reset</span></a>' : '') +
'Navigator' +
'</div>' +
'<div class="panel-body" style="height: 300px; overflow-x:hidden; overflow-y: scroll;">';
if($restrictions['class']){
	$class = $scope.classes[$restrictions['class']['@id']];
	while($class.isSubFrom && $class.isSubFrom != "http://www.w3.org/2002/07/owl#Thing"){
		$class = $scope.classes[$class.isSubFrom];
	}
	
	$page += renderSubClasses([$class],true);	
}else{
	$page += renderSubClasses($scope.mainClasses);
}
$page +='	      		</div>' +
'	      </div>';

if($restrictions['class'] && $scope.classes[$restrictions['class']['@id']].spec['http://topbraid.org/facet#defaultFacets']){
	$class = $scope.classes[$restrictions['class']['@id']];
	if($restrictions['filters']){
		for(var nameRest in $restrictions['filters']){
			if(nameRest == "@searchable"){
				continue;
			}
			$page += '<div class="panel panel-default panel-info" style="margin-top: 10px;">' +
		    '<div class="panel-heading" style="height: 35px;">' +
		    '<div style="line-height: 35px; float: right; cursor: pointer; position: relative; top: -10px;" onClick="removeFromRestrictionQuery(\''+nameRest+'\')">&times;</div>' +
			'<div style="line-height: 35px; white-space: nowrap;overflow: hidden;text-overflow: ellipsis;"><h3 style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;" class="panel-title">' + $scope.filterName(nameRest.split("||")[0]) +'</h3></div>' +
			'</div><!--panelHeader-->' +
			'<div class="panel-body" style="width: 220px; white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">' +
			$scope.filterName($restrictions['filters'][nameRest].split("||")[0])+
			'</div><!--panelBody-->' +
		  '</div><!--panel Restriction-->';
		}
		
	}
	$page +='<div class="panel panel-default panel-primary" style="margin-top:10px;">' +
	'<div class="panel-heading" style="height: 35px;">' +
	'New restriction' +
	'</div><!--panel-heading-->' +
	'<div class="panel-body" style="width: 100%; white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">' +
	'Property:' +
	'<br /><select style="width: 100%;" onChange="mountObjList(this.value)">' +
	'<option value="">-- select --</option>';
	var res = {};
	var usedFacets = {};
	for(var a in $class.spec['http://topbraid.org/facet#defaultFacets']['@list']){
		var b = $class.spec['http://topbraid.org/facet#defaultFacets']['@list'][a];
		if(usedFacets[b['@id']]) continue;
		usedFacets[b['@id']] = true;
		var name = $scope.filterName(b['@id']);
		if(!res[name])
			res[name] = [];
		res[name].push(b['@id']);
	}
	for(var opc in res){
		if($restrictions["filters"] && $restrictions["filters"][res[opc].join("||")]) continue;
		$page += '<option value="'+res[opc].join("||")+'">'+opc+'</option>';
	}
	$page += '</select>' +
	'<br />' +
	'Value:' +
	'<br />' +
	'<select id="restrictionValue" style="width: 100%;" disabled="disabled" onChange="shouldShowRestrictionSubmit(this.value)"></select>' +
	'<br />' +
	'<br />' +
	'<button type="button" id="restrictionSubmit" class="btn btn-default btn-sm disabled" onClick="restrictionSubmit()">' +
	'Add Restriction' +
	'</button>' +
	'</div><!--panel-body-->' +
	'</div><!--panel-->';
}
/*
'<div class="panel panel-default panel-primary" style="margin-top:10px;">' +
'	      		<div class="panel-heading" style="height: 35px;">' +
'	      			New restriction' +
'	      		</div>' +
'	      		<div class="panel-body" style="width: 100%; white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">' +
'	      			Property:' +
'		      		<br /><select ng-model="newQueryType" ng-disabled="query['@type'] == ''" style="width: 100%;">' +
'		      			<option value=""> -- select --</option>' +
'			  			<option ng-repeat="a in classes[query['@type']].spec['http://topbraid.org/facet#defaultFacets']['@list']" value="{{a['@id']}}">{{filterName(a['@id'])}}</option>' +
'		      		</select>' +
'		      		<br />' +
'			  		Value:' +
'			  		<br />' +
'		      		<select ng-disabled="query['@type'] == '' || newQueryType == ''" ng-model="query[newQueryType]" style="width: 100%;">' +
'		      			<option value> -- select --</option>' +
'			  			<option ng-repeat="c in facetObjs[facetTypes[facetTypesLookUp[newQueryType]]['range']] track by $index" value="{{c['@id']}}">{{filterName(c['@id'])}}</option>' +
'			  		</select>' +
'			  		<br />' +
'			  		<br />' +
'			  		<button type="button" class="btn btn-default btn-sm" ng-click="updateQuery()">' +
'			  			Add Restriction' +
'		  			</button>' +
'	      		</div>' +
'	      </div>'
*/

$page +='</div>' +
'<!--[if IE]>' +
'<div class="col-md-8">' +
'<![endif]-->' +
'<!--[if !IE]> -->' +
'<div class="col-md-9">' +
'<!-- <![endif]-->' +
'<!--Body content-->';

var escapeHtml = function(text) {
  var map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };

  return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

if($restrictions["filters"] && $restrictions["filters"]["@searchable"]){
	$page += '<ol class="breadcrumb"><li>Searching for <strong>' + escapeHtml($restrictions["filters"]["@searchable"]) + '</strong></li><span onclick="removeFromRestrictionQuery(\'@searchable\')" class="badge pull-right" style="font-size: 10px; cursor:pointer;">reset</span></ol>';
}

/*
'		  <ol class="breadcrumb" ng-if="searchClasses.length > 0">' +
'			  <li ng-repeat="class in searchClasses" ng-class="{active: $last}">' +
'			  <a href="javascript:" ng-click="updateQueryType(class)" ng-if="!$last">{{filterName(class,1)}}</a>' +
'			  <span ng-if="$last">{{filterName(class,1)}}</span>' +
'			  </li>' +
'  		  </ol>' +
*/
for(var type in classFiltered){
if($showOnHomePropertyName && !$restrictions['class'] && $scope.classes[type].spec[$showOnHomePropertyName]){
	if($scope.classes[type].spec[$showOnHomePropertyName]['@value'] == 'false')
		continue;
}
if($scope.classes[type].objs.length == 0 || type.indexOf("/skos/") != -1){	
	continue;
}
if($restrictions['filters'] && filteredObjs[type] == 0){
	continue;
}
$page += '<ul class="phones">' +
'<h2><code><a href="' + filterUrl(type) + '">' + filterName(type) + '</a></code><span class="badge">' + ($restrictions['filters'] ? filteredCount[type] : $scope.countArr[type]) + '</span></h2>';

var leObjs = $restrictions['filters'] ? filteredObjs[type] :  $scope.classes[type].objs;

leObjs.forEach(function(phone){
	$page +='<li class="thumbnail phone-listing">';
	if($imgPropertyName && phone[$imgPropertyName]){
		$page +='<a href="' + filterUrl(phone['@id']) + '" class="thumb">' +
		'<img src="' + (util.isArray(phone[$imgPropertyName]) ? 
		phone[$imgPropertyName][0]['@value'] : 
		phone[$imgPropertyName]['@value']) +'" />'+
		'</a>';
	}
	$page +=	'<a href="' + filterUrl(phone['@id']) + '">' + filterName(phone['@id'])+'</a>';
	if(phone['http://purl.org/dc/elements/1.1/description']){
		$page += '<p style="height: 70px; overflow-y: scroll;">'+
		parseDesc(phone['http://purl.org/dc/elements/1.1/description']) +
		'</p>';
	}
	$page += '</li>';
});

$page +='</ul>';	
}

$page += '</div>' +
'</div>' +
'</div>';
			
			
	$page += '<div id="push"></div>' +
			'</div> <!-- /#content -->'+
			'</div> <!-- /#section -->'
	return $page;
	
}