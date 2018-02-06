fs = require('fs');
util = require('util');
express = require("express");
translationTable = require("./translations.js");
bodyParser = require('body-parser');
var $filter = function(array, expression, comparator) {
    if (!util.isArray(array)) return array;

    var comparatorType = typeof(comparator),
        predicates = [];

    predicates.check = function(value) {
      for (var j = 0; j < predicates.length; j++) {
        if(!predicates[j](value)) {
          return false;
        }
      }
      return true;
    };

    if (comparatorType !== 'function') {
      if (comparatorType === 'boolean' && comparator) {
        comparator = function(obj, text) {
          return angular.equals(obj, text);
        };
      } else {
        comparator = function(obj, text) {
          if (obj && text && typeof obj === 'object' && typeof text === 'object') {
            for (var objKey in obj) {
              if (objKey.charAt(0) !== '$' && hasOwnProperty.call(obj, objKey) &&
                  comparator(obj[objKey], text[objKey])) {
                return true;
              }
            }
            return false;
          }
          text = (''+text).toLowerCase();
          return (''+obj).toLowerCase().indexOf(text) > -1;
        };
      }
    }

    var search = function(obj, text){
      if (typeof text == 'string' && text.charAt(0) === '!') {
        return !search(obj, text.substr(1));
      }
      switch (typeof obj) {
        case "boolean":
        case "number":
        case "string":
          return comparator(obj, text);
        case "object":
          switch (typeof text) {
            case "object":
              return comparator(obj, text);
            default:
              for ( var objKey in obj) {
                if (objKey.charAt(0) !== '$' && search(obj[objKey], text)) {
                  return true;
                }
              }
              break;
          }
          return false;
        case "array":
          for ( var i = 0; i < obj.length; i++) {
            if (search(obj[i], text)) {
              return true;
            }
          }
          return false;
        default:
          return false;
      }
    };
    switch (typeof expression) {
      case "boolean":
      case "number":
      case "string":
        // Set up expression object and fall through
        expression = {$:expression};
        // jshint -W086
      case "object":
        // jshint +W086
        for (var key in expression) {
          (function(path) {
            if (typeof expression[path] == 'undefined') return;
            predicates.push(function(value) {
              return search(path == '$' ? value : (value && value[path]), expression[path]);
            });
          })(key);
        }
        break;
      case 'function':
        predicates.push(expression);
        break;
      default:
        return array;
    }
    var filtered = [];
    for ( var j = 0; j < array.length; j++) {
      var value = array[j];
      if (predicates.check(value)) {
        filtered.push(value);
      }
    }
    return filtered;
  };
var res = JSON.parse(fs.readFileSync("phones.json"));
function parsePhonesJson(result){
var countFor = function(className){
        if(debug) console.log("counting for", className);
		var cnt = $filter($scope.classes[className].objs,$scope.filteredQuery).length;
		var subst = $scope.classes[className].subclasses;
		subst.forEach(function(b){
			cnt += countFor(b);
		});
		$scope.countArr[className] = cnt;
		return cnt;
}

var _filterURL = function($scope, name, simple){
	if(name.indexOf($scope.ontology['@id']) == 0){
		var arr = name.split('/');
		arr.shift();
		arr.shift();
		arr.shift();
		if(simple){
			arr[0] = 'simple';
		}
		return arr.join('/');
	}else{
		return name;
	}
}

var getDescByUri = function(uri){
	var thisname = $scope.objs[uri];
	if(thisname && thisname['http://purl.org/dc/elements/1.1/description']){
		return thisname['http://purl.org/dc/elements/1.1/description'];
	}else{
		return 'No description found!';
	}
}
var parseDesc = function(res,justLink){
	if(util.isArray(res)){
			res = res[res.length-1];
	}
	res = res['@value'] ? res['@value'] : res;
	var matches = res.match(/\{\{([^}]+)\}\}/g);
	var MatchFrom = [];
	var MatchLookup = {};
	var MatchTo = [];
	if(!matches){
		return res;
	}
	matches.forEach(function(index){ 
		var uri = index.substring(2, index.length-2);
		if(MatchLookup[uri]){
			return;
		}
		MatchFrom.push(index);
		MatchLookup[uri] = true;
		var filteredName;
		var stringTo = justLink ? '<a>' + filterName(uri) + '</a>' : '<a href="'+ filterUrl(uri) +'" onclick="$(this).popover(\'hide\');" class="PopOverDesc" data-container="body" data-toggle="popover" data-trigger="hover" data-placement="auto" data-content="'+ parseDesc(getDescByUri(uri),true).replace('"','\\"') +'">' + filterName(uri) + '</a>';
		MatchTo.push(stringTo);
	});
	for(var idx in MatchFrom){
		res = res.split(MatchFrom[idx]).join(MatchTo[idx]);
	}
	return res;
}
var filterUrl = function(a,simple) {
	return _filterURL($scope,a,simple);
}
var filterName = function(name,onlyLast){
	debug = false;
	var thisname = result.filter(function( a ) {
		return a['@id'] == name;
	});
	thisname = thisname[0];
	if(thisname && thisname['http://www.w3.org/2000/01/rdf-schema#label']){
		var labelTag;
		if(util.isArray(thisname['http://www.w3.org/2000/01/rdf-schema#label'])){
    		labelTag = thisname['http://www.w3.org/2000/01/rdf-schema#label'][(thisname['http://www.w3.org/2000/01/rdf-schema#label']).length-1];
		}else{
			labelTag = thisname['http://www.w3.org/2000/01/rdf-schema#label'];
		}
    	var tag = labelTag['@value'] != undefined ? labelTag['@value'] : labelTag;
    	if(tag && tag.length > 0){
	    	return tag;
    	}
	}
	if(name.indexOf($scope.ontology['@id']) == 0){
		if(debug) console.log(2,name.substring($scope.ontology['@id'].length));
    	return name.substring($scope.ontology['@id'].length);
	}
	if(debug) console.log(3,name);
	if(onlyLast){
    	name = name.split("/");
    	name = name[name.length-1];
	}
	return name;
}

var filterAttrName = function(name,onlyLast){
    		if(translationTable[name]){
	    		return translationTable[name];
    		}
    		return filterName(name,onlyLast);
    	}

var $scope = {
	objs: {},
	facetClasses: [],
	facetTypes: [],
	facetObjs: {},
	facetTypesLookUp: {},
	mainClasses: [],
	types: {},
	ontology: {},
	fromUri: function(uri){
//		console.log(this.objs[$scope.ontology['@id'] + name]);
		return this.objs[uri];
	},
	fromOntology: function(name){
//		console.log(this.objs[$scope.ontology['@id'] + name]);
		return this.objs[$scope.ontology['@id'] + name];
	},
	toOntology: function(name){
		if(name.indexOf($scope.ontology['@id']) == 0){
    		return name.substring($scope.ontology['@id'].length);
    	}else{
	    	return false;
    	}
	},
	filterName: filterName,
	filterAttrName : filterAttrName,
	filterUrl: filterUrl,
	parseDesc: parseDesc,
	classes: {},
	countArr: {},
	showOnNavigator_PropertyUri: null
};

for(var key in result){
	$scope.objs[result[key]['@id']] = result[key];
	var types = result[key]['@type'];
	if(types){
		if(!util.isArray(types)){
			types = [types];
		}
		
		types.forEach(function(type){
    		if(type.lastIndexOf("http://www.w3.org") != -1 && type.lastIndexOf("/skos") == -1)
    		{
    			if(type == 'http://www.w3.org/2002/07/owl#Ontology'){
	    			$scope.ontology = result[key];
    			}
    			if(type == 'http://www.w3.org/2002/07/owl#Class' && result[key]['http://www.w3.org/2000/01/rdf-schema#subClassOf']){
	    					if(!$scope.classes[result[key]['http://www.w3.org/2000/01/rdf-schema#subClassOf']['@id']]){
		    					$scope.classes[result[key]['http://www.w3.org/2000/01/rdf-schema#subClassOf']['@id']] = {spec: {}, objs: [],subclasses: [],subclassesCnt: 0,isSubFrom: null};
	    					}
	    					var objs = [];
	    					var subclasses = [];
	    					var subclassesCnt = 0;
	    					if($scope.classes[result[key]['@id']]){
		    					objs = $scope.classes[result[key]['@id']].objs;
		    					subclasses = $scope.classes[result[key]['@id']].subclasses;
		    					subclassesCnt = $scope.classes[result[key]['@id']].subclassesCnt;
	    					}
	    					$scope.classes[result[key]['@id']] = $scope.classes[result[key]['http://www.w3.org/2000/01/rdf-schema#subClassOf']['@id']].subclasses[result[key]['@id']] = 
	    					{ 
	    					spec: result[key], 
	    					objs: objs,
	    					subclasses: subclasses,
	    					subclassesCnt: subclassesCnt,
	    					isSubFrom: result[key]['http://www.w3.org/2000/01/rdf-schema#subClassOf']['@id']
	    					};
	    					$scope.classes[result[key]['http://www.w3.org/2000/01/rdf-schema#subClassOf']['@id']].subclasses.push(result[key]['@id']);
	    					$scope.classes[result[key]['http://www.w3.org/2000/01/rdf-schema#subClassOf']['@id']].subclassesCnt++;
    			}
	  
if((type == 'http://www.w3.org/2002/07/owl#ObjectProperty' || type == 'http://www.w3.org/2002/07/owl#SymmetricProperty') && result[key]['http://www.w3.org/2000/01/rdf-schema#range']){
		    		$scope.facetTypesLookUp[result[key]['@id']] = $scope.facetTypes.length;
		    		$scope.facetTypes.push(
		    		{
		    			type: result[key]['@id'],
		    			inverse: result[key]['http://www.w3.org/2002/07/owl#inverseOf'] ? result[key]['http://www.w3.org/2002/07/owl#inverseOf']['@id'] : null,
			    		range: result[key]['http://www.w3.org/2000/01/rdf-schema#range'] ? result[key]['http://www.w3.org/2000/01/rdf-schema#range']['@id'] : null,
			    		domain: result[key]['http://www.w3.org/2000/01/rdf-schema#domain'] ? result[key]['http://www.w3.org/2000/01/rdf-schema#domain']['@id'] : null
		    		});
		    		
	    		}
    		}
    		else
    		{
			    if(!$scope.classes[type]){
			    	$scope.classes[type] = {spec: {'@id': type}, objs: [],subclasses: [],subclassesCnt: 0,isSubFrom: null};
			    }
				   //Building Look-up table...
				   $scope.classes[type].objs[result[key]['@id']] = ($scope.classes[type].objs).length;
				   //Actual data
				   ($scope.classes[type].objs).push(result[key]);
				   for(var propname in result[key]){
					   	if(propname[0] == '@')
					   		continue;
					   
						var checkIncoming = function($id){
							var referred = result.filter(function( a ) {
							   	return a['@id'] == $id;
							});
							referred = referred[0];
							if(!referred)
								return;
							var inverseFunId = false;
							if($scope.objs[propname] && $scope.objs[propname]['http://www.w3.org/2002/07/owl#inverseOf'] && $scope.objs[propname]['http://www.w3.org/2002/07/owl#inverseOf']['@id']){
								inverseFunId = $scope.objs[propname]['http://www.w3.org/2002/07/owl#inverseOf']['@id'];
							}
							if(inverseFunId){
								if(!referred[inverseFunId]){
									referred[inverseFunId] = [];
								}
								if(!util.isArray(referred[inverseFunId])){
									referred[inverseFunId] = [referred[inverseFunId]];
								}
								var ig = referred[inverseFunId].filter(function(a){
									return a['@id'] == result[key]['@id'];
								});
								if(ig.length == 0){
									referred[inverseFunId].push({'@id': result[key]['@id']});
								}
							}else{
								if(!referred['@incoming']){
								   	referred['@incoming'] = [];
							   	}
							   	referred['@incoming'].push({'@from': result[key]['@id'], '@property': propname});
						   	}
					   	}
					   	
					   	if(!util.isArray(result[key][propname])){
					   		if(result[key][propname]['@id']){
						   		checkIncoming(result[key][propname]['@id']);
						   	}
					   	}else{
						   	result[key][propname].forEach(function($ob){
						   		if($ob['@id']){
						   			checkIncoming($ob['@id']);
						   		}
						   	});
					   	}
					   	
				   }
		    }
	    });
    }
}
for (var $objName in $scope.objs){
	var $obj = $scope.objs[$objName];
	if(!$obj['@incoming'])
		continue;
	$obj['@incoming'].forEach(function(value){
		var inverseFunId = false;
	
		if($scope.objs[value['@property']] && $scope.objs[value['@property']]['http://www.w3.org/2002/07/owl#inverseOf'] && $scope.objs[value['@property']]['http://www.w3.org/2002/07/owl#inverseOf']['@id']){
			inverseFunId = $scope.objs[value['@property']]['http://www.w3.org/2002/07/owl#inverseOf']['@id'];
		}
		if(inverseFunId){
			if(!$obj[inverseFunId]){
				$obj[inverseFunId] = [];
			}
			if(!util.isArray($obj[inverseFunId])){
				$obj[inverseFunId] = [$obj[inverseFunId]];
			}
			var ig = $obj[inverseFunId].filter(function(a){
				return a['@id'] == value['@from'];
			});
			if(ig.length == 0){
				$obj[inverseFunId].push({'@id': value['@from']});
			}
			value['@rewritten'] = true;
		}
	})
	
}
/*
for(var facetType in $scope.facetTypes){
	var facet = $scope.facetTypes[facetType];
	if(facet.inverse == null)
		continue;
	var inverseFacet = $scope.facetTypes.filter(function (element) {
		return element.type == facet.inverse;
	});
	inverseFacet = inverseFacet[0];
	if(!facet || !inverseFacet){
		console.log("Invalid domains...");
		console.log(facetType);
		continue;
	}
	var obFacet = $scope.classes[facet['domain']];
	var invDomain = $scope.classes[inverseFacet['domain']];
	if(!obFacet || !invDomain){
		continue;
	}
	obFacet = obFacet.objs;
	invDomain = invDomain.objs;
	$.each(obFacet,function($idx,result){
			if(!result[facet.type])
				return;
				//console.log(result);
			if(util.isArray(result[facet.type])){
				for(var idx in result[facet.type]){
					console.log(facet,inverseFacet['domain'],invDomain,result[facet.type][idx]['@id'],invDomain[result[facet.type][idx]['@id']]);
					if(!util.isArray(invDomain[invDomain[result[facet.type][idx]['@id']]][inverseFacet['type']])){
						invDomain[invDomain[result[facet.type][idx]['@id']]][inverseFacet['type']] = new Array({ "@id": result['@id'] });
					}else{
						invDomain[invDomain[result[facet.type][idx]['@id']]][inverseFacet['type']].push({ "@id": result['@id'] });
					}
				}
			}else{
				if(!util.isArray(invDomain[invDomain[result[facet.type]['@id']]][inverseFacet['type']])){
					invDomain[invDomain[result[facet.type]['@id']]][inverseFacet['type']] = new Array({ "@id": result['@id'] });
				}else{
					invDomain[invDomain[result[facet.type]['@id']]][inverseFacet['type']].push({ "@id": result['@id'] });
				}
			}
	});
	$scope.types[inverseFacet['domain']] = invDomain;
	
}
*/
var facetObjs = {};
var getObjs = function(cla){
	var objs = [].concat(cla.objs);
	cla.subclasses.forEach(function(a){
		var sobjs = getObjs(cla.subclasses[a]);
		sobjs.filter(function(b){
			var tmp = objs.filter(function(c){
				return b['@id'] == c['@id'];
			});
			if(tmp.length == 0){
				objs.push(b);
			}
		});
	});
	return objs;
}
var recurseOnType = function(type){
var res = [];
if($scope.classes[type]){
var facets = $scope.classes[type].spec['http://topbraid.org/facet#defaultFacets'];
var arr = $scope.classes[type].subclasses;
$scope.facetObjs[type] = getObjs($scope.classes[type]);
arr.forEach(function(a){
	if(facets){
		if(!$scope.classes[a].spec['http://topbraid.org/facet#defaultFacets']){
    		$scope.classes[a].spec['http://topbraid.org/facet#defaultFacets'] = {'@list': []};
		}
		$scope.classes[a].spec['http://topbraid.org/facet#defaultFacets']['@list'] = ($scope.classes[a].spec['http://topbraid.org/facet#defaultFacets']['@list']).concat(facets['@list']);
	}
	res[a] = res.length;
	res.push({name: a, subs: recurseOnType(a)});
});
}
return res;
}
$scope.facetClasses = recurseOnType("http://www.w3.org/2002/07/owl#Thing");

var addTypeToChilds = function(sub,types){
var child_types = types.concat([sub.spec['@id']]);
sub.subclasses.forEach(function(key){
	addTypeToChilds(sub.subclasses[key],child_types);
});

sub.objs.forEach(function(obj){
	if(!util.isArray(obj['@type'])){
    	obj['@type'] = [obj['@type']];
	}
	obj['@type'] = obj['@type'].concat(types);
	obj['@searchable'] =
		[
			obj['@id'], 
			obj['http://www.w3.org/2000/01/rdf-schema#label'] ? obj['http://www.w3.org/2000/01/rdf-schema#label'] : '',
			obj['http://www.w3.org/2004/02/skos/core#altLabel'] ? obj['http://www.w3.org/2004/02/skos/core#altLabel'] : '',
			obj['http://www.w3.org/2004/02/skos/core#hiddenLabel'] ? obj['http://www.w3.org/2004/02/skos/core#hiddenLabel'] : '',
			obj["http://www.w3.org/2004/02/skos/core#prefLabel"] ? obj["http://www.w3.org/2004/02/skos/core#prefLabel"] : ''
		];
	//obj['@searchable'] = obj['@searchable'].join(",");
});

}
for(var key in $scope.classes){
$scope.classes[key].objs.forEach(function(obj){
		obj['@searchable'] =
		[
			obj['@id'] ? obj['@id'] : '', 
			obj['http://www.w3.org/2000/01/rdf-schema#label'] ? obj['http://www.w3.org/2000/01/rdf-schema#label'] : '',
			obj['http://www.w3.org/2004/02/skos/core#altLabel'] ? obj['http://www.w3.org/2004/02/skos/core#altLabel'] : '',
			obj['http://www.w3.org/2004/02/skos/core#hiddenLabel'] ? obj['http://www.w3.org/2004/02/skos/core#hiddenLabel'] : '',
			obj["http://www.w3.org/2004/02/skos/core#prefLabel"] ? obj["http://www.w3.org/2004/02/skos/core#prefLabel"] : ''
		];
		//obj['@searchable'] = obj['@searchable'].join(",");
});
if($scope.classes[key].isSubFrom != 'http://www.w3.org/2002/07/owl#Thing'){
	continue;
}else{
	$scope.mainClasses.push($scope.classes[key]);
	$scope.classes[key].subclasses.forEach(function(key2){
		addTypeToChilds($scope.classes[key].subclasses[key2],[$scope.classes[key].spec['@id']]);
	});
}
}

var objsForTypeRec = function(cl){ //Includes subclasses
	var objs = cl.objs;
	cl.subclasses.forEach(function(sub){
		objs = objs.concat(objsForTypeRec(cl.subclasses[sub]));
	});
	return objs;
}
$scope.objsForType = function(type){
	return 	$scope.classes[type] ? objsForTypeRec($scope.classes[type]) : [];
};
var recurseLabel = function(c){
		for(var a in c){
			c[a].label = filterName(a);
			recurseLabel(c[a].subclasses);
		};
}
recurseLabel($scope.classes);
countFor("http://www.w3.org/2002/07/owl#Thing");
$scope.showOnNavigator_PropertyUri = $scope.ontology['@id'] + "showOnNavigator";
return $scope;
}
$scope = parsePhonesJson(res);
$app = express();
$app.use(bodyParser.urlencoded({ extended: false }));
$app.use(bodyParser.json());
$app.use('/static', express.static(__dirname + '/static'));
$app.use('/bower_components', express.static(__dirname + '/bower_components'));

$app.all(/^\/resource\/(.*)/, function (req, res, next) {
  res.redirect("/page/"+encodeURIComponent(req.params[0]).replace("%2F","/"));
  res.end();
});

$header = require("./header.js");
$footer = require("./footer.js");
$detail = require("./detail.js");
$simple = require("./simple.js");
$list = require("./list.js");
$listExplore = require("./listExplore.js");
$propRangeJson = require("./rangeJson.js");
$searchJson = require("./searchJson.js");
$timelineJson = require("./timelineJson.js");
$rangeJson = require("./range.js");
$remoteLOD = require("./remoteLODJson.js");

$staticUris = [
	/*{	regexp:  "^\/linked_data$",
		content: fs.readFileSync("static_pages/ld_home.html"),
		top_menu: "ld"
	},
	{	regexp:  "^\/linked_data\/sparql$",
		content: fs.readFileSync("static_pages/ld_sparql.html"),
		top_menu: "ld"
	},
	{	regexp:  "^\/linked_data\/support$",
		content: fs.readFileSync("static_pages/ld_support.html"),
		top_menu: "ld"
	},
	{	regexp:  "^\/relation_finder$",
		content: fs.readFileSync("static_pages/rf_home.html"),
		top_menu: "rf"
	},
	{	regexp:  "^\/relation_finder\/practice$",
		content: fs.readFileSync("static_pages/rf_practice.html"),
		top_menu: "rf"
	},
	{	regexp:  "^\/relation_finder\/tutorial$",
		content: fs.readFileSync("static_pages/rf_tutorial.html"),
		top_menu: "rf"
	}*/
];
$staticUris.forEach(function(uriObj){
	$app.all(new RegExp(uriObj.regexp),function (req, res, next) {
		res.header("Content-Type", "text/html");
		res.write($header($scope,uriObj.top_menu));
		res.write(uriObj.content);
		res.write($footer($scope));
		res.end();
	});
	
});
/*
$app.all(/^\/(|index\.html)$/,function (req, res, next) {
  res.header("Content-Type", "text/html");
  res.write($header($scope,"home"));
  res.write($home($scope));
  res.write($footer($scope));
  res.end();
});

$app.all(/^\/browsing$/,function (req, res, next) {
  res.header("Content-Type", "text/html");
  res.write($header($scope,"browsing"));
  res.write($browsing($scope));
  res.write($footer($scope));
  res.end();
});

$app.all(/^\/relation_finder$/,function (req, res, next) {
  res.header("Content-Type", "text/html");
  res.write($header($scope,"rf"));
  res.write($relfinder($scope));
  res.write($footer($scope));
  res.end();
});

$app.all(/^\/linked_data$/,function (req, res, next) {
  res.header("Content-Type", "text/html");
  res.write($header($scope,"ld"));
  res.write($linkeddata($scope));
  res.write($footer($scope));
  res.end();
});
*/
$homeDate = null;
$homeCache = null;

var tmpObjs = [];//$scope.classes[$scope.fromOntology('저작')['@id']].objs;
var $imgPropertyName = $scope.fromOntology('그림') ? ($scope.fromOntology('그림'))['@id'] : '그림';

var $SiteProperties = $scope.fromOntology('SiteProperties');

$homeObjs = [];

tmpObjs.forEach(function(obj){
	if(obj[$imgPropertyName] && obj['http://purl.org/dc/elements/1.1/description']){
					var desc = util.isArray(obj['http://purl.org/dc/elements/1.1/description']) ? obj['http://purl.org/dc/elements/1.1/description'][0]['@value'] : obj['http://purl.org/dc/elements/1.1/description']['@value'];
					$homeObjs.push({
							"name": $scope.filterName(obj["@id"]),
							"desc": desc,
							"pic": util.isArray(obj[$imgPropertyName]) ? obj[$imgPropertyName][0]["@value"] : obj[$imgPropertyName]["@value"],
							"dbid": obj["@id"]
						});
				}
});

if($homeObjs.length == 0){
	$homeObjs.push({
							"name": '',
							"desc": '',
							"pic": '',
							"dbid": ''
						});
}

delete tmpObjs;


$app.all(/^\/(|index\.html)$/,function (req, res, next) {
	res.header("Content-Type", "text/html");
	res.write($header($scope,"home"));
	
	var now = new Date();
	var dayN = parseInt(now.getTime() / 86400000);
	
	if($homeDate != dayN){
		var obj = $homeObjs[dayN % $homeObjs.length];
		var loader = '' + fs.readFileSync("static_pages/home.html");
		loader = loader.replace("<%TODAY_ID%>",obj.dbid);
		loader = loader.replace("<%TODAY_IMG%>",obj.pic);
		loader = loader.replace("<%TODAY_TITLE%>",obj.name);
		loader = loader.replace("<%TODAY_DESC%>",obj.desc);
		
		$homeCache = loader;
		$homeDate = dayN;
	}
	
	res.write($homeCache);
	res.write($footer($scope));
	res.end();
	
	
});
$app.all(/^\/facets$/,function (req, res, next) {
  res.header("Content-Type", "text/html");
  res.write($header($scope,"facets"));
  
  var $rest = {};
  
  if(req.body['restrictions']){
	  try{
	  	$rest['filters'] = JSON.parse(req.body['restrictions']);
	  	if(Object.keys($rest['filters']).length == 0){
		  	delete $rest['filters'];
	  	}
	  }catch(e){
	  	delete $rest['filters'];
	  }
  }
  if(req.body['@searchable']){
	 if(!$rest["filters"])
	 	$rest["filters"] = {};
	 $rest["filters"]["@searchable"] =  req.body['@searchable'];
  }
  
  var menu = '<a href="/facets">' +
	'<div class="option active menu1">' +
	'<div class="fa"></div>' +
	'<div class="menuLabel">복합패싯</div>' +
	'</div>' +
	'</a>';
  var k = 2;
  $exploreAllowed.forEach(function(a){
		menu += '<a href="/explore/'+ a +'"><div class="option '+ (req.params[1] == a ? 'active ' : '') +'menu'+ (k++) +'"><div class="fa"></div><div class="menuLabel">'+a+'</div></div></a>';
	});
  
  res.write($list($scope,$filter,$rest,menu));
  res.write($footer($scope));
  res.end();
});

$browsingPageContents = '' + fs.readFileSync("static_pages/browsing.html");
$browsingAllowed = [];
$BrowsingClassesProperty = $scope.fromOntology('BrowsingClasses') ? $scope.fromOntology('BrowsingClasses')['@id'] :'BrowsingClasses';
if($BrowsingClassesProperty && $SiteProperties[$BrowsingClassesProperty] && $SiteProperties[$BrowsingClassesProperty]['@list']){
	$SiteProperties[$BrowsingClassesProperty]['@list'].forEach(function(cl){
		$browsingAllowed.push($scope.toOntology(cl['@id']));
	});

	
}

$exploreAllowed = [];
$BrowsingFacetsProperty = $scope.fromOntology('BrowsingFacets') ? $scope.fromOntology('BrowsingFacets')['@id'] :'BrowsingFacets';
if($BrowsingFacetsProperty && $SiteProperties[$BrowsingFacetsProperty] && $SiteProperties[$BrowsingFacetsProperty]['@list']){
	$SiteProperties[$BrowsingFacetsProperty]['@list'].forEach(function(cl){
		$exploreAllowed.push($scope.toOntology(cl['@id']));
	});

	
}


$browsingStatic = {};
//$browsingStatic = {'타임라인': '' + fs.readFileSync("static_pages/bw_timeline.html")}
$app.all(/^\/browsing$/,function (req, res, next) {
	
	res.redirect('/browsing/'+encodeURIComponent($browsingAllowed[0]).replace("%2F","/"));
	res.end();
	return;
	
});
$app.all(/^\/browsing\/(.*)/,function (req, res, next) {
	if($browsingAllowed.indexOf(req.params[0]) == -1){
		res.header("Content-Type", "text/html");
		res.write($header($scope,"browsing"));
		res.write($detail($scope,null,true));
		res.write($footer($scope));
		res.end();
		return;
	}
	
	var $menu = '';
	var k = 1;
	$browsingAllowed.forEach(function(a){
		$menu += '<a href="/browsing/'+ a +'"><div class="option '+ (req.params[0] == a ? 'active ' : '') +'menu'+ (k++) +'"><div class="fa"></div><div class="menuLabel">'+($browsingStatic[a] ? a : a + '별' )+'</div></div></a>';
	});
	
	res.header("Content-Type", "text/html");
	res.write($header($scope,"browsing"));
	if($browsingStatic[req.params[0]]){
		res.write($browsingStatic[req.params[0]].replace("<%MENU%>",$menu));
	}else{
		res.write($browsingPageContents.replace("<%MENU%>",$menu).replace("<%CLASSNAME%>",req.params[0]));
	}
	
	res.write($footer($scope));
	res.end();
	
	
});

/*
$app.all(/^\/facets_home$/,function (req, res, next) {
	var loader = '' + fs.readFileSync("static_pages/facets_home.html");
	var menu = '';
	var k = 3;
  $exploreAllowed.forEach(function(a){
		menu += '<a href="/explore/'+ a +'"><div class="option '+ (req.params[1] == a ? 'active ' : '') +'menu'+ (k++) +'"><div class="fa"></div><div class="menuLabel">'+a+'</div></div></a>';
	});
	loader = loader.replace("<%MENU%>",menu);
	
	res.header("Content-Type", "text/html");
	res.write($header($scope,"facets"));
	res.write(loader);
	res.write($footer($scope));
	res.end();
	
});
*/

$app.all(/^\/(facets|explore)\/(.*)/,function (req, res, next) {
  var $obj = $scope.fromOntology(req.params[1]); 
  if(!$obj || $obj["@type"] != "http://www.w3.org/2002/07/owl#Class"){
	res.header("Content-Type", "text/html");
	res.write($header($scope,"facets"));
	res.write($detail($scope,null,true));
	res.write($footer($scope));
	res.end();
	return;
  }
  var $rest = {'class': $obj};
  if(req.body['restrictions']){
	  try{
	  	$rest['filters'] = JSON.parse(req.body['restrictions']);
	  	if(Object.keys($rest['filters']).length == 0){
		  	delete $rest['filters'];
	  	}
	  }catch(e){
	  	delete $rest['filters'];
	  }
  }
  if(req.body['@searchable']){
	 if(!$rest["filters"])
	 	$rest["filters"] = {};
	 $rest["filters"]["@searchable"] =  req.body['@searchable'];
  }
  var menu = '<a href="/facets">' +
	'<div class="option menu1">' +
	'<div class="fa"></div>' +
	'<div class="menuLabel">복합패싯</div>' +
	'</div>' +
	'</a>';
  var k = 2;
  $exploreAllowed.forEach(function(a){
		menu += '<a href="/explore/'+ a +'"><div class="option '+ (req.params[1] == a ? 'active ' : '') +'menu'+ (k++) +'"><div class="fa"></div><div class="menuLabel">'+a+'</div></div></a>';
	});
  
  res.header("Content-Type", "text/html");
  res.write($header($scope,"facets"));
  if(req.params[0] == "facets"){
	  res.write($list($scope,$filter,$rest,menu));
  }else if(req.params[0] == "explore"){
	  res.write($listExplore($scope,$rest,menu));
  }
  
  res.write($footer($scope));
  res.end();
});

$app.all(/^\/propRange\.json/,function (req, res, next) {
  res.header("Content-Type", "application/json; charset=utf-8");
  res.write($propRangeJson($scope,req));
  res.end();
});

$app.all(/^\/search\.json/,function (req, res, next) {
  res.header("Content-Type", "application/json; charset=utf-8");
  res.write($searchJson($scope,$filter,req));
  res.end();
});

$app.all(/^\/timeline\.json/,function (req, res, next) {
  res.header("Content-Type", "application/json; charset=utf-8");
  res.write($timelineJson($scope,req));
  res.end();
});

$app.all(/^\/authors\.json/,function (req, res, next) {
  res.header("Content-Type", "application/json; charset=utf-8");
  res.write($authorsJson($scope,req));
  res.end();
});

$app.all(/^\/range\.json/,function (req, res, next) {
  res.header("Content-Type", "application/json; charset=utf-8");
  res.write($rangeJson($scope,req));
  res.end();
});


$app.all(/^\/remoteLOD\.json/,function (req, res, next) {
  $remoteLOD($scope,req,function(data){
	  res.header("Content-Type", "application/json; charset=utf-8");
	  res.write(data);
	  res.end();
  });
});

$app.all(/^\/page\/(.*)/, function (req, res, next) {
  var $obj = $scope.fromOntology(req.params[0]);
  res.header("Content-Type", "text/html");
  res.write($header($scope,"facets"));
  if($obj){  
  	res.write($detail($scope,$obj));
  }else{
	res.write($detail($scope,null,true));
  }
  res.write($footer($scope));
  res.end();
});

$app.all(/^\/simple\/(.*)/, function (req, res, next) {
  var $obj = $scope.fromOntology(req.params[0]);
  res.header("Content-Type", "text/html");
  if($obj){  
  	res.write($simple($scope,$obj));
  }else{
	res.write($simple($scope,null,true));
  }
  res.end();
});
$app.listen(80);
