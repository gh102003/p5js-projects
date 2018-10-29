class GraphLine {
    constructor(f) {
        this.f = f;

        this.x = 0;
        this.dx = 0;
        this.dy = 0;
        this.resolution = 0.005;
        this.derivativePoints = [];
    }

    draw() {
        strokeWeight(2);
        noFill();
        stroke(0, 100, 200);
        beginShape();
        for (let x = -width / 2; x < width / 2; x += (graphScale * this.resolution)) {
            vertex(x, this.f(x / graphScale) * graphScale);
        }
        endShape();

        // Triangle
        stroke(200, 0, 0);
        this.dx = dxSlider.value();
        this.x = (mouseX - width / 2) / graphScale;
        let x1 = (this.x - this.dx / 2);
        let y1 = this.f(x1);
        let x2 = (this.x + this.dx / 2)
        let y2 = this.f(x2);
        line(x2 * graphScale, y1 * graphScale, x2 * graphScale, y2 * graphScale);
        line(x1 * graphScale, y1 * graphScale, x2 * graphScale, y1 * graphScale);
        line(x1 * graphScale, y1 * graphScale, x2 * graphScale, y2 * graphScale);
        this.dy = y2 - y1;

        // Labels
        push(); {
            noStroke();
            fill(200, 0, 0);
            let fontSize = 18;
            textSize(fontSize);

            push(); {
                let offset = -fontSize;
                if (y2 < y1) {
                    offset = fontSize / 2;
                }
                translate(x1 * graphScale + 5, y1 * graphScale + offset);
                scale(1, -1);
                text(nf(this.dx), 0, 0);
            }
            pop();
            push(); {
                translate(x2 * graphScale + fontSize, min(y1, y2) * graphScale + 5);
                scale(1, -1);
                rotate(-HALF_PI);
                text(nf(this.dy, 0, 3), 0, 0);
            }
            pop();
        }
        pop();


        // Derivative points
        stroke(0, 180, 0);
        noFill();
        beginShape();
        for (let i = 0; i < this.derivativePoints.length; i++) {
            vertex(this.derivativePoints[i].x * graphScale, this.derivativePoints[i].y * graphScale);
        }
        endShape();
    }

    toString() {
        return this.name;
    }

    saveDerivativePoint() {
        this.derivativePoints.push(createVector(this.x, this.dy / this.dx));

        // Sort the points so the line is drawn correctly
        this.derivativePoints.sort((a, b) => a.x - b.x);
    }
}