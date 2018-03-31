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
                        //console.log(players[value.id])
                    } else {
                        const newPlayer = new Player(value.id);
                        newPlayer.redefine(value);
                        
                        addPlayer(newPlayer);
                    }
                }; break;
                case "removePlayer": {
                    delete players[value];
                }; break;
            }
        }
    }
};


Math.TAU = Math.PI * 2;

const players = Object.create(null);

function addPlayer(player) {
    players[player.id] = player;
}

//addPlayer(new Player());

const tickRate = 30;
const tickInterval = 1000 / 30;
let lastTick = window.performance.now();
let cock = 0;

requestAnimationFrame(render);
function render() {
    const now = window.performance.now();
    const difference = now - lastTick;
    
    for (let i = 0; i < Math.floor(difference / tickInterval); i++) {
        for (var id in players) {
            players[id].update();
        }
        
        lastTick += tickInterval;
    }
    
    ctx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
    
    for (let id in players) {
        const player = players[id];

        let canX, canY

        switch (view) {
            case "x": canX = player.pos.y; canY = player.pos.z;
            case "y": canX = player.pos.x; canY = player.pos.z;
            case "z": canX = player.pos.x; canY = player.pos.y;
        }
        
        let x = mainCanvas.width / 2 + canX,
            y = mainCanvas.height / 2 + canY;
        
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.TAU);
        ctx.fill();
    }
    
    requestAnimationFrame(render);
}

// function requestMove(direction) {
//     switch (view) {
//         case "x": {
//             if (direction == "left"){
//                 players[0].pos.addVector(new Vector3D(0, -5, 0));
//             }
//             if (direction == "right"){
//                 players[0].pos.addVector(new Vector3D(0, 5, 0));
//             }
//         };
//         case "y": {
//             if (direction == "left"){
//                 players[0].pos.addVector(new Vector3D(0, -5, 0));
//             }
//             if (direction == "right"){
//                 players[0].pos.addVector(new Vector3D(0, 5, 0));
//             }
//         };
//         case "z": {
//             if (direction == "left"){
//                 players[0].pos.addVector(new Vector3D(0, -5, 0));
//             }
//             if (direction == "right"){
//                 players[0].pos.addVector(new Vector3D(0, 5, 0));
//             }
//         };
//     }
// } 


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
            break;
        };
        case 68: {
            currControls.horizontal = 1;
            socket.send(clientCommands.encode([
                    {
                        key: "updateControls",
                        value: currControls
                    }
            ]));
            break;
        };
        case 87: {
            currControls.vertical = 1;
            socket.send(clientCommands.encode([
                    {
                        key: "updateControls",
                        value: currControls
                    }
            ]));
            break;
        };
        case 83: {
            currControls.vertical = -1;
            socket.send(clientCommands.encode([
                    {
                        key: "updateControls",
                        value: currControls
                    }
            ]));
            break;
        };
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
            break;
        };
        case 87: case 83: {
            currControls.vertical = 0;
            socket.send(clientCommands.encode([
                    {
                        key: "updateControls",
                        value: currControls
                    }
            ]));
            break;
        };
    }
});


// finbar code tm

