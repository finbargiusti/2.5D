const socket = new WebSocket("ws://" + window.location.host);


let view = "x";


socket.onopen = function() {
    socket.onmessage = function(e) {
        const serverCommand = serverCommands.decode(e.data);
        
        for (let i = 0; i < serverCommand.length; i++) {
            const key = serverCommand[i].key;
            const value = serverCommand[i].value;
            
            switch (key) {
                case "sendPlayer": {
                    if (players[value.id]) {
                        players[value.id].redefine(value);
                        players[value.id].point.p.x = value.pos.x
                        players[value.id].point.p.y = value.pos.y
                        players[value.id].point.p.z = value.pos.z
                    } else {
                        let ppoint = new Engine.Point(new Engine.V(value.pos.x, value.pos.y, value.pos.z+20), "hsl("+value.id * 50+", 100%, 50%)");
                        const newPlayer = new Player(value.id, ppoint);
                        newPlayer.redefine(value);
                        
                        addPlayer(newPlayer);
                    }
                }; break;
                case "removePlayer": {
                    delete players[value];
                }; break;
                case "changePerspective": {
                    view = value;
                    document.getElementById("view").innerHTML = view;
                }; break;
            }
        }
    }
};


Math.TAU = Math.PI * 2;

const players = Object.create(null);

function addPlayer(player) {
    players[player.id] = player;
    scene.objects.push(players[player.id].point)
}

//addPlayer(new Player());

const tickRate = 30;
const tickInterval = 1000 / 30;
let lastTick = window.performance.now();
let cock = 0;

requestAnimationFrame(render);
function render() {
    mainCanvas.width = window.innerWidth;
    mainCanvas.height = window.innerHeight;
    const now = window.performance.now();
    const difference = now - lastTick;
    
    for (let i = 0; i < Math.floor(difference / tickInterval); i++) {
        for (var id in players) {
            players[id].update();
        }

        if (view === "x") {
            if (scene.camera.rotUp > (0.04)) {
                scene.camera.rotUp -= Math.min(0.015, -0.04 + scene.camera.rotUp);
            } else if (scene.camera.rotUp < (0.04)) {
                scene.camera.rotUp += Math.min(0.015, Math.abs(0.04 - scene.camera.rotUp));
            }
            if (scene.camera.rotZ > 0) {
                scene.camera.rotZ -= Math.min(0.015, scene.camera.rotZ);
            } else if (scene.camera.rotZ < 0) {
                scene.camera.rotZ += Math.min(0.015, Math.abs(scene.camera.rotZ));
            }
        }
        if (view === "y") {
            if (scene.camera.rotUp > 0) {
                scene.camera.rotUp -= Math.min(0.015, scene.camera.rotUp);
            } else if (scene.camera.rotUp < 0) {
                scene.camera.rotUp += Math.min(0.015, Math.abs(scene.camera.rotUp));
            }
            if (scene.camera.rotZ > (Math.PI / 2)) {
                scene.camera.rotZ -= Math.min(0.015, Math.PI / 2 - scene.camera.rotZ);
            } else if (scene.camera.rotZ < (Math.PI / 2)) {
                scene.camera.rotZ += Math.min(0.015, Math.abs(Math.PI / 2 - scene.camera.rotZ));
            }
        }
        if (view === "z") {
            if (scene.camera.rotUp > (Math.PI / 2)) {
                scene.camera.rotUp -= Math.min(0.015, Math.PI /2 - scene.camera.rotUp);
            } else if (scene.camera.rotUp < (Math.PI / 2)) {
                scene.camera.rotUp += Math.min(0.015, Math.abs(Math.PI / 2 - scene.camera.rotUp));
            }
            if (scene.camera.rotZ > (0)) {
                scene.camera.rotZ -= Math.min(0.015, scene.camera.rotZ);
            } else if (scene.camera.rotZ < (0)) {
                scene.camera.rotZ += Math.min(0.015, Math.abs(  scene.camera.rotZ));
            }
        }
        
        lastTick += tickInterval;
    }
    
    ctx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);

    scene.render(ctx);
    
    requestAnimationFrame(render);
}


let currControls = {horizontal:0, vertical:0};

let lastKeyCode = undefined;

window.addEventListener("keydown", (e) => {

    if (e.keyCode == lastKeyCode) return false;
    lastKeyCode = e.keyCode;

    console.log(e.keyCode) // A: 65, D: 68
    switch (e.keyCode)  {
        case 65: {
            currControls.horizontal = -1;
            socket.send(clientCommands.encode([
                    {
                        key: "updateControls",
                        value: currControls
                    }
            ]));
        }; break;
        case 68: {
            currControls.horizontal = 1;
            socket.send(clientCommands.encode([
                    {
                        key: "updateControls",
                        value: currControls
                    }
            ]));
        }; break;
        case 87: {
            currControls.vertical = 1;
            socket.send(clientCommands.encode([
                    {
                        key: "updateControls",
                        value: currControls
                    }
            ]));
        }; break;
        case 83: {
            currControls.vertical = -1;
            socket.send(clientCommands.encode([
                    {
                        key: "updateControls",
                        value: currControls
                    }
            ]));
        }; break;
        case 81: {
            socket.send(clientCommands.encode([{key: "togglePerspective"}]));
        }; break;
    }
});

window.addEventListener("keyup", (e) => {

    lastKeyCode = undefined;
    
    switch (e.keyCode)  {
        case 65: case 68: {
            currControls.horizontal = 0;
            socket.send(clientCommands.encode([
                    {
                        key: "updateControls",
                        value: currControls
                    }
            ]));
        }; break;
        case 87: case 83: {
            currControls.vertical = 0;
            socket.send(clientCommands.encode([
                    {
                        key: "updateControls",
                        value: currControls
                    }
            ]));
        }; break;
    }
});


let scene = new Engine.Scene();

let colorarray = ["red","blue","green","orange","purple","pink"]

scene.camera.rotUp = Math.PI / 2 

scene.objects.push(new Engine.Cuboid(new Engine.V(-300, -300, -5), new Engine.V(300, 300, -20), colorarray))
