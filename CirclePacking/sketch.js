var circles = [];
var startRadius = 2;
var lineWidth = 2;

function setup() {
    createCanvas(1200, 800);
    circles.push(new Circle(200, 200, 50));
}

function draw() {
    frameRate(30);
    background(230);
    noFill();
    stroke(50);
    strokeWeight(lineWidth);

    let maxAttempts = 10;

    counter = 0;
    do {
        var c = generateCircle();
        counter++;
    } while (c === null && counter < maxAttempts)
    if (c !== null) {
        circles.push(c);
    }
    for (let i = 0; i < circles.length; i++) {
        circles[i].draw();
        circles[i].grow();
    }
}

function generateCircle() {
    let valid = true;
    let newX = random(startRadius, width - startRadius);
    let newY = random(startRadius, height - startRadius);

    for (let i = 0; i < circles.length; i++) {
        // If the new point is too close to another circle, it is not valid
        if (dist(newX, newY, circles[i].x, circles[i].y) + lineWidth < circles[i].radius + startRadius) {
            valid = false;
            break;
        }
    }

    if (valid) {
        return new Circle(newX, newY);
    }
    return null;
}