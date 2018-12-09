export var levels = [
    {
        "name": "Just Beginning",
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
        "name": "Green Lights",
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
        "lights": [
            {"type": "white", "state": true},
            {"type": "red", "state": false},
            {"type": "green", "state": false},
            {"type": "green", "state": false},
            {"type": "white", "state": false},
            {"type": "red", "state": false}
        ]
    }
];