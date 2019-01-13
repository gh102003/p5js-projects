export var lightSize = 70;

export class Light {
    constructor() {
        this.frameToggled = frameCount - 500; // Set early to prevent animation on level change
        this.frameClicked = frameCount - 500;
        this.noiseSeed = random(0, 10);
    }

    initialise(x, y, color, isOn) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.isOn = isOn;
    }

    draw(g) {
        this.drawLight(g);
        this.drawShine(g);
    }

    drawLight(g) {
        g.noStroke();
        this.timeSinceToggle = frameCount - this.frameToggled;
        this.timeSinceClick = frameCount - this.frameClicked;
        this.currentNoise = noise(frameCount / 30) - 0.1;

        if (this.isOn) {
            // Colour transition
            let baseColor = lerpColor(this.color, color(0), max(0, 0.6 - this.timeSinceToggle / 20));
            // Flicker using perlin noise
            noiseSeed(this.noiseSeed);
            noiseDetail(2, 0.3);
            let flickerColor = lerpColor(baseColor, color(255), min(this.currentNoise * 0.6, 0.5));
            g.fill(flickerColor);
        } else {
            g.fill(lerpColor(this.color, color(0), min(0.55, this.timeSinceToggle / 20)));
        }
        g.ellipse(this.x, this.y, lightSize, lightSize);
        g.stroke(255, 150);
        g.arc(this.x, this.y, lightSize - 20, lightSize - 20, PI * 1.1, PI * 1.3);
    }

    drawShine(g) {
        let shineColor = color(red(this.color), green(this.color), blue(this.color), 1);
        let maxShineSize = lightSize * 1.8;
        let shineSize;

        if (this.isOn) {
            shineSize = min(maxShineSize, lightSize + this.timeSinceToggle * 20);
            shineSize += this.currentNoise * 15 - 5;
        } else {
            shineSize = maxShineSize - this.timeSinceToggle * 8;
        }

        g.noStroke();
        g.fill(shineColor);
        for (let i = shineSize; i > lightSize; i *= 0.99) {
            g.ellipse(this.x, this.y, i);
        }
    }

    click() {
        this.frameClicked = frameCount;
    }

    toggle() {
        this.isOn = !this.isOn;
        this.frameToggled = frameCount;
    }
}

// None
export class WhiteLight extends Light {
    initialise(x, y, isOn) {
        super.initialise(x, y, color(220, 210, 180), isOn);
    }
}

// Only itself
export class RedLight extends Light {
    initialise(x, y, isOn) {
        super.initialise(x, y, color(180, 0, 0), isOn);
    }

    click() {
        super.click();
        this.toggle();
    }
}

// Itself and neighbours
export class GreenLight extends Light {
    initialise(x, y, isOn) {
        super.initialise(x, y, color(0, 200, 0), isOn);
    }

    click(lights, index) {
        super.click();
        for (let i = -1; i <= 1; i++) {
            if (lights[index + i] === undefined) continue;
            lights[index + i].toggle();
        }
    }
}

// Only neighbours
export class BlueLight extends Light {
    initialise(x, y, isOn) {
        super.initialise(x, y, color(0, 80, 150), isOn);
    }

    click(lights, index) {
        super.click();
        if (lights[index - 1] !== undefined) lights[index - 1].toggle();
        if (lights[index + 1] !== undefined) lights[index + 1].toggle();
    }
}

// Itself and two neighbours
export class YellowLight extends Light {
    initialise(x, y, isOn) {
        super.initialise(x, y, color(210, 210, 0), isOn);
    }

    click(lights, index) {
        super.click();
        for (let i = -2; i <= 2; i++) {
            if (lights[index + i] === undefined) continue;
            lights[index + i].toggle();
        }
    }
}

// All to left/right
export class PinkLight extends Light {
    initialise(x, y, isOn, {direction}) {
        super.initialise(x, y, color(180, 0, 180), isOn);
        this.direction = direction;
    }

    draw(g) {
        this.drawLight(g);

        // Arrow
        g.noStroke();
        g.fill(255, min((this.timeSinceClick - 31) * 11, 150)); // Fade arrow in after swoosh
        g.push();

        // Translate and fill based on time since toggle to give swoosh effect
        let arrowOffset = this.timeSinceClick ** 2 * 0.4 + this.timeSinceClick * 7; // 0.4x^2 + 7x
        let maxArrowOffset = 600;
        if (arrowOffset < maxArrowOffset) {
            if (this.direction === "left") {
                g.translate(-arrowOffset, 0);
            } else if (this.direction === "right") {
                g.translate(arrowOffset, 0);
            }
            g.fill(255, 150 - this.timeSinceClick * 6);
        }

        g.beginShape();
        if (this.direction === "left") {
            g.vertex(this.x - lightSize * 0.27, this.y); // tip
            g.vertex(this.x - lightSize * 0.05, this.y - lightSize * 0.22); // top of head
            g.vertex(this.x - lightSize * 0.05, this.y - lightSize * 0.12); // top inside head
            g.vertex(this.x + lightSize * 0.2, this.y - lightSize * 0.12); // top of base
            g.vertex(this.x + lightSize * 0.2, this.y + lightSize * 0.12); // bottom of base
            g.vertex(this.x - lightSize * 0.05, this.y + lightSize * 0.12); // bottom inside head
            g.vertex(this.x - lightSize * 0.05, this.y + lightSize * 0.22); // bottom of head
        } else if (this.direction === "right") {
            g.vertex(this.x + lightSize * 0.27, this.y); // tip
            g.vertex(this.x + lightSize * 0.05, this.y - lightSize * 0.22); // top of head
            g.vertex(this.x + lightSize * 0.05, this.y - lightSize * 0.12); // top inside head
            g.vertex(this.x - lightSize * 0.2, this.y - lightSize * 0.12); // top of base
            g.vertex(this.x - lightSize * 0.2, this.y + lightSize * 0.12); // bottom of base
            g.vertex(this.x + lightSize * 0.05, this.y + lightSize * 0.12); // bottom inside head
            g.vertex(this.x + lightSize * 0.05, this.y + lightSize * 0.22); // bottom of head
        }
        g.endShape();
        g.pop();

        this.drawShine(g);
    }

    click(lights, index) {
        super.click();
        if (this.direction === "left") {
            for (let i = 0; i <= index; i++) {
                lights[i].toggle();
            }
        } else if (this.direction === "right") {
            for (let i = index; i < lights.length; i++) {
                lights[i].toggle();
            }
        }
    }
}