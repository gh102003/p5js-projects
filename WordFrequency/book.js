class Book {
    constructor(title, author, path) {
        this.title = title;
        this.author = author;
        this.lines = loadStrings(path);
        this.concordance = {};
    }

    // Converts lines into an array of words and count them
    processText() {
        // Convert to one string and remove numbers and some punctuation
        let allText = this.lines.join(" ").replace(/(?<!s)\d(?!s)/g, "").replace(/\s['’‘“”"()]\w+['’‘“”"()]\s/g, /\1/);
        // Split words and remove speech marks and non-word characters
        let tokens = allText.split(/[^a-zA-Z0-9'’‘“”"]/).filter(word => word.match(/^\w+'?\w*$/));
        
        // Count words
        for (let i = 0; i < tokens.length; i++) {
            tokens[i] = tokens[i].toLowerCase();
            
            let token = tokens[i];
            if (this.concordance[token] === undefined) {
                this.concordance[token] = 1;
            } else {
                this.concordance[token]++;
            }
        }
        
        this.tokenCount = tokens.length;
        this.uniqueTokens = Object.keys(this.concordance);

        this.sortFrequency();
    }

    sortFrequency() {
        this.uniqueTokens.sort((a, b) => {
            return this.concordance[b] - this.concordance[a];
        });
    }

    sortInverseDocumentFrequency() {
        this.uniqueTokens.sort((a, b) => {
            let docFreqA = totalConcordance[a] / totalTokenCount;
            let docFreqB = totalConcordance[b] / totalTokenCount;
            
            let bookFreqA = this.concordance[a] / this.tokenCount;
            let bookFreqB = this.concordance[b] / this.tokenCount;
            
            return (bookFreqB - docFreqB * 1.8) - (bookFreqA - docFreqA * 1.8);
        });
    }

    toString() {
        return `${this.title}\nby ${this.author}`;
    }
}