fs = require("fs");
module.exports = function($scope,$currPage){
	$menu = {"home": {
				label: "Home",
				baseUrl: "/"
			},
			"authors": { 
				label: "이벤트",
				baseUrl: "/explore/이벤트"		
			},
			"universities": { 
				label: "키워드",
				baseUrl: "/explore/키워드"		
			},
			"articles": { 
				label: "주최",
				baseUrl: "/explore/주최"		
			},
			"subjects": { 
				label: "발표자",
				baseUrl: "/explore/발표자"		
			},
			"events": { 
				label: "카테고리",
				baseUrl: "/explore/카테고리"		
			},
			"timeline": { 
				label: "발표제목",
				baseUrl: "/explore/발표제목"		
			},
			"locations": { 
				label: "지역",
				baseUrl: "/explore/지역"		
			},
			"apps": { 
				label: "소속기관",
				baseUrl: "/explore/소속기관"		
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