class Light {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    draw() {
        ellipse(x, y, lightSize, lightSize);
    }
}