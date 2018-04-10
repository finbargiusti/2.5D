class Player {
    constructor(id, point) {
        this.id = id;
        this.pos = new Vector3D(0, 0, 0);
        this.vel = new Vector3D(0, 0, 0);
        this.controls = {
            horizontal: 0,
            vertical: 0
        };
        this.point = point;
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
                this.vel.y -= 10 * Math.sign(this.vel.y);
            }
            if (this.controls.vertical === 1) {
                if (this.pos.z === 0) {
                    this.vel.z = 100;
                }
            }
        } else if (view === "y") {
            if (Math.abs(this.controls.horizontal) === 1) {
                this.vel.x = sharedValues.playerMovementVelocity * this.controls.horizontal;
            } else {
                this.vel.x -= 10 * Math.sign(this.vel.x);
            }
            if (this.controls.vertical === 1) {
                if (this.pos.z === 0) {
                    this.vel.z = 100;
                }
            }
        } else if (view === "z") {
            if (Math.abs(this.controls.horizontal) === 1) {
                this.vel.y = sharedValues.playerMovementVelocity * this.controls.horizontal;
            } else {
                this.vel.y -= 10 * Math.sign(this.vel.y);
           }
            
            if (Math.abs(this.controls.vertical) === 1) {
                this.vel.x = sharedValues.playerMovementVelocity * this.controls.vertical;
            } else {
                this.vel.x -= 10 * Math.sign(this.vel.x);
            }
        }

        
        const newVector = new Vector3D();
        newVector.override(this.vel);
        newVector.scale(1 / tickRate);
        this.pos.addVector(newVector);
        this.point.p.override(this.pos)

        if (this.pos.z > 0) {
            this.vel.z -= 5;
        } else {
            this.pos.z = 0;
        }
        
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
