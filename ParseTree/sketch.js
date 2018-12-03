var input = {
    subject: {
        determiner: "a",
        adjective: "spotty",
        noun: "cat"
    },
    verb_phrase: {
        adverb: "slowly",
        verb: "ate"
    },
    object: {
        determiner: "the",
        adjective: "dirty",
        noun: "food"
    }
};

var sentenceNode;
var sentenceText;

function setup() {
    createCanvas(1600, 800);
    sentenceNode = treeFromJSON(input, sentenceNode);
    sentenceText = sentenceFromTree(sentenceNode);
    console.log(sentenceNode);
    console.log(sentenceText);
}

function draw() {
    background(220);
    fill(0);
    textSize(24);

    sentenceNode.draw(width / 2, 50);
    text(sentenceText, width / 2, height - 100);
}

function treeFromJSON(json, parent) {
    if (parent === undefined) {
        parent = new Node(null, "sentence");
    }

    for (let key in json) {
        // The part of speech should be the key
        let partOfSpeech = key.toString();

        // If we've reached the last node
        if (typeof (json[key]) === "string") {
            parent.children.push(new Node(parent, partOfSpeech, json[key]));
        } else {
            parent.children.push(treeFromJSON(json[key], new Node(parent, partOfSpeech)));
        }
    }

    return parent;
}

function sentenceFromTree(node) {
    let part = "";
    for (let i = 0; i < node.children.length; i++) {
        let child = node.children[i];
        if (child.data !== undefined) {
            part += (child.data + " ");
        } else {
            part += (sentenceFromTree(child));
        }
    }
    return part;
}