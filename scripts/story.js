import { diceRoll, sleep } from "../helper.js";
import storyFile from '../assets/main.json' assert { type: 'json' };
import enemies from '../assets/enemies.json' assert { type: 'json' };
import inquirer from 'inquirer'
import { save } from "./save.js";
import { resetFunction } from "../reset.js";
import { fight } from "./fight.js";

/**
 * 
 * @param {Object} node 
 * @param {Object} character 
 */
const storyFunction = async (node, character) => {
    character.path.push(node.id)
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
                    console.log(choice.text.bgBlue + "\n")
                    storyFunction(storyFile[choice.nodeId], character)
                }
            }
        })
    }
    if(node.type === "text"){
        await sleep(500)
        console.log(node.text.bgBlue)
        console.log(node.event[0].text.bgGrey + "\n");
        await inquirer.prompt({
            type: "input",
            message: `Appuyez sur la touche 'Entrer' pour continuer ->`,
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
            message: `Appuyez sur la touche 'Entrer' pour entrer en combat ->`,
            name: "continue",
        }).then(async (answers) => {
            console.clear()
            const enemy = enemies.filter( enemy => enemy.id === node.enemyId )
            constfightResult = await fight(character, enemy[0])
        })                
    }
    if(node.type === "test"){
        await sleep(500)
        console.log(node.text.bgBlue)
        // console.log(`Votre compétence "${node.test.name}" à un maximum de ${character.stats.courage}, vous lancez donc un dé de ${character.stats.courage}, vous devez faire plus de ${node.test.value}`);
        console.log(`Vous avez ${character.stats[node.test.name]} de ${node.test.name}, vous lancez donc un dé de 20, vous devez faire ${character.stats.courage} ou moins`);
        await inquirer.prompt({
            type: "input",
            message: `Appuyez sur la touche 'Entrer' pour lancer le dé`,
            name: "result",
        }).then(async (answers) => {
            let testResult = await diceRoll(1,20)
            if( testResult <= character.stats[node.test.name]){
                console.log(`vous faites un score de ${testResult} !`)
                console.log(`Succès ! `.green)
                await sleep(1000)
                console.log(node.event[0].text.bgBlue + "\n")                
                if(node.event[0].consequence){
                    for(let consequence of node.event[0].consequence){
                        testConsequence(consequence, character)
                    }
                }
                if(!character.dead)
                    storyFunction(storyFile[node.event[0].nodeId], character)
            }else{
                console.log(`vous faites un score de ${testResult}...`)
                console.log(`Echec :(`.red)
                await sleep(1000)
                console.log(node.event[1].text.bgBlue + "\n")
                if(node.event[1].consequence){
                    for(let consequence of node.event[1].consequence){
                        testConsequence(consequence, character)
                    }
                }
                if(!character.dead)
                    storyFunction(storyFile[node.event[1].nodeId], character)
            }
        })  
    }
}

/**
 * 
 * @param {Object} consequence 
 * @param {Object} character 
 */
async function testConsequence(consequence, character){
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
        case "attack":
            character.attack = consequence.isBonus ? character.attack+consequence.value : character.attack-consequence.value
            break;
        case "parade":
            character.parade = consequence.isBonus ? character.parade+consequence.value : character.parade-consequence.value
            break;
        case 'death':
            character.dead = true
            console.log("L'aventure prend fin ... vous êtes mort ☠".bgRed);
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