let barList = [];
let sorter = bubbleSort(barList);

function setup() {
    createCanvas(1000, 800);

    for (let i = 0; i < 50; i++) {
        barList.push(new Bar(random()));
    }
}

function draw() {
    background(50);
    frameRate(60);

    for (let i = 0; i < barList.length; i++) {
        barList[i].render(i);
    }

    let sorted = sorter.next();
    if (!sorted.done) {
        barList = sorted.value;
    }

}

// Generator function, call for each step to be executed
function* bubbleSort(bars) {
    let sorted = false;
    while (!sorted) {
        // Each pass
        sorted = true;
        for (let i = 0; i < bars.length - 1; i++) {
            bars = [...bars];
            if (bars[i].size > bars[i + 1].size) {
                // Switch two bars
                [bars[i], bars[i + 1]] = [bars[i + 1], bars[i]];
                
                sorted = false;
            }
            yield bars;
        }
    }
    return bars;
}

function* insertionSort(bars) {
    for (let i = 1; i < bars.length; i++) { // For each bar
        bars = [...bars];
        for (let j = 0; j < i; j++) { // Check the position it need to go in
            if (bars[j].size > bars[i].size) {
                const barToMove = bars[i];
                bars.splice(i, 1); // Remove item
                bars.splice(j, 0, barToMove); // Add item back in
            }
        } 
        yield bars;
    }
}