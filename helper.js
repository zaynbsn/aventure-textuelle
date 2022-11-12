import inquirer from 'inquirer'

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function diceRoll(min, max, prompt=true) {
  console.clear()
  const result = Math.floor(Math.random() * (max - min + 1)) + min
  if(prompt === true){
    console.log(`vous lancez un dé ${max}!`)
    await sleep(1000)
    console.log(`vous obtenez ${result}`)
    await sleep(1000)
  }
  return result
}

async function waitKeyPress(){
  await inquirer.prompt({
    type: "input",
    message: `Appuyez sur la touche 'Entrer' pour continuer ->`,
    name: "continue",
  }).then((answers) => {
      console.clear()
  })
}


export { diceRoll, sleep, waitKeyPress}
