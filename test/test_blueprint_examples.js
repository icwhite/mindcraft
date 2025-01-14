import { Examples } from '../src/utils/examples.js';
import { GPT } from '../src/models/gpt.js';


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



const few_shot_examples = [
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
console.log(few_shot_examples);
const embedding = { api: 'openai' }
let embedding_model = new GPT(embedding.model, embedding.url);
let blueprint_examples = new Examples(embedding_model);
await blueprint_examples.load(few_shot_examples);

const messages = [
    {"role": "user", "content": "make a house. respond in json"},
];
const example_messages = await blueprint_examples.createExampleMessage(messages);
console.log(example_messages);

let chat = { model: 'gpt-4o', api: 'openai' }
const chat_model = new GPT(chat.model, chat.url);

const response = await chat_model.sendRequest(messages, example_messages);
const json_response = JSON.parse(response);
console.log(json_response);





