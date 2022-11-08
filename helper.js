function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function diceRoll(min, max) {
  const result = Math.floor(Math.random() * (max - min + 1)) + min;
  // console.log("vous lancez un dé " + max + " !")
  // await sleep(1000)
  // console.log("vous obtenez un résultat de " + result)
  // await sleep(1000)
  return result
}
function attackTest(attack){
  const result = diceRoll(1, 20)
  return (result <= attack)
}
function defenseTest(parade){
  const result = diceRoll(1, 20)
  return (result <= parade)
}
async function swapParameters(att, def){
  console.log('its', def.name, 'turn to attack')
  await sleep(1000)
  let swap = att
  att = def
  def = swap
}
async function fight(attacker, defender){
  let isFightOver = false
  let deadPlayer = {}
  while (!isFightOver){
    if(attackTest(attacker.attack)){
      console.log(attacker.name, 'has succeeded his attack'.green)
      await sleep(1000)
      if(defenseTest(defender.parade)){
        console.log(defender.name, 'has succeeded his parade'.green)
        await sleep(1000)
        
        // swapParameters
        console.log('its', defender.name, 'turn to attack')
        await sleep(1000)
        let swap = attacker
        attacker = defender
        defender = swap
      }else{
        console.log(defender.name, 'failed his parade'.red)
        await sleep(1000)
        defender.hp -= attacker.attack
        defender.hp < 0 ? defender.hp = 0 : ''
        console.log(defender.name, 'have', defender.hp, 'hp left')
        await sleep(1000)
        if(defender.hp <= 0){
          isFightOver = true
          deadPlayer = defender
        }else{
          // swapParameters
          console.log('its', defender.name, 'turn to attack')
          await sleep(1000)
          let swap = attacker
          attacker = defender
          defender = swap
        }
      }
    }else{
      console.log(attacker.name, 'failed his attack'.red)
      await sleep(1000)
      
      // swapParameters
      console.log('its', defender.name, 'turn to attack')
      await sleep(1000)
      let swap = attacker
      attacker = defender
      defender = swap
    }
  }
  return defender
}

export { diceRoll, sleep, fight }