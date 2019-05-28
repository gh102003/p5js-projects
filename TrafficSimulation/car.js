const CAR_WIDTH = 25;
const CAR_LENGTH = 45;
const BASE_FRICTION = 0.08;

const STEERING_CHANGE_RATE = 0.2;
const STEERING_RATE = 0.02;
const STEERING_DECELERATION_RATE = 0.03;
const ACCELERATION_RATE = 0.2;
const BRAKE_RATE = 0.4;

class Car {

    constructor(pos, vel, colour) {
        this.pos = pos;
        this.vel = vel;
        this.acc = createVector(0, 0);
        this.colour = colour;

        // Used to store rotation when still
        this.heading = this.vel.heading();

        // Pedals - between 0 and 1
        this.acceleratorPedal = 0;
        this.brakePedal = 0;

        // Steering - between -1 (left) and 1 (right)
        this.steeringWheel = 0;
    }

    /**
     * Snaps the car to a road
     * 
     * @param {Road} road which road to follow
     * @param {number} direction positive if from 1 -> 2, negative if from 2 -> 1 
     */
    followRoad(road, direction) {

    }

    applyPhysics() {
        // Set acceleration based on state of pedals and steering wheel
        let accScalar = this.acceleratorPedal * ACCELERATION_RATE;
        let brakeFriction = this.brakePedal * BRAKE_RATE;
        let steeringFriction = abs(this.steeringWheel) * STEERING_DECELERATION_RATE;
        let frictionScalar = min(BASE_FRICTION + brakeFriction + steeringFriction, this.vel.mag());
        this.acc = p5.Vector.fromAngle(this.heading, accScalar - frictionScalar);

        let angleChange = this.steeringWheel * STEERING_RATE * min(3, sq(0.5 * this.vel.mag()));
        this.vel = p5.Vector.fromAngle(this.heading + angleChange, this.vel.mag());
    }

    tick() {
        // Keyboard input
        if (keyIsDown(80)) { // p
            this.acceleratorPedal = 1;
        } else {
            this.acceleratorPedal = 0;
        }
        if (keyIsDown(79)) { // o
            this.brakePedal = 1;
        } else {
            this.brakePedal = 0;
        }
        if (keyIsDown(76)) {
            this.steeringWheel += STEERING_CHANGE_RATE;
            if (this.steeringWheel > 1) {
                this.steeringWheel = 1;
            }
        } else if (keyIsDown(75)) {
            this.steeringWheel -= STEERING_CHANGE_RATE;
            if (this.steeringWheel < -1) {
                this.steeringWheel = -1;
            }
        } else {
            if (this.steeringWheel > STEERING_CHANGE_RATE) {
                this.steeringWheel -= STEERING_CHANGE_RATE;
            } else if (this.steeringWheel < -STEERING_CHANGE_RATE) {
                this.steeringWheel += STEERING_CHANGE_RATE;
            } else {
                this.steeringWheel = 0;
            }
        }

        for (let i = roads.length - 1; i >= 0; i--) { // reverse order for priority to a higher road
            let road = roads[i];
            if (road.pos1.copy().sub(this.pos).mag() < road.laneCount / 2 * LANE_WIDTH) {
                print("snap 1");
            } else if (road.pos2.copy().sub(this.pos).mag() < road.laneCount / 2 * LANE_WIDTH) {
                print("snap 2");
            }
        }

        // Set small vectors to 0
        if (this.vel.mag() < 0.001) {
            this.vel.setMag(0);
        }

        this.applyPhysics();

        // Update velocity and position
        this.vel.add(this.acc);
        this.pos.add(this.vel);

        // Update heading, but not if car is still
        if (this.vel.mag() > 0.001) {
            this.heading = this.vel.heading();
        }
    }

    render() {
        push();

        translate(this.pos);
        rotate(this.heading);

        // Main body
        fill(this.colour);
        rect(-(CAR_LENGTH / 2), -(CAR_WIDTH / 2), CAR_LENGTH, CAR_WIDTH);

        // Roof
        fill(lerpColor(this.colour, color(0, 0, 0), 0.3));
        rect(-(CAR_LENGTH * 0.4), -(CAR_WIDTH * 0.45), CAR_LENGTH * 0.5, CAR_WIDTH * 0.9);

        // Windowscreen
        fill(140, 180, 230, 240);
        rect(CAR_LENGTH * 0.1, -(CAR_WIDTH * 0.45), CAR_LENGTH * 0.1, CAR_WIDTH * 0.9);

        this.renderOverlay();

        pop();

        push();
        translate(this.pos);
        this.renderVectors();
        pop();
    }

    renderOverlay() {
        fill(0);
        textSize(12);
        text(`v = ${nf(this.vel.mag(), 0, 2)}`, 25, -24);
        text(`a = ${nf(this.acc.mag(), 0, 2)}`, 25, -12);
        text(`heading = ${nf(degrees(this.heading), 0, 1)} deg`, 25, 0);
        text(`accelerator = ${this.acceleratorPedal}`, 25, 12);
        text(`brake = ${this.brakePedal}`, 25, 24);

        let steeringBar = "";
        let len = 9;
        for (let i = 0; i < len; i++) {
            if (i === round(map(this.steeringWheel, -1, 1, 0, 8))) {
                steeringBar += "\u25a0";
            } else {
                steeringBar += "\u25a1";
            }
        }

        text(`steer = ${steeringBar}`, 25, 36);
    }

    renderVectors() {
        stroke(0);
        strokeWeight(7);
        point(0, 0);

        // Velocity
        stroke(220, 0, 0, 180);
        strokeWeight(3);
        line(0, 0, this.vel.x * 50, this.vel.y * 50);
        
        // Acceleration
        stroke(0, 220, 0, 180);
        strokeWeight(3);
        line(0, 0, this.acc.x * 500, this.acc.y * 500);
    }
}