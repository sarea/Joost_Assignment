var http = require("http");
var fs = require('fs');
var url = require('url');

function sendFile(path, mimeType, response) {
  fs.readFile(path, 'utf8', function(error, data) {
    if(error){
      response.writeHead(500);
      response.write('could not open file');
    }else {
      response.writeHead(200, {"Content-type": mimeType});
      response.write(data);
    }
    response.end();
  });
}

function send404(response) {
  response.writeHead(404);
  response.write("error 404 page not found");
  response.end();
}

function sendName(response, name) {
  response.writeHead(200, {"Content-Type": "text/html"});
  response.write('Hello ' + name);
  response.end();
}

function parsed(parse, response) {
  parse = parse.toLocaleLowerCase()
  if(parse.indexOf('name=') != -1){
    var name = parse.slice(parse.indexOf("name=")+5);
    name = name.slice(0, name.indexOf("&"));
    sendName(response, name);
  }else {
    send404(response);
  }
}

function requestHandler (request, response) {
  var parse = url.parse(request.url);
  if(request.url == '/'){
    sendFile('./index.html', 'text/html', response);
  }else if(request.url == '/style.css'){
    sendFile('./style.css', 'text/css', response);
  }else if(request.url == '/page.html'){
    sendFile('./page.html', 'text/html', response);
  }else {
    parsed(parse.query , response);
  }
}


var server = http.createServer(requestHandler);
server.listen(8080, function (error) {
  if(error){
    console.log(error);
  }else {
    console.log("listening on port 8080");
  }
});
