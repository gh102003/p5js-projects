export var lightSize = 50;

export class Light {
    constructor() {
        this.frameToggled = frameCount - 500; // Set early to prevent animation on level change
        this.noiseSeed = random(0, 10);
    }

    initialise(x, y, color, isOn) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.isOn = isOn;
    }

    draw(lightsGraphics) {
        lightsGraphics.noStroke();
        // Shining effect
        let timeSinceToggle = frameCount - this.frameToggled;
        let shineColor = color(red(this.color), green(this.color), blue(this.color), 1);
        let maxShineSize = 100;
        let shineSize;
        
        if(this.isOn) {
            shineSize = min(maxShineSize, lightSize + timeSinceToggle * 20);
            
            // Colour transition
            let baseColor = lerpColor(this.color, color(0), max(0, 0.6 - timeSinceToggle / 20));
            // Flicker using perlin noise
            noiseSeed(this.noiseSeed);
            noiseDetail(2, 0.3);
            let currentNoise = noise(frameCount / 30) - 0.05;
            shineSize += currentNoise * 15 - 5;
            let flickerColor = lerpColor(baseColor, color(255), min(currentNoise * 0.6, 0.5));
            lightsGraphics.fill(flickerColor);
        } else {
            shineSize = maxShineSize - timeSinceToggle * 8;
            
            lightsGraphics.fill(lerpColor(this.color, color(0), min(0.6, timeSinceToggle / 20)));
        }
        lightsGraphics.ellipse(this.x, this.y, lightSize, lightSize);
        lightsGraphics.stroke(255, 150);
        lightsGraphics.arc(this.x, this.y, lightSize - 20, lightSize - 20, PI * 1.1, PI * 1.3);
        
        // Shining
        lightsGraphics.noStroke();
        lightsGraphics.fill(shineColor);
        for (let i = shineSize; i > lightSize; i *= 0.99) {
            lightsGraphics.ellipse(this.x, this.y, i);
        }
    }

    click(lights, index) {
        this.toggle();
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

    click(lights, index) {
        return;
    }
}

// Only itself
export class RedLight extends Light {
    initialise(x, y, isOn) {
        super.initialise(x, y, color(200, 0, 0), isOn);
    }
}

// Itself and neighbours
export class GreenLight extends Light {
    initialise(x, y, isOn) {
        super.initialise(x, y, color(0, 200, 0), isOn);
    }

    click(lights, index) {
        for (let i = -1; i <= 1; i++) {
            if (lights[index + i] === undefined) continue;
            lights[index + i].toggle();
        } 
    }
}

// Only neighbours
export class BlueLight extends Light {
    initialise(x, y, isOn) {
        super.initialise(x, y, color(0, 0, 200), isOn);
    }

    click(lights, index) {
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
        for (let i = -2; i <= 2; i++) {
            if (lights[index + i] === undefined) continue;
            lights[index + i].toggle();
        } 
    }
}

// All to left/right
export class PinkLight extends Light {
    initialise(x, y, isOn, {direction}) {
        super.initialise(x, y, color(210, 210, 0), isOn);
        this.direction = direction;
    }

    click(lights, index) {
        if (this.direction === "left") {
            for (let i = 0; i <= index; i++) {
                lights[i].toggle();
            } 
        } else if (this.direction === "right") {
            for (let i = lights.length; i >= index; i--) {
                lights[i].toggle();
            }
        }
    }
}

