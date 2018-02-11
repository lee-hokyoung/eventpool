var _url = require('url');
module.exports = function($scope){
	$ontology = _url.parse($scope.ontology['@id']);
	$page = '<footer class="site-footer">' +
	'<img src="static/images/logo-footer.jpg" id="logo-footer"><p id="content-footer">39268 경북 구미시 수출대로 127 한국산업단지공단 대경지역본부 TEL: 054-462-9497</p>' +
/*
	if($scope.fromOntology('SiteProperties')){
		$FooterHTMLProp =  $scope.fromOntology('FooterHTML') ? $scope.fromOntology('FooterHTML')['@id'] : 'FooterHTML';
		$siteProps = $scope.fromOntology('SiteProperties')
		if($siteProps[$FooterHTMLProp]){
			$page += $siteProps[$FooterHTMLProp]['@value'] ? $siteProps[$FooterHTMLProp]['@value'] : $siteProps[$FooterHTMLProp];
		}
	}
*/
	'</footer>' +
	'</div> <!-- /wrap -->' +
	'<script>' +
	'$(".withTooltip").tooltip();' +
	'$(".PopOverDesc").popover({ html : true });' +
	'</script>' +
	'</body></html>';
	return $page;
}