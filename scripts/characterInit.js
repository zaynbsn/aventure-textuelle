import { diceRoll, sleep } from "../helper.js"

function characterInit() {
  
  const character = {
    nom: "",
    classe: "",
    pv: 40,
    attaque: 8,
    parade: 10,
    stats: {
      courage : "",
      perception : "",
      charisme : "",
      force : "",
      adresse : ""
    }
  }
  
  console.log('il est temps de définir vos caractéristiques de départ.')
  
  function statInit(){
    return diceRoll(1,6) + 7
  }
  
  async function statsInit(){
    for (const stat in character.stats){
      character.stats[stat] = statInit()
      console.log("en ajoutant 7, cela vous donne " + character.stats[stat] + " en " + stat)
      await sleep(1000)
    }
    console.log(character)
  }
  statsInit()
}

export { characterInit }

