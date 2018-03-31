const http = require('http');
const port = 5000;

const server = http.createServer();

server.on("request", function(request, response){
	response.end();
});

server.listen(port);