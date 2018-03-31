const http = require('http');
const port = 5000;
const url = require("url");
const fs = require("fs");
const WebSocketServer = require("websocket").server;

const server = http.createServer();

server.on("request", function(request, response){
    const parsedURL = url.parse(request.url);
    let path = parsedURL.path;
    
    if (path === "/") path += "index.html";
    
    fs.readFile(__dirname + "/../client" + path, (err, data) => {
        if (!err) {
            response.end(data.toString());
        } else {
            response.end("404");
        }
    });
});

server.listen(port);

const wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: true
});

wsServer.on("connect", function() {
    console.log("Cunt");
});