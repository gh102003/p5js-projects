class Verb {
    constructor(infinitive) {
        this.infinitive = infinitive;

        this.stem = infinitive.split("to ")[1];
        this.pastParticiple = this.stem + "ed";
        this.presentParticiple = this.stem + "ing";

        this.forms = {
            "present": {
                "singular": {
                    1: this.stem,
                    2: this.stem,
                    3: this.stem + "s"
                },
                "plural": {
                    1: this.stem,
                    2: this.stem,
                    3: this.stem
                }
            },
            "past": {
                "singular": {
                    1: this.pastParticiple,
                    2: this.pastParticiple,
                    3: this.pastParticiple
                },
                "plural": {
                    1: this.pastParticiple,
                    2: this.pastParticiple,
                    3: this.pastParticiple
                }
            }
        }

        // Special cases
        if (this.stem.match(/(ch|sh|x|z|ss|o)$/)) { // -ch, -sh, -x, -z, -ss, -o
            this.forms["present"]["singular"][3] = this.stem + "es";
        } else if (this.stem.match(/y$/)) { // -y
            this.forms["present"]["singular"][3] = this.stem.replace(/y$/, "ies");

            this.pastParticiple = this.stem.replace(/y$/, "ied");
            this.forms["past"]["singular"] = [null, this.pastParticiple, this.pastParticiple, this.pastParticiple];
            this.forms["past"]["plural"] = [null, this.pastParticiple, this.pastParticiple, this.pastParticiple];
        } else if (this.stem.match(/e$/)) { // -e
            this.forms["present"]["singular"][3] = this.stem + "s";

            this.pastParticiple = this.stem + "d";
            this.forms["past"]["singular"] = [null, this.pastParticiple, this.pastParticiple, this.pastParticiple];
            this.forms["past"]["plural"] = [null, this.pastParticiple, this.pastParticiple, this.pastParticiple];
        }
    }

    // person is a number between 1 and 3
    // number is either "singular" or "plural"
    // tense is either "past", "present" or "future"
    // aspect is either "simple", "perfect", "continuous" or "perfect continuous"
    conjugate(person, number, tense, aspect) {

        let auxiliaryVerbs = "";

        // Continuous aspect -> Simple of 'to be' + present participle
        if (aspect === "continuous") {
            auxiliaryVerbs = verbToBe.conjugate(person, number, tense, "simple") + " ";
            return auxiliaryVerbs + this.presentParticiple;
        }

        // Perfect continuous aspect -> Perfect of 'to be' + present participle
        if (aspect === "perfect continuous") {
            auxiliaryVerbs = verbToBe.conjugate(person, number, tense, "perfect") + " ";
            return auxiliaryVerbs + this.presentParticiple;
        }

        // Perfect aspect -> Simple of 'to have' + past participle
        if (aspect === "perfect") {
            auxiliaryVerbs = verbToHave.conjugate(person, number, tense, "simple") + " ";
            return auxiliaryVerbs + this.pastParticiple;
            // return auxiliaryVerbs + this.getParticiple();
        }

        // Simple future -> 'will' + stem
        if (tense === "future") {
            return "will " + this.stem;
        }

        // Otherwise (i.e. for present simple and past simple), use the forms lookup object
        return this.forms[tense][number][person];
    }
}

// Define irregular verbs
const verbToBe = new Verb("to be");
verbToBe.presentParticiple = "being"
verbToBe.pastParticiple = "been";
verbToBe.forms = {
    "present": {
        "singular": {
            1: "am",
            2: "are",
            3: "is"
        },
        "plural": {
            1: "are",
            2: "are",
            3: "are"
        }
    },
    "past": {
        "singular": {
            1: "was",
            2: "were",
            3: "was"
        },
        "plural": {
            1: "were",
            2: "were",
            3: "were"
        }
    }
}

const verbToHave = new Verb("to have");
verbToHave.presentParticiple = "having"
verbToHave.pastParticiple = "had";
verbToHave.forms = {
    "present": {
        "singular": {
            1: "have",
            2: "have",
            3: "has"
        },
        "plural": {
            1: "have",
            2: "have",
            3: "have"
        }
    },
    "past": {
        "singular": {
            1: "had",
            2: "had",
            3: "had"
        },
        "plural": {
            1: "had",
            2: "had",
            3: "had"
        }
    }
}

const verbToEat = new Verb("to eat");
verbToEat.presentParticiple = "eating"
verbToEat.pastParticiple = "eaten";
verbToEat.forms = {
    "present": {
        "singular": {
            1: "eat",
            2: "eat",
            3: "eats"
        },
        "plural": {
            1: "eat",
            2: "eat",
            3: "eat"
        }
    },
    "past": {
        "singular": {
            1: "ate",
            2: "ate",
            3: "ate"
        },
        "plural": {
            1: "ate",
            2: "ate",
            3: "ate"
        }
    }
}