import { diceRoll, sleep, waitKeyPress} from "../helper.js"
import character from '../assets/character.json' assert { type: 'json' };
import inquirer from 'inquirer'

const characterInit = async () => {
  
  console.log('Il est temps de définir vos caractéristiques de départ.'.cyan)
  await waitKeyPress()

  await statsInit()
  await nameInit()
}

const statInit = async () => {
  return await diceRoll(1,6) + 7
}

const statsInit = async () => {
  for (const stat in character.stats){
    character.stats[stat] = await statInit()
    console.log(`en ajoutant 7, cela vous donne ${character.stats[stat]} en ${await getStatTranslation(stat)}`)
    await waitKeyPress()
  }
}
const nameInit = async () => {
  const inputHero = await inquirer.prompt({
    type: "input",
    message: "Entrez votre nom pour débuter l'aventure: ",
    name: "name",
  })
  character.name = inputHero.name
}

const getStatTranslation = async (stat) => {
  switch (stat) {
    case 'courage':
      return 'courage'
    case 'perception':
      return 'perception'
    case 'charism':
      return 'charisme'
    case 'strength':
      return 'force'
    case 'dexterity':
      return 'dexterité'
  }
} 

export { characterInit }

