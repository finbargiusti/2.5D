const http = require('http');
const port = 5000;
const url = require("url");
const fs = require("fs");
const WebSocketServer = require("websocket").server;
const binary = require("./binary_min.js");
eval(fs.readFileSync(__dirname + "/../client/data_structures.js").toString());

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

wsServer.on("connect", (socket) => {
    const thisId = lastSocketId++;
    
    sockets[thisId] = socket;
    players[thisId] = new Player(thisId);
    
    const arr = [];
    for (let id in players) {
        arr.push({
            key: "sendPlayer",
            value: players[id]
        });
    }
    
    sendToEveryone(serverCommands.encode(arr));
    
    socket.on("message", (event) => {
        const msg = event.utf8Data;

        const clientCommand = clientCommands.decode(msg);

        for (let i = 0; i < clientCommand.length; ++i) {
        	const key = clientCommand[i].key
        	const value = clientCommand[i].value

        	switch(key) {
        		case "updateControls": {
        			players[thisId].controls = value;
                    players[thisId].updated = true;
                    
			        /*sendToEveryone(serverCommands.encode([{
			            key: "sendPlayer",
			            value: players[thisId]
			        }]));*/
        		}; break;
        	}
        }
    });
    
    socket.on("close", () => {
        delete sockets[thisId];
        delete players[thisId];
        
        sendToEveryone(serverCommands.encode([{
            key: "removePlayer",
            value: thisId
        }]));
    });
});

function sendToEveryone(msg) {
    for (var id in sockets) {
        sockets[id].send(msg);
    }
}

let lastSocketId = 0;
const sockets = Object.create(null);
const players = Object.create(null);
let view = "x";

const tickRate = 30;
const tickInterval = 1000 / tickRate;
let lastTick = now();

let tick = 0;

setInterval(() => {
    const nowNow = now();
    const difference = nowNow - lastTick;
    
    for (let i = 0; i < Math.floor(difference / tickInterval); i++) {
        for (let id in players) {
            players[id].update();
        }
        
        lastTick += tickInterval;
    }
}, 0);

function now() {
    const hrtime = process.hrtime();
    
    return (hrtime[0] + hrtime[1] * 1e-9) * 1000;
}


















class Player {
    constructor(id) {
        this.id = id;
        this.pos = new Vector3D(Math.random() * 150 - 75, 0, 0);
        this.vel = new Vector3D(0, 0, 0);
        this.controls = {
            horizontal: 0,
            vertical: 0
        };
        this.updated = false;
    };
    
    update() {
        if (view === "x") {
            if (Math.abs(this.controls.horizontal) === 1) {
                this.vel.y = sharedValues.playerMovementVelocity * this.controls.horizontal;
            } else {
                //this.vel.y -= 10 * Math.sign(this.vel.y);
                this.vel.y = 0;
            }
        }
        
        const newVector = new Vector3D();
        newVector.override(this.vel);
        newVector.scale(1 / tickRate);
        
        if (this.updated) {
            sendToEveryone(serverCommands.encode([{
                key: "sendPlayer",
                value: this
            }]));
            
            this.updated = false;
        }
        
        this.pos.addVector(newVector);
    }
}

class Vector3D {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    
    addVector(v2) {
        this.x += v2.x;
        this.y += v2.y;
        this.z += v2.z;
    }
    
    scale(scalar) {
        this.x *= scalar;
        this.y *= scalar;
        this.z *= scalar;
    }
    
    getLength() {
        return Math.sqrt(this.x*this.x + this.y*this.y + this.z*this.z);
    }
    
    override(v2) {
        this.x = v2.x;
        this.y = v2.y;
        this.z = v2.z;
    }
}