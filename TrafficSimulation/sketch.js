/// <reference path="../lib/p5.global-mode.d.ts" />

var drawing = null;
var drawingLanes = 2;
var pointsDrawn = [];

var roads = [];
var cars = [];

function setup() {
    createCanvas(windowWidth - 20, windowHeight - 20);

    drawing = null;
    pointsDrawn = [];
}

function draw() {
    frameRate(30);
    background(200);

    // Roads
    for (let road of roads) {
        road.render();
    }

    // Cars
    for (let car of cars) {
        car.tick();
        car.render();
    }

    // Text overlay
    fill(0);
    strokeWeight(0);
    textSize(18);
    textAlign(LEFT, TOP);
    if (drawing) {
        text(`Tool: ${drawing}`, 20, 20);
        if (drawing === "road") {
            text(`Lanes: ${drawingLanes}`, 20, 45);
        }
    }
}

function mouseClicked() {
    if (drawing === "road") {
        pointsDrawn.push(createVector(mouseX, mouseY));
        if (pointsDrawn.length > 1) {
            if (drawing === "road") {
                roads.push(new Road(pointsDrawn[0], pointsDrawn[1], drawingLanes));
            }
            drawing = null;
            pointsDrawn = [];
        }
    } else if (drawing === "car") {
        let position = createVector(mouseX, mouseY);
        let velocity = createVector(mouseX - pmouseX, mouseY - pmouseY).normalize(); // Movement between last and current frame
        let colour = color(random(0, 255), random(0, 255), random(0, 255));
        cars.push(new Car(position, velocity, colour));
        drawing = null;
    }
}

function keyPressed() {
    switch (key) {
        case "r":
            drawing = "road";
            pointsDrawn = [];
            break;
        case "c":
            drawing = "car";
            break;
        case "1":
            drawingLanes = 2;
            break;
        case "2":
            drawingLanes = 4;
            break;
        case "3":
            drawingLanes = 6;
            break;
    }
}