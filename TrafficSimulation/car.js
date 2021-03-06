const CAR_WIDTH = 25;
const CAR_LENGTH = 45;
const BASE_FRICTION = 0.08;

const STEERING_CHANGE_RATE = 0.2;
const STEERING_RATE = 0.025;
const STEERING_DECELERATION_RATE = 0.03;
const STEERING_AUTO_CENTRE_RATE = 0.05;

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

        // Target
        this.targetPos = null;
        this.targetHeading = null;

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
        // print("snap " + direction);
        let deltaX, deltaY;
        if (direction > 0) {
            deltaX = road.pos2.x - road.pos1.x;
            deltaY = road.pos2.y - road.pos1.y;
        } else if (direction < 0) {
            deltaX = road.pos1.x - road.pos2.x;
            deltaY = road.pos1.y - road.pos2.y;
        }
        let roadAngle = atan2(deltaY, deltaX);
        // this.vel.rotate(roadAngle - this.heading);
        this.targetHeading = roadAngle;
    }

    /**
     * Moves the car towards its target position and heading
     * 
     * Assumes this.heading is correct
     */
    moveToTarget() {
        // Adjust heading using steering wheel
        if (this.targetHeading) {
            let rotationNeeded = this.targetHeading - this.heading;
            if (rotationNeeded > PI) rotationNeeded -= TWO_PI;
            if (rotationNeeded < -PI) rotationNeeded += TWO_PI;
            
            console.log(degrees(rotationNeeded));
            
            this.steeringWheel = max(-1, min(1, this.steeringWheel + rotationNeeded * 0.12));
            
            // Lose target if no rotation is needed
            if (abs(rotationNeeded) < 0.002 ) {
                this.targetHeading = null;
            }
        }
    }

    applyPhysics() {
        // Set acceleration based on state of pedals and steering wheel
        let accScalar = this.acceleratorPedal * ACCELERATION_RATE;
        let brakeFriction = this.brakePedal * BRAKE_RATE;
        let steeringFriction = abs(this.steeringWheel) * STEERING_DECELERATION_RATE;
        let frictionScalar = min(BASE_FRICTION + brakeFriction + steeringFriction, this.vel.mag());
        this.acc = p5.Vector.fromAngle(this.heading, accScalar - frictionScalar);

        let angleChange = this.steeringWheel * STEERING_RATE * min(4, sq(0.4 * this.vel.mag()));
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
        }

        // Auto centre steering wheel
        if (this.steeringWheel > STEERING_AUTO_CENTRE_RATE) {
            this.steeringWheel -= STEERING_AUTO_CENTRE_RATE;
        } else if (this.steeringWheel < -STEERING_AUTO_CENTRE_RATE) {
            this.steeringWheel += STEERING_AUTO_CENTRE_RATE;
        }

        // Set small vectors to 0
        if (this.vel.mag() < 0.001) {
            this.vel.setMag(0);
        }

        this.applyPhysics();
        
        // Update velocity and position
        this.vel.add(this.acc);
        this.pos.add(this.vel);

        for (let i = roads.length - 1; i >= 0; i--) { // reverse order for priority to a higher road
            let road = roads[i];
            if (road.pos1.copy().sub(this.pos).mag() < road.laneCount / 2 * LANE_WIDTH) {
                this.followRoad(road, 1);
            } else if (road.pos2.copy().sub(this.pos).mag() < road.laneCount / 2 * LANE_WIDTH) {
                this.followRoad(road, -1);
            }
        }

        this.moveToTarget();

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

        // Target heading
        if (this.targetHeading) {
            stroke(50, 50, 220, 180);
            strokeWeight(3);
            line(0, 0, 100 * cos(this.targetHeading), 100 * sin(this.targetHeading));
        }
    }
}