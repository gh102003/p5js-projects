class Circle {

    constructor(x, y) {
        this.x = x;
        this.y = y;

        this.speed = random(0.6, 1.6);
        this.radius = startRadius;
        this.growing = true;
    }

    grow() {
        if (!this.isTouchingEdge() && !this.isTouchingAnotherCircle()) {
            this.radius += this.speed;
        } else {
            this.growing = false;
        }
    }

    isTouchingEdge() {
        // X
        if (this.x + this.radius >= width || this.x - this.radius <= 0) {
            return true;
        }
        // Y
        if (this.y + this.radius >= height || this.y - this.radius <= 0) {
            return true;
        }
    }

    isTouchingAnotherCircle() {
        for (let i = 0; i < circles.length; i++) {
            if (circles[i] === this) continue;
            if (dist(this.x, this.y, circles[i].x, circles[i].y) < this.radius + circles[i].radius + lineWidth) {
                return true;
            }
        }
        return false;
    }

    draw() {
        colorMode(HSB);
        stroke(min(this.radius * 3, 255), 70, 70);
        ellipse(this.x, this.y, this.radius * 2, this.radius * 2);
        colorMode(RGB);
    }
}