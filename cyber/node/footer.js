module.exports = function($scope){
/*
	$page = 
	'<footer>'+
	'<img src="static/img/aict.png" width="100" height="100" alt=""/><div style="display: inline-block; margin-left:25px;"><strong>Modeled and Made by 서울대학교 차세대융합기술연구원 Linked Data연구 센터</strong><br/>대표전화 (031) 888-9381 Copyright © 2014 </div>'+
	'</footer>' +
	'</div> <!-- /wrap -->' +
	'<script>' +
	'$(".withTooltip").tooltip();' +
	'$(".PopOverDesc").popover({ html : true });' +
	'</script>' +
	'</body></html>';
	return $page;
*/
	return '' + fs.readFileSync(__dirname + "/static_pages/footer.html");
}