var util = require('util');
var url = require('url');
var fs = require('fs');
var request = require('request');
var xmlParser = require('xmldoc');
var cache = false;
module.exports = function($scope,$req,cb){
	var objs = [];
	if(!$req.body["uri"]){
		cb(JSON.stringify([{error:0}]));
		return;
	}
	try{
		var uriHost = url.parse($req.body["uri"])['host'].toLowerCase();
		var allowedHosts = ['lod.nl.go.kr'];
		if(allowedHosts.indexOf(uriHost) == -1){
			cb(JSON.stringify([{error:1}]));
			return;
		}
		var ResId = url.parse($req.body["uri"])['pathname'].split('/').pop();
		var fName = 'remoteLODJson/' + uriHost + "_" + ResId +".json";
		if(fs.existsSync(fName)){
			cb(fs.readFileSync(fName));
			return;
		}else{
			var fetchMask = {
				'lod.nl.go.kr': {
					remote: 'http://lod.nl.go.kr/data/#ID#?output=xml',
					resource: 'http://lod.nl.go.kr/resource/#ID#'
				}
			};
			request(fetchMask[uriHost].remote.replace("#ID#", ResId), function (error, response, body) {
			  if (!error && response.statusCode == 200) {
				  var Parser = new xmlParser.XmlDocument(body);
				  var xmlObj = Parser.childNamed('bibo:Book');
				  var tFormat = "Book";
				  if(!xmlObj){
					  xmlObj = 	Parser.childNamed('rdf:Description').childNamed('foaf:primaryTopic');					  
					  		if(!xmlObj){
						  				cb(JSON.stringify([{error:7,exception:"Unknown remote format"}]));
						  				return;
					  		}
					  	if(xmlObj.childNamed("nlon:OnlineMaterial")){
						  	xmlObj = xmlObj.childNamed("nlon:OnlineMaterial");
					  	}else{
						  	xmlObj = xmlObj.childNamed("bibo:Book");
					  	}
					  	if(!xmlObj){
						  				cb(JSON.stringify([{error:8,exception:"Non-parseable remote format"}]));
						  				return;
					  		}
					  	
					  delete tFormat;
				  }
				  
				  console.log(Parser);
				  
				  var rdata = JSON.stringify([{
					  pic:				'<img style="margin-top:10px;" height="50" width="50"/>',
					  title: 			xmlObj.childNamed('rdfs:label') ?xmlObj.childNamed('rdfs:label').val : null,
					  uri: fetchMask[uriHost].resource.replace("#ID#", ResId),
					  author: 			xmlObj.childNamed('dc:creator') ? xmlObj.childNamed('dc:creator').val :null,
					  place:			xmlObj.childNamed('nlon:publicationPlace') ?xmlObj.childNamed('nlon:publicationPlace').val : null,
					  publisher:	xmlObj.childNamed('dc:publisher') ? xmlObj.childNamed('dc:publisher').val : null,
					  issued:			xmlObj.childNamed('dcterms:issued') ? xmlObj.childNamed('dcterms:issued').val : null,
					  format:			tFormat ? tFormat : (xmlObj.childNamed('nlon:typeOfResource') ? (xmlObj.childNamed('nlon:typeOfResource').attr['rdf:resource'] ? $scope.filterAttrName(xmlObj.childNamed('nlon:typeOfResource').attr['rdf:resource']) : null)  : null),
					  localHolding:		xmlObj.childNamed('nlon:holdingInstitution') ? xmlObj.childNamed('nlon:holdingInstitution').val : null,
					  isbn:				xmlObj.childNamed('bibo:isbn') ? xmlObj.childNamed('bibo:isbn').val : null
				  }]);
				  fs.writeFileSync(fName,rdata);
				  cb(rdata);
				  return;
			  }else{
				  cb(JSON.stringify([{error:2}]));
				  return;
			  }
			});
		}
	}catch(e){
		console.log(JSON.stringify([{error:3,exception:e.stack}]));
		cb(JSON.stringify([{error:3,exception:e.stack}]));
		return;
	}

}