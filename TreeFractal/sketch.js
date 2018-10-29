var root;
var separationSlider, childrenSlider, minLengthSlider;
var xMotion = 0;

function setup() {
  createCanvas(1600, 1020, P2D);
  root = new Branch(180, 0);

  // Sliders
  let slidersDiv = createDiv();

  separationSlider = createSlider(0, PI / 2, PI / 4, 0);
  separationSlider.parent(slidersDiv);
  let separationLabel = createP("Seperation: " + (separationSlider.value() / PI).toFixed(2) + "\u03C0");
  separationLabel.parent(slidersDiv);
  separationSlider.changed(function () {
    separationLabel.html("Seperation: " + (separationSlider.value() / PI).toFixed(2) + "\u03C0");
  });

  childrenSlider = createSlider(1, 3, 2);
  childrenSlider.parent(slidersDiv);
  let childrenLabel = createP("Children: " + childrenSlider.value());
  childrenLabel.parent(slidersDiv);
  childrenSlider.changed(function () {
    childrenLabel.html("Children: " + childrenSlider.value());
    root.branch(childrenSlider.value());
  });

  minLengthSlider = createSlider(20, 50, 30);
  minLengthSlider.parent(slidersDiv);
  let minLengthLabel = createP("Min length: " + minLengthSlider.value());
  minLengthLabel.parent(slidersDiv);
  minLengthSlider.changed(function () {
    minLengthLabel.html("Min length: " + minLengthSlider.value());
    root.branch(childrenSlider.value());
  });

  leafChanceSlider = createSlider(0, 0.9, 0.7, 0);
  leafChanceSlider.parent(slidersDiv);
  let leafChanceLabel = createP("Leaf chance: " + leafChanceSlider.value() * 100 + "%");
  leafChanceLabel.parent(slidersDiv);
  leafChanceSlider.changed(function () {
    leafChanceLabel.html("Leaf chance: " + (leafChanceSlider.value() * 100).toFixed(1) + "%");
    root.branch(childrenSlider.value());
  });

  root.branch(childrenSlider.value());
}

function draw() {
  frameRate(30);
  background(180, 200, 220);
  strokeWeight(3);
  translate(width / 2, height);

  calculateMotion();

  root.draw();
}

function calculateMotion() {
  xMotion = constrain(xMotion + (mouseX - width / 2) / width, -50, 50);
}

function Branch(length, depth) {
  this.length = length;
  this.depth = depth;
  this.branches = [];
  this.leaves = [];
  this.motionFactor = random(0.5, 1.5);

  this.draw = function () {
   stroke(min(60 + this.depth * 6, 120), min(30 + this.depth * 5, 86), min(this.depth * 5, 86));
    let branchThickness = max(3, 40 - this.depth * 5)
    strokeWeight(branchThickness);
    line(0, 0, 0, -this.length);
    translate(0, -this.length);

    let interval = separationSlider.value() / (this.branches.length - 1);
    for (let i = 0; i < this.branches.length; i++) {
      push();
      rotate(-(separationSlider.value() / 2) + interval * i + xMotion * 0.005 * this.motionFactor);
      this.branches[i].draw();
      pop();
    }

    // Leaves
    noStroke();
    for (let i = 0; i < this.leaves.length; i++) {
      this.leaves[i].draw(branchThickness);
    }
  }

  this.branch = function (children) {
    // Leaves
    this.leaves = []
    if (this.depth > 2) {
      while (random() < leafChanceSlider.value()) {
        let sizeX = random(12, 20);
        this.leaves.push(new Leaf(constrain(randomGaussian(), -1, 1), random(0, this.length), sizeX, sizeX * random(0.4, 1.6)));
      }
    }

    this.branches = []
    if (this.length > minLengthSlider.value()) {
      for (let i = 0; i < children; i++) {
        let branch = new Branch(this.length * random(0.5, 1), this.depth + 1);
        branch.branch(children);
        this.branches.push(branch);
      }
    }
  }
}

function Leaf(xOffset, yPos, sizeX, sizeY) {
  this.xOffset = xOffset;
  this.yPos = yPos;
  this.sizeX = sizeX;
  this.sizeY = sizeY;
  this.colour = color(50 + random(-20, 20), 150 + random(-30, 30), 50 + random(-20, 20), 220 + random(-20, 20));

  this.draw = function (branchThickness) {
    fill(this.colour);
    ellipse(branchThickness * this.xOffset, this.yPos, this.sizeX, this.sizeY);
  }
}