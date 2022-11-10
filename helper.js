import inquirer from 'inquirer'

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
