/// <reference path="../lib/p5.global-mode.d.ts" />

import { Particle } from "./particle.js";

const particles = [];

window.setup = () => {
    createCanvas(800, 600);

    for (let i = 0; i < 10; i++) {
        const pos = createVector(random(width), random(height));
        const mass = random(0.3, 1);
        particles.push(new Particle(pos, mass));
    }
};

window.draw = () => {
    background(50);
    frameRate(60);
    particles.forEach(particle => {
        particle.draw();
        particle.update();
    });
};

window.keyTyped = () => {
    const particleToPush = random(particles);
    particleToPush.applyImpulse(p5.Vector.random2D().mult(50), 1);
};