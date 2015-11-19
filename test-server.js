var io = require('socket.io')();

var http = require('http'),
    fs = require('fs');

http.createServer(function(request, response) {
    if(request.url === "/index.html"){
        fs.readFile("index.html", function (err, data) {
            response.writeHead(200, {'Content-Type': 'text/html'});
            response.write(data);
            response.end();
        });
    } else if(request.url === "/index.js") {
        fs.readFile("index.js", function (err, data) {
            response.writeHead(200, {'Content-Type': 'text/javascript'});
            response.write(data);
            response.end();
        });
    }
}).listen(80);


io.on('connection', function(socket){
    console.log('11111111', socket);

    socket.on('test', function (data) {
        console.log(data);
    });
});

io.listen(3000);