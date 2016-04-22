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

// function sendName(response, name) {
//   response.writeHead(200, {"Content-Type": "text/html"});
//   response.write('Hello ' + name);
//   response.end();
// }

function parsed(parse, response) {
  if(parse !== null) {
    parse = parse.toLocaleLowerCase()
    if(parse.indexOf('name=') != -1) {
      var name = parse.slice(parse.indexOf("name=")+5);
      if(name.indexOf("&") !== -1){
        name = name.slice(0, name.indexOf("&"));
      }
      var newData = newDataOfIndexHTML(name);
      writeFile(newData);
      sendFile('./index.html', 'text/html', response);
    }else {
      send404(response);
    }
  }else {
    send404(response);
  }
}

function newDataOfIndexHTML(name) {
  return '<!doctype html><html><head><title>'+name
  +'</title><link rel="stylesheet" href="/style.css" type="text/css" /></head><body>hello '+ name
  +'<br><a href="/page.html" type="text/html">page</a><script src="https://code.jquery.com/jquery-2.2.0.min.js"></script></body></html>';
}

function writeFile(data) {
  fs.writeFile('index.html', data, function (err) {
  if (err) return console.log(err);
  console.log('data changed!!');
  });
}

function requestHandler (request, response) {
  var parse = url.parse(request.url);
  if(request.url == '/'){
    var newData = newDataOfIndexHTML("HOME");
    writeFile(newData);
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
