/// <reference path="../lib/p5.global-mode.d.ts" />
/// <reference path="./cell.js" />

let grid = [];
let size = 80;
let dim = 3;

let gridOffsetX;
let gridOffsetY;

let validValues = [];

function setup() {
    createCanvas(1200, 900);

    for (let i = 0; i < sq(dim); i++) {
        validValues.push(i + 1);
    }

    gridOffsetX = (width - size * sq(dim)) / 2;
    gridOffsetY = (height - size * sq(dim)) / 2;

    for (let x = 0; x < sq(dim); x++) {
        grid[x] = [];
        for (let y = 0; y < sq(dim); y++) {
            grid[x][y] = new Cell(x, y, size);
        }
    }

    print(grid);
}

function draw() {
    frameRate(10);
    background(230, 210, 170);

    translate(gridOffsetX, gridOffsetY);

    for (let column of grid) {
        for (let cell of column) {
            cell.render();
        }
    }
}

function solve() {
    let pass = 1;
    let changesThisPass;

    do {
        print(`Solving \u2014 pass ${pass}`);
        changesThisPass = 0;

        // Setup rows and boxes arrays
        let rows = [];
        let boxes = [];
        for (let i = 0; i < sq(dim); i++) {
            rows.push([]);
            boxes.push([]);
        }

        // Solve for each cell and column and fill rows and boxes arrays
        for (let i = 0; i < grid.length; i++) {
            let column = grid[i];
            for (let j = 0; j < column.length; j++) {

                rows[j].push(column[j]);
                boxes[floor(i / dim) * dim + floor(j / dim)].push(column[j]);

                if (column[j].solve()) {
                    changesThisPass++;
                }
            }
            changesThisPass += solveGroup(column);
        }

        // Solve for each row and box
        for (let row of rows) {
            changesThisPass += solveGroup(row);
        }
        for (let box of boxes) {
            changesThisPass += solveGroup(box);
        }

        pass++;
    } while (changesThisPass > 0 && pass < 100);
    // } while (false);
}

/**
 * With a group of cells, fills in any which are the only place a number can go
 * 
 * Example: if there is only one possible cell for a 2 in a row, it will be set to 2
 * 
 * @param cellGroup a group of cells with exclusivity like a row, column, or box
 * @returns changes made by this function
 */
function solveGroup(cellGroup) {
    let changes = 0;
    let indexesOfPossibleValues = [];

    // Fill out object
    for (let i = 0; i < cellGroup.length; i++) {
        let cell = cellGroup[i];
        for (let possibleValue of cell.possibleValues) {
            if (!indexesOfPossibleValues[possibleValue] ) {
                indexesOfPossibleValues[possibleValue] = [];
            }
            indexesOfPossibleValues[possibleValue].push(i);
        }
        if (cell.value) {
            if (!indexesOfPossibleValues[cell.value] ) {
                indexesOfPossibleValues[cell.value] = [];
            }
            indexesOfPossibleValues[cell.value].push(i);
        }
    }

    // Check object for values with only one possible cell
    for (let i = 0; i < indexesOfPossibleValues.length; i++) {
        let possibleCells = indexesOfPossibleValues[i];
        if (possibleCells !== undefined && possibleCells.length === 1) {
            cellGroup[possibleCells[0]].value = i;
            cellGroup[possibleCells[0]].possibleValues = [];
            changes++;
        }
    }
    return changes;
}

function mouseClicked() {
    let x = floor((mouseX - gridOffsetX) / size);
    let y = floor((mouseY - gridOffsetY) / size);

    if (x >= 0 && x < grid.length && y >= 0 && y < grid[x].length) {
        grid[x][y].onClick();
    }
}

function keyTyped() {
    if (key === "s") {
        solve();
    }

    return false;
}