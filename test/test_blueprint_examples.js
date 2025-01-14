import { Examples } from '../src/utils/examples.js';
import { GPT } from '../src/models/gpt.js';
import { readFileSync } from 'fs';



const blueprints = JSON.parse(readFileSync('example_blueprints.json', 'utf8'));
console.log(blueprints);

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
    {"role": "user", "content": "make a house where the walls are made of oak_planks and the ceiling is made of stone. respond in json"},
];
const example_messages = await blueprint_examples.createExampleMessage(messages);
console.log(example_messages);

let chat = { model: 'gpt-4o', api: 'openai' }
const chat_model = new GPT(chat.model, chat.url);

const response = await chat_model.sendRequest(messages, example_messages + "Please respond in json. Don't use ``` to format your response.");
// console.log(response);
try {
    const json_response = JSON.parse(response);
    console.log(JSON.stringify(json_response));
} catch (err) {
    console.log("parse failed for json response");
    console.log(response);
}





