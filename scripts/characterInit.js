import { diceRoll, sleep, waitKeyPress} from "../helper.js"
import { fight } from "./fight.js"
import inquirer from 'inquirer'

async function characterInit() {
  
  const character = {
    name: "",
    class: "",
    hp: 40,
    attack: 8,
    parade: 10,
    fight: {attack: 2},
    stats: {
      courage : "",
      perception : "",
      charism : "",
      strength : "",
      dexterity : ""
    }
  }
  const ennemy = {
    name: "un rat mutant",
    hp: 20,
    attack: 8,
    parade: 10,
    fight: {attack: 2}
  }
  
  console.log('Il est temps de définir vos caractéristiques de départ.')
  
  function statInit(){
    return diceRoll(1,6) + 7
  }
  
  async function statsInit(){
    for (const stat in character.stats){
      character.stats[stat] = statInit()
      console.log("en ajoutant 7, cela vous donne " + character.stats[stat] + " en " + stat)
      // await sleep(1000)
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
  
  await statsInit()
  await nameInit()
  fight(character, ennemy)
}

export { characterInit }

