const LANE_WIDTH = 40;

class Road {
    constructor(pos1, pos2, laneCount) {
        this.pos1 = pos1;
        this.pos2 = pos2;
        this.laneCount = laneCount;
    }

    render() {

        push();
        
        // Calculate measurements
        let deltaX = this.pos2.x - this.pos1.x;
        let deltaY = this.pos2.y - this.pos1.y;
        let theta = atan2(deltaY, deltaX);
        let length = sqrt(sq(deltaX) + sq(deltaY));
        let width = LANE_WIDTH * this.laneCount;

        translate(this.pos1);
        rotate(theta);

        // Main rectangle
        fill(90);
        noStroke();
        rect(-(width / 2), -(width / 2), length + width, width);

        // Lines (to the left of each lane)
        stroke(255, 255, 255, 230);
        let linesEachSide = this.laneCount / 2;
        for (let i = -linesEachSide; i <= linesEachSide; i++) {

            // Centre and edge lines
            if (i === 0 || abs(i) === linesEachSide) {
                strokeWeight(2);
                line(-(width / 2), i * LANE_WIDTH, length + width / 2, i * LANE_WIDTH);
            }

            // For dashed line, repeat segments along length
            strokeWeight(1);
            let dashLength = 7;
            let dashSpacing = 25;
            for (let j = -(width / 2); j <= length + width / 2 - dashLength; j += dashLength + dashSpacing) {
                line(j, i * LANE_WIDTH, j + dashLength, i * LANE_WIDTH);
            }
        }
        
        // Start and end points for debugging
        stroke(255, 0, 0);
        strokeWeight(8);
        point(0, 0);
        point(length, 0);
        
        // Snap circles
        strokeWeight(3);
        noFill();
        ellipse(0, 0, this.laneCount * LANE_WIDTH);
        ellipse(length, 0, this.laneCount * LANE_WIDTH);
        
        pop();
    }
}