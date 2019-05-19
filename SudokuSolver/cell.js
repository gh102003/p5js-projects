class Cell {
    constructor(x, y, size) {
        this.pos = createVector(x, y);
        this.size = size;
        this.value = null;
        this.possibleValues = null;
    }

    /**
     * @returns true if this cell has been solved
     */
    solve() {
        this.possibleValues = [];
        if (this.value != null) return false; // Skip if already solved

        let possibleValues = validValues.filter(possibleValue => {
            if (this._numberIsInRow(possibleValue) ||
                this._numberIsInColumn(possibleValue) ||
                this._numberIsInBox(possibleValue)) {
                return false;
            }

            return true;
        });

        this.possibleValues = possibleValues;
        if (possibleValues.length === 1) {
            this.value = possibleValues[0];
            return true;
        }
        if (possibleValues.length < 1) {
            print("Error \u2014 this puzzle cannot be solved");
        }
        return false;
    }

    _numberIsInRow(num) {
        for (let column of grid) {
            if (column[this.pos.y].value === num) {
                return true;
            }
        }
        return false;
    }

    _numberIsInColumn(num) {
        for (let cell of grid[this.pos.x]) {
            if (cell.value === num) {
                return true;
            }
        }
        return false;
    }

    _numberIsInBox(num) {
        let startOfBoxX = this.pos.x - this.pos.x % dim;
        let startOfBoxY = this.pos.y - this.pos.y % dim;
        for (let x = startOfBoxX; x < startOfBoxX + dim; x++) {
            for (let y = startOfBoxY; y < startOfBoxY + dim; y++) {
                if (x === this.pos.x && y === this.pos.y) continue; // Skip if the cell is the same
                if (grid[x][y].value === num) {
                    return true;
                }
            }
        }

        return false;
    }

    onClick() {
        if (this.value == null) {
            this.value = 1;
        } else if (this.value > sq(dim) - 1) {
            this.value = null;
        } else {
            this.value++;
        }
    }

    render() {
        push();

        translate(p5.Vector.mult(this.pos, this.size));

        // Box
        fill(255);
        strokeWeight(3);
        stroke(0);
        rect(0, 0, this.size, this.size);

        // Extra thick lines
        strokeWeight(6);
        if (this.pos.x % dim === 0) {
            line(0, 0, 0, this.size);
        }
        if (this.pos.y % dim === 0) {
            line(0, 0, this.size, 0);
        }
        if (this.pos.x === sq(dim) - 1) {
            line(this.size, 0, this.size, this.size);
        }
        if (this.pos.y === sq(dim) - 1) {
            line(0, this.size, this.size, this.size);
        }

        // Value
        fill(0);
        noStroke();
        textSize(this.size * 0.7);
        textAlign(CENTER, CENTER);
        if (this.value) {
            text(this.value, this.size * 0.5, this.size * 0.55);
        }

        // Possible values
        textSize(this.size * 0.12);
        textAlign(LEFT, TOP);
        if (this.possibleValues) {
            text(this.possibleValues, this.size * 0.05, this.size * 0.05);
        }

        pop();
    }
}