class Food {
    constructor() {
        this.alive = true;
        this.position = createVector(random(0, maxX), random(0, maxY));
    }

    collideWith(collider) {
        collider.hunger = max(0, collider.hunger - 50);
        this.alive = false;
    }
    
    tick() {

    }
    
    render() {
        push();
        translate(this.position);
        stroke(255);
        strokeWeight(3);
        fill(150, 29, 210);
        ellipse(0, 0, 15, 15);
        pop();
    }
}