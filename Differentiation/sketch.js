var graphScale = 100;
var graphLine;

var functionSelect, dxSlider, dxLabel, dyLabel;

var functions = {
    "x^2": new GraphLine(x => pow(x, 2)),
    "x^3": new GraphLine(x => pow(x, 3)),
    "x^4": new GraphLine(x => pow(x, 4)),
    "x^5": new GraphLine(x => pow(x, 5)),
    "0.5x + 2": new GraphLine(x => x * 0.5 + 2),
    "x^2 + 2x - 2": new GraphLine(x => pow(x, 2) + 2 * x - 2),
    "2(x^3) - 3(x^2) + 4x - 6": new GraphLine(x => 2 * pow(x, 3) - 3 * pow(x, 2) + 4 * x - 6)
};

function setup() {
    createCanvas(1200, 800); // Must be (even * graphScale)

    optionsDiv = createDiv();

    functionSelect = createSelect();
    functionSelect.changed(function () {
        graphLine = functions[functionSelect.value()];
        updateLabels();
    });
    functionSelect.parent(optionsDiv);

    let keys = Object.keys(functions);
    for (let i = 0; i < keys.length; i++) {
        functionSelect.option(keys[i]);
    }

    dxSlider = createSlider(0.05, 1, 1, 0.05);
    dxSlider.style("display:block");
    dxSlider.changed(() => {
        dxLabel.html("dx = " + dxSlider.value());
        updateLabels();
    });
    dxSlider.parent(optionsDiv);

    dxLabel = createP("dx = " + dxSlider.value());
    dxLabel.parent(optionsDiv);

    dyLabel = createP("dy = ");
    dyLabel.parent(optionsDiv);

    ratioLabel = createP("dy/dx = ");
    ratioLabel.parent(optionsDiv);

    graphLine = functions[keys[0]];
}

function draw() {
    background(230);
    strokeWeight(2);
    stroke(0);

    translate(width / 2, height / 2);
    scale(1, -1);

    let axisTickSize = 10;

    // x axis
    line(-width / 2, 0, width / 2, 0);
    for (let x = -width / 2; x < width / 2; x += graphScale) {
        line(x, -axisTickSize / 2, x, axisTickSize / 2);
    }

    // y axis
    line(0, -height / 2, 0, height / 2);
    for (let y = -height / 2; y < height / 2; y += graphScale) {
        line(-axisTickSize / 2, y, axisTickSize / 2, y);
    }

    graphLine.draw();
}

function mouseMoved() {
    updateLabels();
    return false;
}

function updateLabels() {
    dyLabel.html("dy = " + nf(graphLine.dy, 0, 3));
    ratioLabel.html("dy/dx = " + nf(graphLine.dy / dxSlider.value(), 0, 3));
}

function mousePressed() {
    if (mouseX <= width && mouseX >= 0 && mouseY <= height && mouseY >= 0) {
        graphLine.saveDerivativePoint();
    }
}