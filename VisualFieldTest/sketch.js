/// <reference path="../lib/p5.global-mode.d.ts" />

const regionSize = 150;
const dotSize = 25;

let regions = [];

let testingRegion = null;
let results = null;

window.setup = function () {
    createCanvas(windowWidth, windowHeight);

    for (let i = 0; i + regionSize / 2  < windowWidth; i += regionSize) {
        for (let j = 0; j + regionSize / 2 < windowWidth; j += regionSize) {
            regions.push([i, j]);
        }
    }
};

window.draw = function () {
    background(255);

    fill(255, 0, 0);
    
    drawCrosshair(windowWidth * 3 / 4, windowHeight / 2);
    if (testingRegion !== null) {
        noStroke();
        ellipse(testingRegion[0] + regionSize / 2, testingRegion[1] + regionSize / 2, dotSize);
    } else {
        if (results) {
            drawResults();
        } else {
            // Draw dots in all regions
            for (let region of regions) {
                noStroke();
                ellipse(region[0] + regionSize / 2, region[1] + regionSize / 2, dotSize);
            }
        }
    }
};

function drawCrosshair(x, y) {
    strokeWeight(3);
    stroke(0);
    line(x - 15, y - 15, x + 15, y + 15);
    line(x + 15, y - 15, x - 15, y + 15);
}

function drawResults() {
    colorMode(RGB, 100);
    fill(0, 255, 0, 50);
    noStroke();
    for (let i = 0; i < regions.length; i++) {
        // Draw a transparent box for every time the region was seen
        for (let j = 0; j < results[i]; j++) {
            rect(regions[i][0], regions[i][1], regionSize, regionSize);
        }
    }
}

window.keyPressed = function () {
    if (key === "r") {
        runTest();
    } else if (key === " " && testingRegion !== null) {
        const index = regions.indexOf(testingRegion);
        results[index]++;
    }
};

function runTest() {
    // default results to have '0' for each index
    results = regions.map(() => 0);

    let repeatNumber = 1;

    let regionsToTest = shuffle(regions, false);

    let i = 0;
    const handle = setInterval(() => {
        if (i < regionsToTest.length) {
            testingRegion = regionsToTest[i++];
            console.log(`Testing region at ${testingRegion}`);
        } else {
            if (repeatNumber < 3) {
                console.log("repeating");

                repeatNumber++;
                i = 0;
                regionsToTest = shuffle(regions, false);
            } else {
                testingRegion = null;
                console.log({ results, repeatNumber, regions });
                saveJSON({ results, repeatNumber, regions }, "test_result.json");
                clearTimeout(handle);

            }
        }
    }, 1000);

}