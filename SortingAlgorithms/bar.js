class Bar {
    constructor(size) {
        this.size = size; // Size is between 0 and 1
    }

    render(index) {
        push();

        colorMode(HSB);
        fill(this.size * 360, 100, 80);
        // noStroke();
        translate((index / 50) * 1000, 0);
        rect(0, 0, 1000 / 50, this.size * 800);

        pop();
    }
}