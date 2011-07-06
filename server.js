var http = require('http');
var fs = require('fs');

var sys = require('sys');
var exec = require('child_process').exec;
var qs = require('querystring');
var _und = require("underscore");

function filename(){
  return "" + Math.floor(Math.random()*9999999) + ".mp3";
}

function clean(str) {
  try{
    str = str.replace(/['";:]/g,"");
    str = str.replace(/\.+/g,".");
    return str;
  }
  catch(err) {console.log(err); return "";}
}

function cleanup_file(file){
    try{ exec("rm audio/" + file, function(){}); }
    catch(err) {console.log(err); }
}



var app = require('express').createServer();

app.get('/', function(req, res){
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.write(fs.readFileSync('index.html'));
  res.end();
});


app.post('/read', function(request, response){
  var body = '';
  var file = filename();
  request.on('data', function (data) {
    body += data;
  });
  request.on('end', function () {
    var POST = qs.parse(body);
    var callback = function(err,stdout, stderr) {
      response.write("/audio/" + file);
      response.end();
      _und.delay(function(){ cleanup_file(file); },20000);
    };
    exec("echo '" + clean(POST.text) + "' | text2wave | lame -V 1 - audio/" + file, callback);
  });
});


app.get('/audio/*', function(req, res){
  if( req.url.match(/audio\/(\w+\.\w+)/) ) {
    var file = req.url.match(/audio\/(\w+\.\w+)/)[1];
    try{
      fs.readFile('audio/' + file, function(err, data){
        res.send(data, { 'Content-Type': 'audio/mpeg' }, 200 );
      });
    }
    catch(err) {
      console.log(err); 
      res.end();
    }
  }
});


app.listen(1775);


console.log('Server running at http://127.0.0.1:1775/');
