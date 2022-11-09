import { diceRoll, sleep } from "../helper.js";
import storyFile from '../assets/main.json' assert { type: 'json' };
import inquirer from 'inquirer'
import { save } from "./save.js";

/**
 * 
 * @param {Object} node 
 * @param {Object} character 
 */
const storyFunction = async (node, character) => {
    character.path.push(node.id)
    // save(character)
    save(character)
    
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
        await inquirer.prompt({
            type: "input",
            message: `Pressez la touche 'Entrer' pour continuer ->`,
            name: "continue",
        }).then((answers) => {
            console.clear()
            storyFunction(storyFile[node.event[0].nodeId], character)
        })
    }
    if(node.type === "fight"){
        await sleep(500)
        console.log(node.text.bgRed)
        await inquirer.prompt({
            type: "input",
            message: `Pressez la touche 'Entrer' pour entrer en combat ->`,
            name: "continue",
        }).then((answers) => {
            console.clear()
            //constfightResult = await function(node.ennemyId, character)
        })                
    }
}

export const story = (node, character) =>{
    storyFunction(node, character)
}