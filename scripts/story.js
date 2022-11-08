import colors from 'colors'
import { diceRoll, sleep } from "../helper.js";
import storyFile from '../assets/main.json' assert { type: 'json' };
import inquirer from 'inquirer'


const storyFunction = async (node, character) => {
    console.clear()

    if(node.type === "choice"){
        let allChoices = []
        for(let choice of node.event){
            allChoices.push(choice.name)
        }

        const inputChoice = await inquirer.prompt({
            type: "list",
            name: "choice",
            message: `"${node.text}"`.blue,
            choices: allChoices
        }).then((answers) => {
            console.log(answers)
        })
    }    
}

export const story = (node, character) =>{
    storyFunction(node, character)
}