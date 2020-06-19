
let devicePosition;
let deviceVelocity;

window.onload = function () {
    const btnAllowMotionTracking = document.getElementById("btn-allow-motion-tracking");
    btnAllowMotionTracking.addEventListener("click", function () {
        if (typeof DeviceMotionEvent.requestPermission === "function") {
            DeviceMotionEvent.requestPermission()
                .then(permissionState => {
                    if (permissionState === "granted") {
                        // window.addEventListener("devicemotion", () => { });
                    }
                })
                .catch(console.error);
        } else {
            // handle regular non iOS 13+ devices
        }
    });
};

function pollAccelerometer(pollingStep) { // in seconds
    // Set up polling for acceleration
    setInterval(() => {
        const a = createVector(accelerationX, accelerationY, accelerationZ);
        
        const u = deviceVelocity;
        const t = pollingStep;

        // Calculate position
        const s1 = p5.Vector.mult(u, t);
        const s2 = p5.Vector.mult(a, (0.5 * t * t));
        const s = p5.Vector.add(s1, s2);

        // Calculate new velocity for next poll
        const v = p5.Vector.add(u, p5.Vector.mult(a, t));
        deviceVelocity = v;

        // Mutate device position
        devicePosition.add(s);
    }, pollingStep * 1000);
}

function setup() {
    createCanvas(500, 500);
    devicePosition = createVector(0, 0, 0);
    deviceVelocity = createVector(0, 0, 0);
    pollAccelerometer(0.001);
}

function draw() {

    background(160, 230, 210);

    fill(0, 0, 0);
    text("x: " + accelerationX, 30, 40);
    text("y: " + accelerationY, 30, 70);
    text("z: " + accelerationZ, 30, 100);

    text("x: " + deviceVelocity.x, 200, 40);
    text("y: " + deviceVelocity.y, 200, 70);
    text("z: " + deviceVelocity.z, 200, 100);
    
    // Reference lines
    stroke(150, 150, 150);
    for (let x = 0; x < width; x += 20) {
        line(x, 0, x, height);
    }
    for (let y = 0; y < height; y += 20) {
        line(0, y, width, y);
    }
    
    fill(214, 24, 82);
    ellipse(width / 2 - accelerationX * 10, height / 2 - accelerationY * 10, 100, 100);
    
    fill(41, 85, 149);
    ellipse(width / 2 + devicePosition.x * 100, height / 2 + devicePosition.y * 100, 100, 100);
}