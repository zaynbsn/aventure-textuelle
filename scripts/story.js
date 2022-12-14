import { diceRoll, sleep } from "../helper.js";
import storyFile from '../assets/main.json' assert { type: 'json' };
import enemies from '../assets/enemies.json' assert { type: 'json' };
import inquirer from 'inquirer'
import { save } from "./save.js";
import { resetFunction } from "../reset.js";
import { fight } from "./fight.js";
import { resumeFunction } from "./resume.js";
import util from "util" 
/**
 * 
 * @param {Object} node 
 * @param {Object} character 
 */
const storyFunction = async (node, character, previousEvent = null) => {
    if(previousEvent){
        await resumeFunction(previousEvent)
    }
    if(node.id !== character.path[character.path.length -1]){
        character.path.push(node.id)
    }
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
        }).then(async (answers) => {
            console.clear()
            await checkIfConsequence(node, character)       
            for(let choice of node.event){
                if(choice.name == answers.choice){
                    console.log(choice.text.blue + "\n")
                    storyFunction(getNextNode(storyFile, choice.nodeId), character, choice)
                }
            }
        })
    }

    if(node.type === "text"){
        await sleep(500)
        console.log(node.text.blue)
        console.log(node.event[0].text.bgGrey + "\n");
        await inquirer.prompt({
            type: "input",
            message: `Appuyez sur la touche 'Entrer' pour continuer ->`,
            name: "continue",
        }).then(async (answers) => {
            console.clear()
            await checkIfConsequence(node, character)
            storyFunction(getNextNode(storyFile, node.event[0].nodeId), character, node.event[0])
        })
    }

    if(node.type === "fight"){
        await sleep(500)
        console.log(node.text.bgRed)
        await inquirer.prompt({
            type: "input",
            message: `Appuyez sur la touche 'Entrer' pour entrer en combat ->`,
            name: "continue",
        }).then(async (answers) => {
            console.clear()
            const enemy = enemies.filter( enemy => enemy.id === node.enemyId )
            const isFightWon = await fight(character, enemy[0])
            if (isFightWon){
                await checkIfConsequence(node, character)
                storyFunction(getNextNode(storyFile, node.event[1].nodeId), character, node.event[0])
            }else{
                await checkIfConsequence(node, character, 1)
            }
        })                
    }

    if(node.type === "test"){
        await sleep(500)
        console.log(node.text.blue)
        console.log(`Vous avez ${character.stats[node.test.name]} de ${node.test.name}, vous lancez donc un d?? de 20, vous devez faire ${character.stats[node.test.name]} ou moins`);
        await inquirer.prompt({
            type: "input",
            message: `Appuyez sur la touche 'Entrer' pour lancer le d??`,
            name: "result",
        }).then(async (answers) => {
            let testResult = await diceRoll(1,20, false)
            if( testResult <= character.stats[node.test.name]){
                console.log(`vous faites un score de ${testResult} !`)
                console.log(`Succ??s ! `.green)
                await sleep(1000)
                console.log(node.event[0].text.blue + "\n")       

                await checkIfConsequence(node, character)

                if(!character.dead)
                    storyFunction(getNextNode(storyFile, node.event[0].nodeId), character,node.event[0])
            }else{
                console.log(`vous faites un score de ${testResult}...`)
                console.log(`Echec :(`.red)
                await sleep(1000)
                console.log(node.event[1].text.blue + "\n")

                await checkIfConsequence(node, character, 1)

                if(!character.dead)
                    storyFunction(getNextNode(storyFile, node.event[1].nodeId), character, node.event[0])
            }
        })  
    }
    if(node.type === "reset"){
        let res = await inquirer.prompt({
            type: "confirm",
            message: `Recommencer ?`,
            name: "restart",
        })
        if(res.restart){
            resetFunction()
        }
    }
}

const getNextNode = (storyFile, nodeId) => {
    return storyFile.find(node => node.id === nodeId)
}

/**
 * 
 * @param {Object} consequence 
 * @param {Object} character 
 */
const checkIfConsequence = async (node, character, index=0) => {
    if(node.event[index].consequence){
        for(let consequence of node.event[index].consequence){
            testConsequence(consequence, character)
        }
    }
}

/**
 * 
 * @param {Object} consequence 
 * @param {Object} character 
 */
const testConsequence = async (consequence, character) => {
    switch(consequence.libelle){
        case "courage":
            character.stats.courage = consequence.isBonus ? character.stats.courage+consequence.value : character.stats.courage-consequence.value
            break;
        case "perception":
            character.stats.perception = consequence.isBonus ? character.stats.perception+consequence.value : character.stats.perception-consequence.value
            break;
        case "charism":
            character.stats.charism = consequence.isBonus ? character.stats.charism+consequence.value : character.stats.charism-consequence.value
            break;
        case "strength":
            character.stats.strength = consequence.isBonus ? character.stats.strength+consequence.value : character.stats.strength-consequence.value
            break;
        case "dexterity":
            character.stats.dexterity = consequence.isBonus ? character.stats.dexterity+consequence.value : character.stats.dexterity-consequence.value
            break;
        case "hp":
            character.hp = consequence.isBonus ? character.hp+consequence.value : character.hp-consequence.value
            break;
        case "class":
            character.class = consequence.value
            break;
        case "attack":
            character.attack = consequence.isBonus ? character.attack+consequence.value : character.attack-consequence.value
            break;
        case "parade":
            character.parade = consequence.isBonus ? character.parade+consequence.value : character.parade-consequence.value
            break;
        case "stack":
            character.fight.attackStack = consequence.isBonus ? character.fight.attackStack+consequence.value : character.fight.attackStack-consequence.value
            break;
        case "death":
            character.dead = true
            console.log("L'aventure prend fin ... vous ??tes mort ???".bgRed);
            let response = await inquirer.prompt({
                type: "confirm",
                message: `Recommencer ?`,
                name: "restart",
            })
            if(response.restart){
                resetFunction()
            }
            break;
    }
    save(character)
}

export const story = (node, character) =>{
    storyFunction(node, character)
}