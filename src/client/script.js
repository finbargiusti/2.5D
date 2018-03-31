const socket = new WebSocket("ws://" + window.location.host);

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
        
        let x = mainCanvas.width / 2 + player.pos.x,
            y = mainCanvas.height / 2 + player.pos.y;
        
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.TAU);
        ctx.fill();
    }
    
    requestAnimationFrame(render);

}