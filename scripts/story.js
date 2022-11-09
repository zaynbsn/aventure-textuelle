import colors from 'colors'
import { diceRoll, sleep } from "../helper.js";
import storyFile from '../assets/main.json' assert { type: 'json' };
import inquirer from 'inquirer'


const storyFunction = async (node, character) => {
    
    if(node.type === "choice"){
        let allChoices = []
        for(let choice of node.event){
            allChoices.push(choice)
        }

        const inputChoice = await inquirer.prompt({
            type: "list",
            name: "choice",
            message: `"${node.text}"`.blue,
            choices: allChoices
        }).then((answers) => {
            console.clear()             
            for(let choice of node.event){
                if(choice.name == answers.choice){
                    console.log(choice.text.bgBlue)
                    console.log("");
                    storyFunction(storyFile[choice.nodeId], character)
                }
            }
        })
    }
    if(node.type === "text"){
        await sleep(500)
        console.log(node.text.bgBlue)
        console.log(node.event[0].text.bgGrey);
        console.log("");
        const inputContinue = await inquirer.prompt({
            type: "input",
            message: `Pressez la touche 'Entrer' pour continuer`,
            name: "continue",
        }).then((answers) => {
            console.clear()
            storyFunction(storyFile[node.event[0].nodeId], character)
        })
    }
}

export const story = (node, character) =>{
    storyFunction(node, character)
}