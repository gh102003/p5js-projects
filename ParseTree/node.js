class Node {
    constructor(parent, partOfSpeech, data) {
        this.parent = parent;
        this.partOfSpeech = partOfSpeech;
        this.data = data;

        this.children = [];
    }

    draw(x, y, depth = 0) {
        // Formatting
        switch (this.partOfSpeech) {
            case "noun":
                fill(0, 120, 200);
                break;
            case "verb":
                fill(220, 140, 0);
                break;
            case "adjective":
                fill(130, 0, 255);
                break;
            case "adverb":
                fill(0, 180, 0);
                break;
            case "determiner":
                fill(180, 0, 0);
                break;

            default:
                fill(0);
                break;
        }

        if (this.data !== undefined) {
            text(this.partOfSpeech + ": " + this.data, x, y);
        } else {
            text(this.partOfSpeech, x, y);
        }

        for (let i = 0; i < this.children.length; i++) {
            let horizontalSpacing = 1000 / (depth + 1) + 200;
            let childX = x + horizontalSpacing * (i - (this.children.length - 1) * 0.5) / this.children.length;
            let childY = i % 2 === 1 ? y + 120 : y + 200;
            this.children[i].draw(childX, childY, depth + 1);
            fill(0);
            line(x + 50, y + 10, childX + 50, childY - 25);
        }
    }
}