const blueprints = [
    {
        "levels": [
            {   
                "level": 0,
                "coordinates": [142, -60, -179], 
                "placement":
                [
                    ["stone", "stone", "oak_door", "stone", "stone"],
                    ["stone", "air", "air", "air", "stone"],
                    ["stone", "air", "air", "air", "stone"],
                    ["stone", "stone", "stone", "stone", "stone"]
                ]
            },
            {
                "level": 1,
                "coordinates": [142, -59, -179],
                "placement":
                [
                    ["stone", "stone", "oak_door", "stone", "stone"],
                    ["stone", "air", "air", "air", "stone"],
                    ["stone", "air", "air", "air", "stone"],
                    ["stone", "stone", "stone", "stone", "stone"]
                ]
            },
            {
                "level": 2,
                "coordinates": [142, -58, -179],
                "placement":
                [
                    ["oak_planks", "oak_planks", "oak_planks", "oak_planks", "oak_planks"],
                    ["oak_planks", "oak_planks", "oak_planks", "oak_planks", "oak_planks"],
                    ["oak_planks", "oak_planks", "oak_planks", "oak_planks", "oak_planks"],
                    ["oak_planks", "oak_planks", "oak_planks", "oak_planks", "oak_planks"]
                ]
            }
        ]
    }, 
    {
        "levels": [
            {
                "level": 0,
                "coordinates": [0, 0, 0],
                "placement": [
                    ["air", "air", "air", "brick", "brick", "brick", "air", "air", "air"],
                    ["air", "air", "brick", "brick", "air", "air", "brick", "brick", "air"],
                    ["air", "brick", "brick", "air", "air", "air", "brick", "brick", "air"],
                    ["brick", "brick", "air", "air", "air", "air", "air", "brick", "brick"],
                    ["brick", "air", "air", "air", "air", "air", "air", "air", "brick"],
                    ["brick", "brick", "air", "air", "air", "air", "air", "brick", "brick"],
                    ["air", "brick", "brick", "air", "air", "air", "brick", "brick", "air"],
                    ["air", "air", "brick", "brick", "air", "air", "brick", "brick", "air"],
                    ["air", "air", "air", "brick", "brick", "brick", "air", "air", "air"]
                ]
            }
        ]
    }, 
    {
        "levels": [
            {
                "level": 0,
                "coordinates": [0, 0, 0],
                "placement": [
                    ["stone", "stone", "stone", "stone", "oak_door", "stone", "stone", "stone", "stone"],
                    ["stone", "air", "air", "air", "air", "air", "air", "air", "stone"],
                    ["stone", "air", "air", "air", "air", "air", "air", "air", "stone"],
                    ["stone", "air", "air", "air", "air", "air", "air", "air", "stone"],
                    ["stone", "stone", "stone", "stone", "oak_door", "stone", "stone", "stone", "stone"],
                    ["stone", "air", "air", "air", "air", "air", "air", "air", "stone"],
                    ["stone", "air", "air", "air", "air", "air", "air", "air", "stone"],
                    ["stone", "air", "air", "air", "air", "air", "air", "air", "stone"],
                    ["stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone"]
                ]
            }, 
            {
                "level": 1,
                "coordinates": [0, 0, 0],
                "placement": [
                    ["stone", "stone", "stone", "stone", "oak_door", "stone", "stone", "stone", "stone"],
                    ["stone", "air", "air", "air", "air", "air", "air", "air", "stone"],
                    ["stone", "air", "air", "air", "air", "air", "air", "air", "stone"],
                    ["stone", "air", "air", "air", "air", "air", "air", "air", "stone"],
                    ["stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone"],
                    ["stone", "air", "air", "air", "air", "air", "air", "air", "stone"],
                    ["stone", "air", "air", "air", "air", "air", "air", "air", "stone"],
                    ["stone", "air", "air", "air", "air", "air", "air", "air", "stone"],
                    ["stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone"]
                ]
            }, 
            {
                "level": 2,
                "coordinates": [0, 0, 0],
                "placement": [
                    ["stone", "stone", "stone", "stone", "oak_door", "stone", "stone", "stone", "stone"],
                    ["stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone"],
                    ["stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone"],
                     ["stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone"],
                    ["stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone"],
                     ["stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone"],
                     ["stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone"],
                     ["stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone"],
                    ["stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone", "stone"]
                ]
            }, 
        ]
    }
]

export const example_blueprints = [
    [
        {"role": "user", "content": "Generate a 5x4 house with an oak_door and an oak_planks roof with walls made of stone. Return your output in json"},
        {"role": "assistant", "content": JSON.stringify(blueprints[0])}
    ], 
    [
        {"role": "user", "content": "Make a circular room. Return your output in json."},
        {"role": "assistant", "content": JSON.stringify(blueprints[1])}
    ], 
    [
        {"role": "user", "content": "Generate a blueprint of a house with "},
        {"role": "assistant", "content": JSON.stringify(blueprints[2])}
    ]      
]