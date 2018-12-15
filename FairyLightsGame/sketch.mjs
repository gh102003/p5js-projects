import {lightSize} from "./light.mjs";
import {LightFactory} from "./lightFactory.mjs";
import {levels} from "./levels.js";

function loadLevel(levelNum, factory) {
    let level = levels[levelNum];
    lights = [];
    levelText = `Level ${levelNum + 1}: ${level.name}`;
    for (let i = 0; i < level.lights.length; i++) {
        
        let light = factory.create(level.lights[i].type);
        light.initialise(100 + i * 100, 100, level.lights[i].state, level.lights[i].parameters);
        lights.push(light);
    }
}

function checkWin() {
    for (let light of lights) {
        if (!light.isOn) {
            return false;
        }
    }
    return true;
}

var timeSinceWin = 0;

var levelNum = 0;
var levelText = "";
var lightsGraphics;
var lights = [];

var setup = function() {
    createCanvas(1600, 600);
    lightsGraphics = createGraphics(1600, 200, P2D);

    loadLevel(levelNum, new LightFactory());
};

var draw = function() {
    // frameRate(5);
    background(40);
    lightsGraphics.background(40);
    
    lightsGraphics.strokeWeight(3);
    lightsGraphics.smooth();
    
    for (let i = 0; i < lights.length; i++) {
        // Connecting 'wire'
        if (lights.length > i + 1) {
            lightsGraphics.stroke(200);
            lightsGraphics.noFill();
            let currentY = lights[i].y - lightSize * 0.4;
            let nextY = lights[i + 1].y - lightSize * 0.4;
            let halfwayX = lerp(lights[i].x, lights[i + 1].x, 0.5);
            lightsGraphics.bezier(lights[i].x, currentY, halfwayX, lights[i].y, halfwayX, lights[i + 1].y, lights[i + 1].x, nextY);
        }

        lights[i].draw(lightsGraphics);
    }
    
    // Fade out on win
    timeSinceWin++;
    tint(255, timeSinceWin * 5);
    image(lightsGraphics, 0, 0);
    
    // Text
    fill(230);
    let fontSize = 36;
    textSize(fontSize);
    text(levelText, fontSize, height - fontSize);
};

var mouseReleased = function() {
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

    if (checkWin()) {
        setTimeout(function() {
            if (++levelNum < levels.length) {
                loadLevel(levelNum, new LightFactory());
            } else {
                lights = [];
                levelText = "Well done, you win!";
            }
            timeSinceWin = 0;
        }, 400);
    }
};

window.setup = setup; 
window.draw = draw;
window.mouseReleased = mouseReleased;