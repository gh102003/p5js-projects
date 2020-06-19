export class Impulse {
    constructor(F, t) {
        this.F = F;
        this.t = t;
        this.tLeft = t;
    }

    draw() {
        if (this.tLeft > 0) {
            push();

            strokeWeight(2);
            stroke(255, 150, 0);

            rotate(this.F.heading());
            line(0, 0, this.F.mag(), 0);
            line(this.F.mag() - 5, -5, this.F.mag(), 0);
            line(this.F.mag() - 5, 5, this.F.mag(), 0);

            pop();
        }
    }
}