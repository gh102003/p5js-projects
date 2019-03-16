var graphScale = 100;

// The x position of the mouse relative to the graph;
var graphMouseX = 0;
var dx = 0;

var maxOrder = 4;

var functions;

function setup() {
    functions = {
        "x²": new GraphLine(x => pow(x, 2)),
        "x³": new GraphLine(x => pow(x, 3)),
        "x⁴": new GraphLine(x => pow(x, 4)),
        "x⁵": new GraphLine(x => pow(x, 5)),
        "sin(x)": new GraphLine(x => sin(x)),
        "cos(x)": new GraphLine(x => cos(x)),
        "1/x (incorrect near x = 0)": new GraphLine(x => 1 / x),
        "2^x": new GraphLine(x => pow(2, x)),
        "e^x": new GraphLine(x => Math.exp(x)),
        "3^x": new GraphLine(x => pow(3, x)),
        "a^x (find e)": new GraphLineFindE(),
        "√x": new GraphLine(x => sqrt(x)),
        "0.5x + 2": new GraphLine(x => x * 0.5 + 2),
        "x² + 2x - 2": new GraphLine(x => pow(x, 2) + 2 * x - 2),
        "2x³ - 3x² + 4x - 2": new GraphLine(x => 2 * pow(x, 3) - 3 * pow(x, 2) + 4 * x - 2),
        "-2x⁴ + 2x³ - x² + 3x + 1": new GraphLine(x => -2 * pow(x, 4) + 2 * pow(x, 3) - pow(x, 2) + 3 * x + 1)
    };

    let canvas = createCanvas(1200, 800); // dimensions must be (even * graphScale)
    canvas.parent(select("#canvas-wrapper"));
    canvas.attribute("oncontextmenu", "return false;");

    lineColours = [color(0, 200, 0), color(0, 100, 200), color(200, 0, 100), color(200, 90, 0), color(180, 150, 0)];

    functionSelect = select("#function-select");
    functionSelect.changed(() => {
        graphLine = functions[functionSelect.value()]
        for (let i = 0; i < Object.values(functions).length; i++) {
            Object.values(functions)[i].hideExtraDivs();
        }
        graphLine.showExtraDivs();
    });

    let keys = Object.keys(functions);
    for (let i = 0; i < keys.length; i++) {
        functionSelect.option(keys[i]);
    }

    dxSlider = select("#dx-slider");
    dxSlider.input(() => {
        dx = dxSlider.value();
        dxLabel.html("dx = " + dx);
        graphLine.derivative = new Derivative(graphLine);
    });
    dx = dxSlider.value();

    dxLabel = select("#dx-label");

    graphLine = functions[keys[0]];

    derivativeSelect = createRadio();
    derivativeSelect.parent(select("#draw-options"));
    for (let i = 1; i < maxOrder; i++) {
        derivativeSelect.option(i);
    }
    derivativeSelect.selected(derivativeSelect._getInputChildrenArray()[0].value);
}

function draw() {
    background(230);
    strokeWeight(2);
    stroke(0);

    translate(width / 2, height / 2);
    scale(1, -1);

    graphMouseX = (mouseX - width / 2) / graphScale;

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

function mousePressed() {
    if (mouseX <= width && mouseX >= 0 && mouseY <= height && mouseY >= 0) {
        let derivativeToDraw = parseInt(derivativeSelect.value());

        let derivative = graphLine;
        while (derivative.order < derivativeToDraw) {
            derivative = derivative.derivative;
        }
        derivative.saveDerivativePoint();
        return false;
    }
}

function keyTyped() {
    // Set derivative to calculate
    let values = derivativeSelect._getInputChildrenArray();
    for (let i = 0; i < values.length; i++) {
        if (key === values[i].value) {
            derivativeSelect.value(key);
            return;
        }
    }
}