var spawn = require('child_process').spawn;
var fs = require('fs');
module.exports = function(req,post,cb){
	var $canCb = true;
	var $sites =
	{
		academy:
			{
				label: "Academy",
				phonesJsonPath: "/var/www/html/node/phones.json",
				rdfPath: "/var/www/html/app/phones/rdf.rdf",
				appName: "app"
			},
			act:
			{
				label: "ACT",
				phonesJsonPath: "/var/www/act/node/phones.json",
				rdfPath: "/var/www/act/app/phones/rdf.rdf",
				appName: "act"
			}//,
/*		library:
			{
				label: "Library",
				phonesJsonPath: "/var/www/library/node/phones.json",
				rdfPath: "/var/www/library/app/phones/rdf.rdf",
				appName: "app_library"
			}
*/	}
	var $page = '';
	if(post) {
		$canCb = false;
		if(req.files.rdfFile && req.files.rdfFile.mimetype == 'application/rdf+xml' && req.body.site && $sites[req.body.site]){
			var py  = spawn('python', ['rdf2json.py',req.files.rdfFile.name,$sites[req.body.site].phonesJsonPath]);

			py.on('close', function (code, signal) {
				if(fs.existsSync($sites[req.body.site].rdfPath)){
					fs.unlinkSync($sites[req.body.site].rdfPath);
				}
				fs.rename(req.files.rdfFile.name, $sites[req.body.site].rdfPath, function(){
					var fuseki_down  = spawn('sudo', ['stop','fuseki']);
					fuseki_down.on('close', function (code, signal) {
						var fuseki_up  = spawn('sudo', ['start','fuseki']);
						fuseki_up.on('close', function (code, signal) {
							var pm2  = spawn('sudo', ['pm2','restart',$sites[req.body.site].appName]);
							pm2.on('close', function (code, signal) {
								cb($page + $page_);
							});
						});
					});
				});
			});
			
			$page += '<div>Success! Restarting services... Please allow up to a minute to the changes take effect.</div>';
		}else{s
			for(var $file in req.files){
				fs.unlinkSync(req.files[$file].name);
			}
			$page += '<div>Please try again.</div>';
			$canCb = true;
		}
	}
	var $page_ = 
	'<form method="post" enctype="multipart/form-data">'+
	'<div>Site:<select name="site">';
	for($key in $sites){
		$page_ += '<option value="' + $key +'">' + $sites[$key].label + '</option>';
	}
    $page_ += '</select></div>' +
	'<div>RDF File:<input type="file" name="rdfFile" /></div>'+
	'<input type="submit">'
	'</form>';
	
	$canCb && cb($page + $page_);
}
