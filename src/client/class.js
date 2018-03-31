class Player {
    constructor(id) {
        this.id = id;
        this.pos = new Vector3D(0, 0, 0);
        this.vel = new Vector3D(0, 0, 0);
        this.controls = {
            horizontal: 0,
            vertical: 0
        };
    }
    
    redefine(playerData) {
        this.pos.override(playerData.pos);
        this.vel.override(playerData.vel);
        this.controls = playerData.controls;
    }
    
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
