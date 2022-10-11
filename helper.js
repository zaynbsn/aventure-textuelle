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

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function statInit(){
  return getRandomInt(1,6) + 7
}

function statsInit(){
  for (const stat in character.stats){
    character.stats[stat] = statInit()
  }
  console.log(character)
}

export { statsInit }