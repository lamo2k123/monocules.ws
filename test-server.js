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

    socket.on('tested', function(data) {
        socket.emit('tested:' + data.uid, {error : null, data : { test : 1}})
        console.log('NO NAMESPACE');
    });

});

io.of('/my-space').on('connection', function(socket){
    socket.on('tested', function(data) {
        socket.emit('tested:' + data.uid, {error : null, data : { test : 99999999999}})
        console.log('NAMESPACE');
    });

});

io.listen(3000);
