const triangles = [];

function setup() {
    createCanvas(900, 900);

    triangles.push(new Triangle(0, 0, random(20, 80), random(20, 80), random(20, 80), random(20, 80)));

    let finished = false;
    while (!finished) {
        const lastTriangle = triangles[triangles.length - 1];

        const x1 = lastTriangle.x2;
        const y1 = lastTriangle.y2;
        const x2 = lastTriangle.x2 + random(-20, 80);
        const y2 = lastTriangle.y2 + random(-20, 80);
        const x3 = lastTriangle.x3 + random(-20, 80);
        const y3 = lastTriangle.y3 + random(-20, 80);

        if (max(x1, y1, x2, y2, x3, y3) >= 900) {
            finished = true;
        }
        
        triangles.push(new Triangle(x1, y1, x2, y2, x3, y3));
    }
}

function draw() {
    background(200, 230, 255);

    for (const triangle of triangles) {
        triangle.render();
    }
}