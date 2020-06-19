import { Impulse } from "./impulse.js";

const gravity = 9.81; // in m/s^2

export class Particle {
    constructor(pos, mass) {
        this.pos = pos; // in m
        this.m = mass; // in kg
        this.v = createVector(0, 0); // in m/s
        this.a; // in m/s^2
        this.impulses = []; // array of impulses on the particle
    }

    draw() {
        push();
        translate(this.pos.x, this.pos.y);
        ellipse(0, 0, this.m * 40);
        this.impulses.forEach(impulse => impulse.draw());
        pop();
    }

    update() {
        const deltaT = deltaTime / 1000; // Adjust for frame rate
        this.a = createVector(0, 0);

        // Apply forces and impulses
        this.applyForce(this.calculateFriction());
        this.applyForce(this.calculateDrag());
        this.impulses.forEach(impulse => {
            if (impulse.tLeft > 0) {
                impulse.tLeft -= deltaT;
                this.applyForce(impulse.F);
            }
        });

        // Update velocity and position
        const deltaV = p5.Vector.mult(this.a, deltaT);
        this.v.add(deltaV);
        const deltaPos = p5.Vector.mult(this.v, deltaT);
        this.pos.add(deltaPos);
    }

    applyForce(F) {
        const a = p5.Vector.div(F, this.m);
        // const deltaA = p5.Vector.mult(a, deltaTime / 1000);
        this.a.add(a);
    }

    applyImpulse(F, t) {
        this.impulses.push(new Impulse(F, t));
    }

    calculateFriction() {
        const frictionCoefficient = 0.7; // mu
        const normalContactForceMagnitude = this.m * gravity;
        const frictionMagnitude = frictionCoefficient * normalContactForceMagnitude;
        return this.v.copy().mult(-1).setMag(frictionMagnitude); // Reverse direction of movement
    }

    calculateDrag() {
        const fluidDensity = 1.2;
        const dragCoefficient = 0.5;

        // Calculate cross-sectional area, assuming particle is spherical
        const particleDensity = 9000; // kg/m^3
        const particleVolume = this.m / particleDensity;
        const particleCrossSectionArea = PI * pow(particleVolume * 3 / 4 / PI, 2 / 3);
        
        return this.v.copy().mult(-1).setMag(0.5 * fluidDensity * this.v.magSq() * dragCoefficient * particleCrossSectionArea);
    }
}