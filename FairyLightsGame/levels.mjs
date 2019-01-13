export var levels = [
    {
        "name": "Just beginning",
        "hint": "Click the red lights to turn them on",
        "lights": [
            {"type": "white", "state": true},
            {"type": "red", "state": false},
            {"type": "white", "state": true},
            {"type": "white", "state": true},
            {"type": "white", "state": true},
            {"type": "red", "state": false}
        ]
    },
    {
        "name": "More of the same",
        "lights": [
            {"type": "white", "state": true},
            {"type": "white", "state": true},
            {"type": "red", "state": false},
            {"type": "white", "state": true},
            {"type": "red", "state": false},
            {"type": "red", "state": true},
            {"type": "white", "state": true},
            {"type": "white", "state": true},
            {"type": "white", "state": true},
            {"type": "red", "state": false}
        ]
    },
    {
        "name": "Green lights",
        "hint": "Clicking a green light will toggle itself and its neighbours",
        "lights": [
            {"type": "white", "state": false},
            {"type": "green", "state": false},
            {"type": "red", "state": false},
            {"type": "white", "state": true},
            {"type": "white", "state": false},
            {"type": "green", "state": false},
            {"type": "red", "state": true}
        ]
    },
    {
        "name": "Overlapping greens",
        "hint": "Use the greens to toggle the whites",
        "lights": [
            {"type": "white", "state": true},
            {"type": "red", "state": false},
            {"type": "green", "state": false},
            {"type": "green", "state": false},
            {"type": "white", "state": false},
            {"type": "red", "state": false}
        ]
    },
    {
        "name": "Symmetrical",
        "lights": [
            {"type": "red", "state": true},
            {"type": "green", "state": false},
            {"type": "white", "state": true},
            {"type": "green", "state": false},
            {"type": "green", "state": true},
            {"type": "green", "state": false},
            {"type": "white", "state": true},
            {"type": "green", "state": false},
            {"type": "red", "state": true}
        ]
    },
    {
        "name": "Stepping up the difficulty",
        "lights": [
            {"type": "red", "state": true},
            {"type": "red", "state": false},
            {"type": "green", "state": false},
            {"type": "white", "state": false},
            {"type": "white", "state": true},
            {"type": "green", "state": false},
            {"type": "green", "state": true},
            {"type": "green", "state": true},
            {"type": "red", "state": false}
        ]
    },
    {
        "name": "Yellows",
        "hint": "Yellow lights are more powerful versions of greens",
        "lights": [
            {"type": "white", "state": false},
            {"type": "green", "state": false},
            {"type": "white", "state": true},
            {"type": "white", "state": false},
            {"type": "yellow", "state": false},
            {"type": "red", "state": true},
            {"type": "white", "state": false}
        ]
    },
    {
        "name": "Double yellows",
        "lights": [
            {"type": "green", "state": false},
            {"type": "white", "state": false},
            {"type": "green", "state": false},
            {"type": "red", "state": false},
            {"type": "yellow", "state": false},
            {"type": "green", "state": false},
            {"type": "yellow", "state": false},
            {"type": "red", "state": true},
            {"type": "white", "state": false},
            {"type": "white", "state": false},
            {"type": "green", "state": false},
        ]
    },
    {
        "name": "Yellow and green",
        "lights": [
            {"type": "green", "state": true},
            {"type": "yellow", "state": false},
            {"type": "green", "state": true},
            {"type": "green", "state": true},
            {"type": "yellow", "state": false},
            {"type": "green", "state": false},
            {"type": "yellow", "state": false},
            {"type": "green", "state": false},
            {"type": "green", "state": false}
        ]
    },
    {
        "name": "Sky blue",
        "hint": "Blue lights toggle their neighbours, but not themselves",
        "lights": [
            {"type": "red", "state": false},
            {"type": "green", "state": true},
            {"type": "blue", "state": false},
            {"type": "white", "state": true},
            {"type": "green", "state": false},
            {"type": "white", "state": false},
        ]
    },
    {
        "name": "Rainbow",
        "lights": [
            {"type": "red", "state": false},
            {"type": "red", "state": false},
            {"type": "yellow", "state": false},
            {"type": "yellow", "state": false},
            {"type": "green", "state": false},
            {"type": "green", "state": false},
            {"type": "blue", "state": false},
            {"type": "blue", "state": false}
        ]
    },
    {
        "name": "Random",
        "lights": [
            {"type": "green", "state": true},
            {"type": "blue", "state": false},
            {"type": "yellow", "state": false},
            {"type": "white", "state": false},
            {"type": "green", "state": false},
            {"type": "red", "state": false},
            {"type": "blue", "state": true},
            {"type": "white", "state": false}
        ]
    },
    {
        "name": "Pink",
        "hint": "Pink lights will toggle all lights in the direction of their arrow",
        "lights": [
            {"type": "blue", "state": false},
            {"type": "green", "state": true},
            {"type": "pink", "state": true, "parameters": {"direction": "right"}},
            {"type": "white", "state": false},
            {"type": "white", "state": false},
            {"type": "white", "state": false},
            {"type": "white", "state": false},
            {"type": "red", "state": true},
        ]
    }
];