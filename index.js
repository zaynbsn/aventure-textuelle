import colors from 'colors'
import { characterInit } from './scripts/characterInit.js'
import { story } from './scripts/story.js'
import storyFile from './assets/main.json' assert { type: 'json' };
import characterFile from './assets/character.json' assert { type: 'json' };
import inquirer from 'inquirer'

(async () => {
    
    if(characterFile.path.length === 0){
        console.clear()
        console.log("Bienvenue à toi dans Moonheart adventure\n".bgGreen)
        await inquirer.prompt({
            type: "input",
            message: `Appuyez sur la touche 'Entrer' pour continuer ->`,
            name: "continue",
        }).then(async (answers) => {
            console.clear()
            await characterInit()
            console.clear()
            story(storyFile[0], characterFile)
        })
    }else{
        console.clear()
        console.log("Bon retour dans Moonheart adventure !".bgGreen)
        await inquirer.prompt({
            type: "input",
            message: `Appuyez la touche 'Entrer' pour continuer ->`,
            name: "continue",
        }).then((answers) => {
            console.clear()
            story(storyFile[characterFile.path[characterFile.path.length -1]], characterFile)
        })
    }

})()