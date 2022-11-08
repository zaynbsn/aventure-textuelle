function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function diceRoll(min, max) {
  const result = Math.floor(Math.random() * (max - min + 1)) + min;
  console.log("vous lancez un dé " + max + " !")
  sleep(1000)
  console.log("vous obtenez un résultat de " + result)
  sleep(1000)
  return result
}

export { diceRoll, sleep }