//process.setuid('ubuntu');
fs = require('fs');
util = require('util');
express = require("express");
basicAuth = require('basic-auth-connect');
multer  = require('multer');

$app = express();

$upload = require("./upload.js");

//File Parser
$app.use(multer({ dest: './'}));
// Authenticator
$app.use(basicAuth(function(user, pass, callback) {
 var result = (user === 'luizin' && pass === 'luizluiz') || (user === 'mdcho' && pass === '1010');
 callback(null /* error */, result);
}));

$app.get('/upload', function(req, res) {
 $upload(req,false,function($res){
 	res.send($res);
 });
});

$app.post('/upload', function(req, res) {
 $upload(req,true,function($res){
 	res.send($res);
 });
});

$app.listen(8081);