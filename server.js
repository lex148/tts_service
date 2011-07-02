var http = require('http');
var fs = require('fs');

var sys = require('sys');
var exec = require('child_process').exec;
var qs = require('querystring');

function filename(){
  return "" + Math.floor(Math.random()*9999999) + ".mp3";
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
      exec("rm audio/" + file, function(){});
    };
    exec("echo 'this is a test' | text2wave | lame -V 1 - audio/" + file, callback);
  });
});


app.get('/media/*', function(req, res){
  if( req.url.match(/media\/(\w+\.\w+)/) ) {
    var file = req.url.match(/media\/(\w+\.\w+)/)[1];
    try{
      res.writeHead(200, {'Content-Type': 'audio/mpeg'});
      res.write(fs.readFileSync('media/' +  file));
    }
    catch(err) {console.log(err); }
  }
  res.end();
});

app.listen(1337);

//var server = http.createServer(
//  function (request, response) {
//  if (request.method == 'POST') {
//    var body = '';
//    var file = filename();
//    request.on('data', function (data) {
//      body += data;
//    });
//    request.on('end', function () {
//      var POST = qs.parse(body);
//      var callback = function(err,stdout, stderr)
//      {
//        sys.puts(stdout); 
//        response.writeHead(200, {'Content-Type': 'audio/mpeg'});
//        response.write(fs.readFileSync(file));
//        response.end();
//        exec("rm " + file, function(){});
//      };
//      exec("echo 'this is a test' | text2wave | lame -V 1 - " + file, callback);
//    });
//  }
//  else {
//    request.on('end', function () {
//      response.writeHead(200, {'Content-Type': 'text/html'});
//      response.write(fs.readFileSync('index.html'));
//      response.end();
//    });
//  }
//}
//).listen(1337);



console.log('Server running at http://127.0.0.1:1337/');
