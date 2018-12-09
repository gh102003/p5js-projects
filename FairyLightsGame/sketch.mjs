import {lightSize} from "./light.mjs";
import {LightFactory} from "./lightFactory.mjs";
import {levels} from "./levels.js";

function loadLevel(levelNum, factory) {
    let level = levels[levelNum];
    lights = [];
    for (let i = 0; i < level.lights.length; i++) {
        
        let light = factory.create(level.lights[i].type);
        light.initialise(100 + i * 100, 200, level.lights[i].state);
        lights.push(light);
    }
}

var lights = [];

var setup = function() {
    createCanvas(1600, 900);

    loadLevel(0, new LightFactory());
};

var draw = function() {
    background(40);
    strokeWeight(3);

    for (let i = 0; i < lights.length; i++) {
        // Connecting 'wire'
        if (lights.length > i + 1) {
            stroke(200);
            noFill();
            let currentY = lights[i].y - lightSize * 0.4;
            let nextY = lights[i + 1].y - lightSize * 0.4;
            let halfwayX = lerp(lights[i].x, lights[i + 1].x, 0.5);
            bezier(lights[i].x, currentY, halfwayX, lights[i].y, halfwayX, lights[i + 1].y, lights[i + 1].x, nextY);
        }

        lights[i].draw();
    }
};

var mouseClicked = function() {
    for (let i = 0; i < lights.length; i++) {
        let light = lights[i];
        let minX = light.x - lightSize / 2;
        let maxX = light.x + lightSize / 2;
        let minY = light.y - lightSize / 2;
        let maxY = light.y + lightSize / 2;
        if(mouseX < maxX && mouseX > minX && mouseY < maxY && mouseY > minY) {
            light.click(lights, i);
        }
    }
};

window.setup = setup; 
window.draw = draw;
window.mouseClicked = mouseClicked;