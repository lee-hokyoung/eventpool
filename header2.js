var _url = require('url');
module.exports = function($scope,$currPage){
	$ontology = _url.parse($scope.ontology['@id']);
	$page = 
	'<html><head>' +
	'<base href="http://' + $ontology.host +'/">' +
	'<meta http-equiv="X-UA-Compatible" content="IE=edge"> '+
    '<meta charset="utf-8">' +
    '<meta name="viewport" content="width=device-width, initial-scale=1.0">' +
	'<link rel="stylesheet" href="//netdna.bootstrapcdn.com/font-awesome/4.2.0/css/font-awesome.min.css">' +
	'<link rel="stylesheet" href="bower_components/bootstrap/dist/css/bootstrap.min.css">' +
	'<link rel="stylesheet" href="static/css/notosans.css">' +
	'<link rel="stylesheet" href="static/css/jejugothic.css">' +
	'<link rel="stylesheet" href="static/css/style.css">' +
	'<link rel="stylesheet" href="static/css/search-component.css">' +
	'<link rel="stylesheet" href="static/css/app.css">' +
	'<link rel="stylesheet" href="static/css/main.css">' +
	'<link rel="stylesheet" href="static/css/animations.css">' +
	'<link rel="stylesheet" href="static/js/themes/4/js-image-slider.css">' +
	'<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"></script>' +
	'<script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.2/jquery-ui.min.js"></script>' +
	'<script src="bower_components/bootstrap/js/tooltip.js"></script>' +
	'<script src="bower_components/bootstrap/js/popover.js"></script>' +
	'<script src="static/js/themes/4/js-image-slider.js"></script>'+
	'<script src="static/js/common.js"></script>' +
	'<script src="static/js/swfobject.js"></script>' +
	//'<script src="static/js/typeahead.js"></script>' +
//	'<script src="//maps.googleapis.com/maps/api/js?key=AIzaSyAR79xepexMqVonUi9vId0iYH-w5sYemrY&sensor=false"></script>' +
	'<!--[if lt IE 9]>' +
    '<script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>' +
    '<script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>' +
    '<![endif]-->' +
    '<title>대경권기업성장지원센터</title>' +
	'<script>var __adobewebfontsappname__="dreamweaver"</script><script src="http://use.edgefonts.net/source-sans-pro:n6:default.js" type="text/javascript"></script>' +
	'</head><body>' +
	'<div id="wrapper">' +
	'<header id="top">' +
	'<div id="nav">' +
      '<ul class="main-nav">'+
        '<li><a class="nav-link-logo" href="/"><img id="nav-logo" src="static/images/logo.jpg" style="width: 180px; height:193px;"></a></li>'+
        '<hr>'+
        '<li><a href="/browsing">Browsing</a></li><hr>'+
        '<li><a href="/facets">Facets</a></li><hr>'+
      '</ul>'+
       '<p class="content-icon-paragraph footer-email"><a href="mailto:swpark8469@nate.com">기업체참여하기</a></p>' +
    '</div>'+
	
/*
	if($scope.fromOntology('SiteProperties')){
		$headerHTMLProp =  $scope.fromOntology('HeaderHTML') ? $scope.fromOntology('HeaderHTML')['@id'] : 'HeaderHTML';
		$siteProps = $scope.fromOntology('SiteProperties')
		if($siteProps[$headerHTMLProp]){
			$page += $siteProps[$headerHTMLProp]['@value'] ? $siteProps[$headerHTMLProp]['@value'] : $siteProps[$headerHTMLProp];
		}
	}
	
	//'<h2> <img src="static/img/gyunggi.gif" width="199" height="68" alt=""> <br>LOD기반 근대문학 온톨로지</h2>'+
	$page += '<nav id="mainnav">'+ 
	'<ul>'+ 
	'<li><a href="/"' + (($currPage=='Home') ? ' class="thispage"' : '') + '>홈</a></li>'+ 
	'<li><a href="/browsing"' + (($currPage=='browsing') ? ' class="thispage"' : '') + '>브라우징 탐색</a></li>'+ 
	'<li><a href="/relation_finder"' + (($currPage=='rf') ? ' class="thispage"' : '') + '>시맨틱 관계탐색</a></li>'+ 
	'<li><a href="/linked_data"' + (($currPage=='ld') ? ' class="thispage"' : '') + '>Linked Data</a></li>'+ 
	'<li><a href="/facets_home"' + (($currPage=='facets') ? ' class="thispage"' : '') + '>패싯탐색</a></li>'+
	'<li><div class="searchBoxDiv"><div class="searchIcon"><i class="fa fa-search"></i></div><div class="searchBoxField"><input class="typeahead" type="text" id="searchBoxTop" /></div></div></li>'+
	'</ul>'+ 
	'</nav>'+ 
*/
//	'<nav id="searchBox"></nav>' +
	'</header>';
/*	'<nav class="navbar navbar-default" role="navigation">' +
	'<div class="container-fluid">' +
	'  <!-- Brand and toggle get grouped for better mobile display -->' +
	'  <div class="navbar-header">' +
	'    <a class="navbar-brand" href="/">' +
	'    <b>한국의 근현대소설</b>' +
	'    <h6>국립중앙도서관</h6>' +
	'    </a>' +
	'  </div><!-- /.navbar-header -->' +
	'    <ul class="nav navbar-nav navbar-right">' +
	'      <li><a href="/">Browsing</a></li>' +
	'      <li><a href="/">Thingology</a></li>' +
	'      <li><a href="#">Relation Finder</a></li>' +
	'      <li><a href="#">L.D. Front End</a></li>' +
	'    </ul>' +
	'    <form ng-if="isSearchable" class="navbar-form navbar-right" role="search">' +
	'      <div class="form-group">' +
	'        <input type="text" class="form-control" placeholder="Search...">' +
	'      </div>' +
	'    </form>' +
	'</div><!-- /.container-fluid -->' +
	'</nav>';
	*/
	return $page;
}