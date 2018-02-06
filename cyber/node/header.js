fs = require("fs");
module.exports = function($scope,$currPage){
	$menu = {"home": {
				label: "Home",
				baseUrl: "/"
			},
			"arti": { 
				label: "이벤트",
				baseUrl: "/explore/이벤트123"
			},
			"articles": { 
				label: "관련인물",
				baseUrl: "/explore/관련인물"		
			},
			"even": { 
				label: "nearBy",
				baseUrl: "/explore/nearBy"		
			},
			"time": { 
				label: "주제",
				baseUrl: "/explore/주제"		
			},
			"timeline": { 
				label: "주최",
				baseUrl: "/explore/주최"		
			},
			"line": { 
				label: "주관",
				baseUrl: "/explore/주관"		
			},
			"authors-": { 
				label: "이용자태깅",
				baseUrl: "/explore/이용자태깅"		
			},
			"authors": { 
				label: "큐레이터",
				baseUrl: "/explore/큐레이터"		
			},

			
	};
	//Handling Explore
	/*$scope.browsingClasses.forEach(function(a){
		var obj = {label: a, url: 'explore/'+a};
		$menu["facets"]['subs'].push(obj);
	})*/
	$renderMenu = '<div id="nav"><div id="nav-scroller"><div id="nav-main">';
	for(var key in $menu){
		var curr = $menu[key];
		if(curr.subs){
			$renderMenu += '<div class="dropdown"><button class="btn btn-default dropdown-toggle' +($currPage == key ? ' current' : '')+'" type="button" id="home" data-toggle="dropdown">' + curr.label + '<span class="caret"></span></button><ul class="dropdown-menu" role="menu" aria-labelledby="menu1">';
			curr.subs.forEach(function(option){
				if(typeof option == 'string'){
					$renderMenu += '<li role="presentation"><a role="menuitem" tabindex="-1" href="' + curr.baseUrl + '/' + option +'">'+ option +'</a></li>';
				}else{
					$renderMenu += '<li role="presentation"><a role="menuitem" tabindex="-1" href="'+ curr.baseUrl + option.url +'">'+ option.label +'</a></li>';
				}
			});
			$renderMenu += '</ul></div>';
			
		}else{
			$renderMenu += '<a href="' + curr.baseUrl +'"><div class="dropdown"><button class="btn btn-default' +($currPage == key ? ' current' : '')+'" type="button">' + curr.label + '</button></div></a>'	
		}
	}
	
	$renderMenu += '<div class="dropdown no-hide"><button class="btn btn-default btn-search" type="button" id="home"><i class="fa fa-search"></i></button></div><input id="searchText" class="typeahead ui-autocomplete-input" autocomplete="off" type="text" placeholder="Search...">'
	
	$renderMenu += '</div><!--nav-main--></div><!--nav-scroller--></div><!--nav-->'
	
	var tmp = '' + fs.readFileSync("static_pages/header.html");
	tmp = tmp.replace("<%MENU%>",$renderMenu);
	return tmp;
}