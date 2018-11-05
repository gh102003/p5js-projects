var books = [];
var totalConcordance = {};
var totalTokenCount = 0;

function preload() {
    books.push(new Book("Christmas Carol", "Charles Dickens", "books/christmas_carol.txt"));
    books.push(new Book("Great Expectations", "Charles Dickens", "books/great_expectations.txt"));
    books.push(new Book("Oliver Twist", "Charles Dickens", "books/oliver_twist.txt"));
    books.push(new Book("Frankenstein", "Mary Shelley", "books/frankenstein.txt"));
    books.push(new Book("Pride and Prejudice", "Jane Austen", "books/pride_and_prejudice.txt"));
    books.push(new Book("Alice in Wonderland", "Lewis Carroll", "books/alice_in_wonderland.txt"));
}

function setup() {
    createCanvas(1650, 900);
    let sortModeRadio = createRadio();
    sortModeRadio.option("Word Frequency");
    sortModeRadio.option("WF-IDF");
    sortModeRadio.selected("Word Frequency");
    sortModeRadio.changed(function () {
        switch (sortModeRadio.value()) {
            case "Word Frequency":
                for (let i = 0; i < books.length; i++) {
                    books[i].sortFrequency();
                }
                break;
            case "WF-IDF":
                for (let i = 0; i < books.length; i++) {
                    books[i].sortInverseDocumentFrequency();
                }
                break;
        }
    });

    for (let i = 0; i < books.length; i++) {
        books[i].processText();
    }

    // Total Concordance - add the concordances of each book
    for (let i = 0; i < books.length; i++) {
        let book = books[i];
        for (let j = 0; j < book.uniqueTokens.length; j++) {
            let token = book.uniqueTokens[j];
            if (totalConcordance[token] === undefined) {
                totalConcordance[token] = books[i].concordance[token];
            } else {
                totalConcordance[token] += books[i].concordance[token];
            }
        }
        // Increase totalTokenCount
        totalTokenCount += book.tokenCount;
    }
}

function draw() {
    background(50);
    noStroke();

    for (let i = 0; i < books.length; i++) {
        fill(230);
        let book = books[i];
        textSize(24);
        text(book.toString(), i * 270 + 10, 30);
        let yPos = 80;
        for (let j = 0; j < 20; j++) {
            fill(230);
            let token = book.uniqueTokens[j];

            let proportion = book.concordance[token] / book.tokenCount

            // Text size
            let fontSize = proportion * 450 + 15;
            console.log(fontSize);
            
            textSize(fontSize);
            yPos += fontSize + 14;

            text(token + ": " + book.concordance[token], i * 270 + 10, yPos);

            // Bar
            colorMode(HSB);
            fill(min(proportion * 3500, 255), 100, 50);
            rect(i * 270 + 10, yPos + 3, proportion * 3000, 7);
            colorMode(RGB);
        }
    }
}