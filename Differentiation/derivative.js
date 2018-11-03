class Derivative {
    constructor(integral) {
        this.integral = integral;
        this.order = integral.order + 1;
        
        this.dy = 0;
        this.knownPoints = [];
        
        // Create another derivative if our order is less than the max
        if (this.order < maxOrder) {
            this.derivative = new Derivative(this);
        }
    }

    draw() {
        // Line
        stroke(lineColours[this.order - 1]);
        noFill();
        beginShape();
        for (let i = 0; i < this.knownPoints.length; i++) {
            vertex(this.knownPoints[i].x * graphScale, this.knownPoints[i].y * graphScale);
        }
        endShape();

        this.dy = this.calculateDy(graphMouseX);

        // If the line is visible
        if (this.knownPoints.length > 1) {
            let intermediateColour = lerpColor(lineColours[this.order - 1], lineColours[this.order], 0.6);

            // Triangle
            stroke(intermediateColour);
            line(this.x2 * graphScale, this.y1 * graphScale, this.x2 * graphScale, this.y2 * graphScale);
            line(this.x1 * graphScale, this.y1 * graphScale, this.x2 * graphScale, this.y1 * graphScale);
            line(this.x1 * graphScale, this.y1 * graphScale, this.x2 * graphScale, this.y2 * graphScale);

            // Labels
            push(); {
                stroke(255);
                fill(intermediateColour);
                let fontSize = 18;
                textSize(fontSize);

                push(); {
                    translate(this.x1 * graphScale + 3, this.y1 * graphScale - fontSize);
                    scale(1, -1);
                    text(nf(dx), 0, 0);
                }
                pop();
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
                    text(`d^${this.order}y/dx^${this.order} = `.replace(/\^2/g, "²").replace(/\^3/g, "³").replace(/\^4/g, "⁴") + nf(this.dy / dx, 0, 2), 0, 0);
                }
                pop();
            }
            pop();
        }

        if (this.derivative !== undefined) {
            this.derivative.draw();
        }
    }

    calculateOverlayY(fontSize) {
        let spacing = 3;
        let lineHeight = fontSize + spacing;
        let canvasBottom = - height / 2;
        return canvasBottom + (maxOrder - this.order + 0.5) * lineHeight + spacing;
    }

    calculateDy(x) {
        this.x1 = (x - dx / 2);
        this.y1 = this.integral.calculateDy(this.x1) / dx;
        this.x2 = (x + dx / 2)
        this.y2 = this.integral.calculateDy(this.x2) / dx;
        return this.y2 - this.y1;
    }

    savePoint(point) {
        this.knownPoints.push(point);
        // Sort the points so the line is drawn correctly
        this.knownPoints.sort((a, b) => a.x - b.x);
    }

    saveDerivativePoint() {
        this.derivative.savePoint(createVector(graphMouseX, this.dy / dx));
    }
}