/// <reference path="../lib/p5.global-mode.d.ts"/>
/// <reference path="../lib/p5.d.ts"/>

class Animal {

    // Genes
    // ---------------------------------
    // speed: number between 0.5 and 3, will be magnitude of velocity but also affects hunger
    // perseverance: number between 30 and 50, controls how often direction changes 
    // breedingWillingness: number between 0 and 1, controls breeding success and cooldown
    // maxTargetDistance: number between 200 and 500, controls how far it can look for food or mates
    // colour: p5.Color

    constructor(position, genes) {
        this.alive = true;

        this.age = 0;
        this.hunger = 0; // Die if reaches 100, food lowers
        this.breedingCooldown = 100; // Reset to 100 after breeding attempt, can only breed at 0, breedingWillingness gene reduces faster
        this.target = null;
        this.genes = genes || {
            speed: random(0.5, 3),
            perseverance: random(30, 50),
            breedingWillingness: random(0.5, 1),
            maxTargetDistance: random(200, 500),
            colour: color(random(0, 255), random(0, 255), random(0, 255))
        };
        this.position = position || createVector(random(0, maxX), random(0, maxY));
        this.velocity = p5.Vector.fromAngle(random(0, TWO_PI)).mult(this.genes.speed);
    }

    tick() {
        this.age++;

        // Look for targets (food and mates)
        if (!this.target) {
            this.findTarget();
        } else if (p5.Vector.dist(this.target.position, this.position) > this.genes.maxTargetDistance + 50) { // Remove target if too far away
            this.target = null;
        }

        // If touching target
        if (this.target && this.target.alive && p5.Vector.dist(this.target.position, this.position) < 20) {
            this.target.collideWith(this);
        }

        // Move
        if (this.target && this.target.alive) {
            const velocity = p5.Vector.sub(this.target.position, this.position);
            velocity.normalize();
            velocity.mult(this.genes.speed);
            this.position.add(velocity);
        } else {
            this.position.add(this.velocity);
        }

        // Edge detection
        let edgesTouching = 0; // More likely to change direction if touching edge
        if (this.position.x < 0) {
            this.position.x = 0;
            edgesTouching++;
        } else if (this.position.x > maxX) {
            this.position.x = maxX;
            edgesTouching++;
        }
        if (this.position.y < 0) {
            this.position.y = 0;
            edgesTouching++;
        } else if (this.position.y > maxY) {
            this.position.y = maxY;
            edgesTouching++;
        }

        // Change direction at random times based on perseverance gene
        if (randomGaussian(0, 14) + edgesTouching * 10 > this.genes.perseverance) {
            this.target = null;
            this.velocity = p5.Vector.fromAngle(random(0, TWO_PI)).mult(this.genes.speed);
        }

        // Decrease breeding cooldown
        if (random(0, 1) > 0.8) {
            this.breedingCooldown = max(0, this.breedingCooldown - this.genes.breedingWillingness);
        }

        // Increase hunger
        if (random(0, 1) > 0.98) {
            this.hunger += 0.4 + this.genes.speed;
        }
        if (this.hunger >= 100) {
            this.alive = false;
        }
    }

    findTarget() {
        if (this.hunger >= 30) {
            for (const food of foodItems) {
                if (food && food.alive) {
                    if (p5.Vector.dist(food.position, this.position) < this.genes.maxTargetDistance) {
                        this.target = food;
                    }
                }
            }
        } else if (this.breedingCooldown <= 0) {
            for (const animal of animals) {
                if (animal && animal !== this && animal.alive) {
                    if (p5.Vector.dist(animal.position, this.position) < this.genes.maxTargetDistance) {
                        this.target = animal;
                    }
                }
            }
        }
    }

    /**
     * Called on the receiver of a collision
     * @param {Animal} collider the animal that has targetted the receiver
     */
    collideWith(collider) {
        if (this.breedingCooldown > 0 && collider.breedingCooldown > 0) {
            // console.log("breed failed - cooldowns");
        }
        else if (this.genes.breedingWillingness + collider.genes.breedingWillingness > randomGaussian(1, 0.5)) {
            // console.log("breed success");
            collider.produceOffspringWith(this);
            this.hunger += random(30, 50);
            collider.hunger += random(30, 50);
            this.target = null;
            this.breedingCooldown = 100;
        }
        else {
            // console.log("breed failed - willingness");
        }
        collider.target = null;
        collider.breedingCooldown = 100;
    }

    produceOffspringWith(otherParent) {
        const genes = {};

        for (const gene in this.genes) {
            if (typeof this.genes[gene] === "number") {
                genes[gene] = lerp(this.genes[gene], otherParent.genes[gene], random(0, 1));
            } else if (this.genes[gene] instanceof p5.Color) {
                genes[gene] = lerpColor(this.genes[gene], otherParent.genes[gene], random(0, 1));
            } else {
                throw new Exception("Un-lerp-able type for gene");
            }
        }

        const offspring = new Animal(p5.Vector.lerp(this.position, otherParent.position, 0.5), genes);
        animals.push(offspring);
    }

    render() {
        push();

        translate(this.position);

        // Pulse if hungry
        if (this.hunger > 70) {
            scale(1 + 0.2 * sin(this.age * 0.2));
        }

        strokeWeight(2);
        if (this.target && this.target.alive) {
            stroke(200, 200, 0);
        } else {
            stroke(0);
        }
        fill(this.genes.colour);
        rect(0, 0, 30, 30);

        // Genes overlay on hover
        const mouseOffsetX = mouseX - this.position.x;
        const mouseOffsetY = mouseY - this.position.y;
        if (mouseOffsetX >= 0 && mouseOffsetX < 30 && mouseOffsetY >= 0 && mouseOffsetY < 30) {
            fill(0);
            noStroke();
            text(`Age: ${this.age}`, 35, 10);
            text(`Hunger: ${round(this.hunger)}`, 35, 22);
            text(`Breeding cooldown: ${round(this.breedingCooldown)}`, 35, 34);
            text(JSON.stringify(this.genes, (key, value) => {
                if (key === "colour") {
                    return value.toString();
                }
                if (typeof value === "number") {
                    return round(value * 1000) / 1000;
                }
                return value;
            }, "  "), 0, 43);
        }
        pop();

        push();
        if (this.target && this.target.alive && mouseOffsetX >= 0 && mouseOffsetX < 30 && mouseOffsetY >= 0 && mouseOffsetY < 30) {
            translate(this.target.position);
            noFill();
            stroke(200, 200, 0);
            ellipse(0, 0, 30, 30);
        }
        pop();
    }
}