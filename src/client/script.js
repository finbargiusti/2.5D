Math.TAU = Math.PI * 2;

const mainCanvas = document.getElementById("mainCanvas");
const ctx = mainCanvas.getContext("2d");

class Player {
    constructor() {
        this.pos = new Vector3D(0, 0, 0);
    }
}

class Vector3D {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}

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
        
        let x = mainCanvas.width / 2 + player.pos.x,
            y = mainCanvas.height / 2 + player.pos.y;
        
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.TAU);
        ctx.fill();
    }
    
    requestAnimationFrame(render);
}