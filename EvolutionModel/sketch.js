const animals = [];
const foodItems = [];
const maxX = 1000;
const maxY = 600;

function setup() {
    createCanvas(maxX + 30, maxY + 30);
    for (let i = 0; i < 20; i++) {
        animals.push(new Animal());
    }
}

function draw() {
    background(49, 126, 63);
    frameRate(60);

    // Create food randomly
    if (!(keyIsPressed && key === "Shift") && random(0, 1) > 0.98) {
        const index = foodItems.length;
        foodItems.push(new Food(() => foodItems[index] = null));
    }

    let population = 0;
    for (const animal of animals) {
        if (animal == null || !animal.alive) continue;
        population++;
        if (!(keyIsPressed && key === "Shift")) { // Pause when holding shift
            animal.tick();
        }
        animal.render();
    }

    for (const food of foodItems) {
        if (food == null || !food.alive) continue;
        if (!(keyIsPressed && key === "Shift")) { // Pause when holding shift
            food.tick();
        }
        food.render();
    }

    text(`Population: ${population}`, 5, 18);

    if (frameCount % 1000 === 0) {
        summary();
    }
}

function summary() {
    let population = 0;

    sumOfGenes = animals
        .filter(animal => { // Only living animals
            if (animal.alive) {
                population++;
                return true;
            }
            return false;
        })
        .map(animal => animal.genes) // Get their genes
        .reduce((prev, curr) => { // And sum them
            for (const gene in curr) {
                if (typeof curr[gene] === "number") {
                    prev = {...prev, [gene]: (prev[gene] || 0) + curr[gene]}
                }
            }
            return prev;
        }, {});

    const averageGenes = {};
    for (const gene in sumOfGenes) {
        averageGenes[gene] = sumOfGenes[gene] / population;
    }

    console.log(`========== Frame ${frameCount} ==========`);
    console.log(`Population: ${population}`);
    console.log(`Average genes: ${JSON.stringify(averageGenes)}`);
}