const socket = new WebSocket("ws://" + window.location.host);

let view = "x";

Math.TAU = Math.PI * 2;

let lastPlayerId = 0;
const players = Object.create(null);

function addPlayer(player) {
    players[lastPlayerId++] = player;
}

addPlayer(new Player());

requestAnimationFrame(render);
function render() {
    
    
    ctx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
    
    for (let id in players) {
        const player = players[id];

        let canX, canY

        switch (view) {
            case "x": canX = player.pos.y; canY = player.pos.z;
        }
        
        let x = mainCanvas.width / 2 + canX,
            y = mainCanvas.height / 2 + canY;
        
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.TAU);
        ctx.fill();
    }
    
    requestAnimationFrame(render);
}

function requestMove(direction) {
    switch (view) {
        case "x": {
            if (direction == "left"){
                players[0].pos.addVector(new Vector3D(0, -5, 0));
            }
            if (direction == "right"){
                players[0].pos.addVector(new Vector3D(0, 5, 0));
            }
        };
        case "y": {
            if (direction == "left"){
                players[0].pos.addVector(new Vector3D(0, -5, 0));
            }
            if (direction == "right"){
                players[0].pos.addVector(new Vector3D(0, 5, 0));
            }
        };
        case "z": {
            if (direction == "left"){
                players[0].pos.addVector(new Vector3D(0, -5, 0));
            }
            if (direction == "right"){
                players[0].pos.addVector(new Vector3D(0, 5, 0));
            }
        };
    }
} 

window.addEventListener("keydown", (e) => {
    console.log(e.keyCode) // A: 65, D: 68
    
    switch (e.keyCode)  {
        case 65: {
            requestMove("left")
            break;
        };
        case 68: {
            requestMove("right")
            break;
        };
    }
})  ;