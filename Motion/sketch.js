var angle;

function setup() {
  createCanvas(1200, 800);
  angle = PI + HALF_PI;
}

function draw() {
  background(230);
  noFill();
  
  // Outer circle
  strokeWeight(30);
  stroke(200);
  let circleRadius = 200;
  ellipse(300, 300, circleRadius * 2);

  // Shadow (radial gradient)
  for (let r = circleRadius - 15; r < circleRadius; r++) {
    strokeWeight(1);
    stroke(200 + (r - circleRadius) * 2);
    ellipse(300, 300, r * 2);
  }
  
  // Inner ring
  let size = 0.8 + sin(angle) / 2;
  strokeWeight(18);
  stroke(150);
  arc(300, 300, 400, 400, angle - size / 2, angle + size / 2);

  angle = (angle + 0.04) % TWO_PI;
}