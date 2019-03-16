class GraphLine {
    constructor(f, params) {
        this.f = f;
        this.params = params;

        this.dy = 0;
        this.drawResolution = 0.05;
        this.order = 1;

        this.derivative = new Derivative(this);
    }

    draw() {
        strokeWeight(2);
        noFill();
        stroke(lineColours[this.order - 1]);
        beginShape();
        for (let x = -width / 2; x < width / 2; x += (graphScale * this.drawResolution)) {
            vertex(x, this.f(x / graphScale, this.params) * graphScale);
        }
        endShape();

        let intermediateColour = lerpColor(lineColours[this.order - 1], lineColours[this.order], 0.6);

        // Triangle
        stroke(intermediateColour);
        this.dy = this.calculateDy(graphMouseX);

        line(this.x2 * graphScale, this.y1 * graphScale, this.x2 * graphScale, this.y2 * graphScale);
        line(this.x1 * graphScale, this.y1 * graphScale, this.x2 * graphScale, this.y1 * graphScale);
        line(this.x1 * graphScale, this.y1 * graphScale, this.x2 * graphScale, this.y2 * graphScale);

        // Labels
        push(); {
            stroke(255);
            fill(intermediateColour);
            let fontSize = 18;
            textSize(fontSize);

            // dx label
            push(); {
                translate(this.x1 * graphScale + 3, this.y1 * graphScale - fontSize);
                scale(1, -1);
                text(nf(dx), 0, 0);
            }
            pop();
            // dy label
            push(); {
                translate(this.x2 * graphScale + fontSize, min(this.y1, this.y2) * graphScale + 3);
                scale(1, -1);
                rotate(-HALF_PI);
                text(nf(this.dy, 0, 3), 0, 0);
            }
            pop();
            // dy/dx overlay
            fontSize = 24;
            textSize(fontSize);
            push(); {
                translate(width / 2 - 180, this.calculateOverlayY(fontSize));
                scale(1, -1);
                text("dy/dx = " + nf(this.dy / dx, 0, 2), 0, 0);
            }
            pop();
        }
        pop();

        this.derivative.draw();
    }

    calculateOverlayY(fontSize) {
        let spacing = 3;
        let lineHeight = fontSize + spacing;
        let canvasBottom = - height / 2;
        return canvasBottom + (maxOrder - this.order + 0.5) * lineHeight + spacing;
    }

    calculateDy(x) {
        this.x1 = (x - dx / 2);
        this.y1 = this.f(this.x1, this.params);
        this.x2 = (x + dx / 2);
        this.y2 = this.f(this.x2, this.params);
        return this.y2 - this.y1;
    }

    toString() {
        return this.name;
    }

    saveDerivativePoint() {
        this.derivative.savePoint(createVector(graphMouseX, this.dy / dx));
    }

    showExtraDivs() {
        if (this.div) {
            this.div.show();
        }
    }

    hideExtraDivs() {
        if (this.div) {
            this.div.hide();
        }
    }
}