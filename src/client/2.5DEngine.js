(function() {
    class Scene {
        constructor() {
            this.objects = [];
            this.camera = new Camera();
            this.showAxes = false;
        }

        project(v) {
            const x = mainCanvas.width/2 + v.y * Math.cos(this.camera.rotZ) + v.x * Math.sin(this.camera.rotZ),
                  y = mainCanvas.height/2 - v.z * Math.cos(this.camera.rotUp) - (v.x * Math.cos(this.camera.rotZ) - v.y * Math.sin(this.camera.rotZ)) * Math.sin(this.camera.rotUp);

            return {x: x, y: y};
        }

        render(ctx) {
            const cameraVector = new Vector3D(-Math.cos(this.camera.rotZ) * Math.cos(this.camera.rotUp), Math.sin(this.camera.rotZ) * Math.cos(this.camera.rotUp), Math.sin(this.camera.rotUp));
            const processedObjects = [];

            for (let i = 0; i < this.objects.length; i++) {
                const object = this.objects[i];

                if (object.constructor.name === "Point") {
                    processedObjects.push(new ProcessedPoint(object, cameraVector));
                } else if (object.constructor.name === "Cuboid") {
                    const faces = object.getFaces();
                    for (let j = 0; j < faces.length; j++) {
                        processedObjects.push(new ProcessedFace(faces[j], cameraVector));
                    }
                }

            processedObjects.sort(function(a, b) {
                
                if (a.constructor.name === "ProcessedPoint" && b.constructor.name === "ProcessedPoint") {
                    return a.dotProduct - b.dotProduct;
                } else if (a.constructor.name === "ProcessedFace" && b.constructor.name === "ProcessedFace") {
                    let aCount = 0,
                        bCount = 0;

                    if (a.dotProducts[0] > b.dotProducts[0]) aCount++; else if (a.dotProducts[0] < b.dotProducts[0]) bCount++;
                    if (a.dotProducts[1] > b.dotProducts[1]) aCount++; else if (a.dotProducts[1] < b.dotProducts[1]) bCount++;
                    if (a.dotProducts[2] > b.dotProducts[2]) aCount++; else if (a.dotProducts[2] < b.dotProducts[2]) bCount++;

                    let sum1 = a.dotProducts[0] + a.dotProducts[1] + a.dotProducts[2],
                        sum2 = b.dotProducts[0] + b.dotProducts[1] + b.dotProducts[2];

                    let min1 = Math.min(Math.min(a.dotProducts[0], a.dotProducts[1]), a.dotProducts[2]),
                        min2 = Math.min(Math.min(b.dotProducts[0], b.dotProducts[1]), b.dotProducts[2]);


                    //return min1 - min2;
                    //return sum1 - sum2;
                    return aCount - bCount;
                } else if (a.constructor.name === "ProcessedFace" && b.constructor.name === "ProcessedPoint" || b.constructor.name === "ProcessedFace" && a.constructor.name === "ProcessedPoint") {
                    if (a.constructor.name === "ProcessedFace") {
                        return -1;
                    } else {
                        return 1;
                    }
                }
            });

            for (let i = 0; i < processedObjects.length; i++) {
                if (processedObjects[i].constructor.name === "ProcessedPoint") {
                    const point = processedObjects[i].point;
                    
                    const p = this.project(point.p);
                    
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
                    ctx.fillStyle = point.material;
                    ctx.fill();
                } else if (processedObjects[i].constructor.name === "ProcessedFace") {
                    
                    const face = processedObjects[i].face;

                    const p1 = this.project(face.p1),
                          p2 = this.project(face.p2),
                          p3 = this.project(face.p3);

                    

                    /*
                    const v1 = face.p2.makeCopy(),
                          v2 = face.p3.makeCopy();

                    v1.subtractPoint(face.p1);
                    v2.subtractPoint(face.p1);

                    const crossProduct = v1.crossProduct(v2);
                    console.log(crossProduct)

                    const dotProduct = crossProduct.dotProduct(lightSource) / crossProduct.getMagnitude();

                    //console.log(dotProduct)

                    */

                    
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.lineTo(p3.x, p3.y);
                    ctx.closePath();
                    ctx.fillStyle = face.material;
                    ctx.fill();
                    
                }
                
                
                /*
                ctx.lineWidth = 2;
                ctx.strokeStyle = face.material;
                ctx.stroke();*/
            }
            
            /*
            for (let i = 0; i < this.objects.length; i++) {
                const object = this.objects[i];
                
                if (object.constructor.name === "Point") {
                    const p = this.project(object.p);
                    
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
                    ctx.fillStyle = object.material;
                    ctx.fill();
                } else if (object.constructor.name === "Line") {
                    const p1 = this.project(object.p1),
                          p2 = this.project(object.p2);
                    
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y)
                    ctx.lineWidth = 2;
                    ctx.strokeStyle = object.material;
                    ctx.stroke();
                }
            }
            */
            
            if (this.showAxes) {
                // TODO
            }
        }
    }
}

    class V {
        constructor(x, y, z) {
            return new Vector3D(x, y, z);
        }
    }

    class Vector3D {
        constructor(x, y, z) {
            this.x = x;
            this.y = y;
            this.z = z;
        }

        makeCopy() {
            return new Vector3D(this.x, this.y, this.z);
        }

        subtractVector(v2) {
            this.x -= v2.x;
            this.y -= v2.y;
            this.z -= v2.z;
        }

        crossProduct(v2) {
            return new Vector3D(this.y * v2.z - v2.y * this.z, this.z * v2.x - v2.z * this.x, this.x * v2.y - v2.x * this.y);
        }

        dotProduct(v2) {
            return this.x * v2.x + this.y * v2.y + this.z * v2.z;
        }

        getMagnitude() {
            return Math.sqrt(this.x*this.x + this.y*this.y + this.z*this.z);
        }
        override(v2) {
            this.x = v2.x;
            this.y = v2.y;
            this.z = v2.z;
        }
    }

    class Camera {
        constructor() {
            this.rotZ = 0;
            this.rotUp = 0;
        }
    }
    
    class Point {
        constructor(p, material) {
            this.p = p;
            this.material = material;
        }
    }
    
    class ProcessedPoint {
        constructor(point, cameraVector) {
            //console.log(cameraVector)
            
            this.dotProduct = point.p.dotProduct(cameraVector);
            this.point = point;
            //console.log(this)
        }
    }
    
    class Line {
        constructor(p1, p2, material) {
            this.p1 = p1;
            this.p2 = p2;
            this.material = material;
        }
    }

    class Cuboid {
        constructor(p1, p2, sideMaterials) {
            this.p1 = p1;
            this.p2 = p2;
            this.sideMaterials = sideMaterials;
        }

        getFaces() {
            const faces = [];

            for (let i = 0; i < 6; i++) {
                //if (!(i === 1 || i === 4 || i === 3)) continue;
                
                let c1 = this.p1.makeCopy(),
                    c2 = this.p2.makeCopy(),
                    dimension = ["x", "y", "z"][Math.floor(i / 2)];

                if (i % 2 === 1) {
                    const temp = c1;
                    c1 = c2;
                    c2 = temp;
                }

                c1[dimension] = c2[dimension];

                let dimension2 = "x";
                if (dimension === "x") dimension2 = "y";
                else if (dimension === "y") dimension2 = "z";

                for (let j = 0; j < 2; j++) {
                    let c3;
                    if (j === 0) {
                        c3 = c1.makeCopy();
                        c3[dimension2] = c2[dimension2];
                    } else {
                        c3 = c2.makeCopy();
                        c3[dimension2] = c1[dimension2];
                    }

                    faces.push(new Face(c1, c2, c3, this.sideMaterials[i]));
                }
            }

            return faces;
            console.log(faces);
        }
    }

    class Face {
        constructor(p1, p2, p3, material) {
            this.p1 = p1;
            this.p2 = p2;
            this.p3 = p3;
            this.material = material;
        }
    }

    class ProcessedFace {
        constructor(face, cameraVector) {
            const dotProductP1 = face.p1.x * cameraVector.x + face.p1.y * cameraVector.y + face.p1.z * cameraVector.z,
                  dotProductP2 = face.p2.x * cameraVector.x + face.p2.y * cameraVector.y + face.p2.z * cameraVector.z,
                  dotProductP3 = face.p3.x * cameraVector.x + face.p3.y * cameraVector.y + face.p3.z * cameraVector.z

            // const biggestDotProduct = Math.max(Math.max(dotProductP1, dotProductP2), dotProductP3);

            this.dotProducts = [dotProductP1, dotProductP2, dotProductP3].sort(function(a, b) {return a-b});
            //console.log(this.dotProducts)
            this.face = face;
        }
    }
    
    
    window.Engine = {
        Scene: Scene,
        V: V,
        Cuboid: Cuboid,
        Point: Point,
        Line: Line
    };
})();