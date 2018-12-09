export var lightSize = 50;

export class Light {
    constructor() {
        this.frameToggled = frameCount;
    }

    initialise(x, y, color, isOn) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.isOn = isOn;
    }

    draw() {
        noStroke();
        // Shining effect
        let timeSinceToggle = frameCount - this.frameToggled;
        let shineColor = color(red(this.color), green(this.color), blue(this.color), 1);
        let maxShineSize = 100;
        let shineSize;
        
        if(this.isOn) {
            shineSize = min(maxShineSize, lightSize + timeSinceToggle * 10);
            
            fill(this.color);
        } else {
            shineSize = maxShineSize - timeSinceToggle * 10;
            
            fill(lerpColor(this.color, color(0), 0.6));
        }
        ellipse(this.x, this.y, lightSize, lightSize);
        stroke(255, 150);
        arc(this.x, this.y, lightSize - 20, lightSize - 20, PI * 1.1, PI * 1.3);
        
        // Shining
        noStroke();
        fill(shineColor);
        for (let i = shineSize; i > lightSize; i *= 0.99) {
            ellipse(this.x, this.y, i);
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
        super.initialise(x, y, color(220), isOn);
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

// Itself and two neighbours
export class YellowLight extends Light {
    initialise(x, y, isOn) {
        super.initialise(x, y, color(200, 200, 0), isOn);
    }

    click(lights, index) {
        for (let i = -2; i <= 2; i++) {
            if (lights[index + i] === undefined) continue;
            lights[index + i].toggle();
        } 
    }
}