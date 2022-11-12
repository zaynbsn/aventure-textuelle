import { diceRoll, sleep, waitKeyPress} from "../helper.js"
import character from '../assets/character.json' assert { type: 'json' };
import inquirer from 'inquirer'

async function characterInit() {
  
  console.log('Il est temps de définir vos caractéristiques de départ.')

  await statsInit()
  await nameInit()
}

async function statInit(){
  return await diceRoll(1,6) + 7
}

async function statsInit(){
  for (const stat in character.stats){
    character.stats[stat] = await statInit()
    console.log("en ajoutant 7, cela vous donne " + character.stats[stat] + " en " + stat)
    await waitKeyPress()
  }
}
async function nameInit(){
  const inputHero = await inquirer.prompt({
    type: "input",
    message: 'Please enter your name: ',
    name: "name",
  })
  character.name = inputHero.name
}

export { characterInit }

