class Player {
    constructor(id) {
        this.id = id;
        this.pos = new Vector3D(0, 0, 0);
        this.vel = new Vector3D(0, 0, 0);
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
}
