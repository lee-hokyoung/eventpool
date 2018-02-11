module.exports = function($scope){
	$page = 
'<div id="hero">' +
'<script>var imgArray = ["static/img/rel_pic.gif", "static/img/castle_2.gif", "static/img/rel_pic_2.gif",  "static/img/rel_pic_3.gif",  "static/img/yongin.gif"];</script>' +
'<img id="imageslider" src="static/img/yongin.gif" width="1041" height="225" alt=""/>' +
'</div>' +
'<article id="main">' +
'<h2>시맨틱 관계 탐색</h2>' +
'<p>Linked Data는 결국 데이터를 구조적으로 표현하고, 데이터 사이의 관계를 명시적으로 정의하한 기술입니다.<br><br> 예를 들어, \'황순원\' 원작 \'소나기\'와 2005년에 KBS에서 제작한 \'소나기\'라는 특집 드라마와는 어떤 관계일까요?' +
'소나기라는 저작(work이 다양한 형태의 매체에 새겨진 것을 알 수 있습니다. 그리고 황순원 선생님께서 쓰신 다른 저작도 자 알 수 있습니다.' +
'이런 관계는 Linked Data 기술을 이용해서 데이터를 구축하고 SPARQL이라는 질의를 통해 찾을 수 있습니다. 그러나 이용자 여러분들께서 이런 SPARQL이라는 질의를 던지기가 쉽지 않습니다.' +
'<br><br>' +
'그런 어려움을 돕기도 하고 또 실제는 있지만 우리 인간은 모를 수도 있는 관계를 보여주기 위해서' +
'시맨틱 관계를 시각화시켜 보여드리자는 것입니다.<br><br>' +
'탐색하기 원하는 조건을 키워드로 입력하면 키워드가 갖고 있는 관계를 시각화해 줍니다. <br>' +
'</p>' +
'<figure class="floatleft"><img src="static/img/rel.gif" alt="" width="540" height="228" class="floatleft"/>' +
'</figure>' +
'<br><br><br>' +
'<fieldset class="centered"><legend>Visualization</legend>' +
'데이터 시각화(data visualization)는 데이터 분석 결과를 쉽게 이해할 수 있도록 시각적으로 표현하고 전달되는 과정을 말한다. 데이터 시각화의 목적은 도표(graph)라는 수단을 통해 정보를 명확하고 효과적으로 전달하는 것이다.' +
'</fieldset>' +
'<br> <br>' +
'<h2></h2><br> <br>' +
'<video width="352" height="288" class="centered" poster="/static/img/ontology.png" preload="none" controls >' +
'<source src="static/mp4/ontology.mp4" type="video/mp4">' +
'</video>' +
'<br>' +
'<br>' +
'</article>' +
'<aside id="sidebar">' +
'<h2>Finding Semantics in Syntactics  </h2>' +
'<p>오른 쪽 그림을 참조해서 시각화가 가진 힘을 실제로 활용해 보시면서 Linked Data가 가진 힘을 느껴보시기 바랍니다.</p>' +
'<p>(1) 아래 그림처럼 왼쪽 상단에 찾고 싶은 키워드 입력 <br>' +
'(2) 한글, 영문 및 한자를 인식하여 자동완성 가능이 있습니다. <br>' +
'(3) 그 아래 Find Relations를 클릭하시면 오른 쪽 창에 관계를 보여줍니다. <br>' +
'(4) 예를들면, 황순원과 장용학을 입력하면 둘 다 같은 저작자이고 와세다대학 출신 이고 등의 관계를 시각적으로 보여줍니다.<br>' +
'(5) 또 황순원을 클릭하면 더 자세한 정보를 왼쪽 아래를 통해서 보여줍니다. 아래 그림을 클릭하셔서 실제로 여러분들이 해 보시는 것이 최고의 방법입니다. <br>' +
'</p>' +
'<figure class="floatleft"><img src="static/img/rel_finder_left.gif" alt="" width="293" height="519" class="floatleft"/>' +
'</figure>' +
'</aside>'
	return $page;
}