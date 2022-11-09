import colors from 'colors'
import { characterInit } from './scripts/characterInit.js'
import { story } from './scripts/story.js'
import storyFile from './assets/main.json' assert { type: 'json' };


(async () => {
    // TODO : Faire un message different si le joueur se connecte pour la premiere fois ou non
    console.clear()
    console.log("Début de la partie !".bgGreen)
    
    const characterStats = await characterInit()
    console.clear()
    story(storyFile[0] , characterStats)

})()