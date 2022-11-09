import { diceRoll, sleep, waitKeyPress} from "../helper.js"
import inquirer from 'inquirer'

async function fight(character, ennemy){
  let needTuto = false;
  let isFightOver = false;
  const actions = [
    {name : 'attaquer', value: 'attack'},
    {name : 'parer', value: 'parade'},
    {name : 'charger une attaque', value: 'charge'}
  ];
  const actionsWithoutAttack = [
    {name : 'parer', value: 'parade'},
    {name : 'charger une attaque', value: 'charge'}
  ];
  // {name : 'se soigner', value: 'heal'}
  let action = '';
  let ennemyAction = '';
  
  await inquirer.prompt([
    {
      name: "need_tuto",
      type: "confirm",
      message: "Voulez vous suivre le tutoriel avant ce combat ?",
    },
  ])
  .then((answer) => {
    needTuto = answer.need_tuto;
  });

  if(needTuto) {
    console.log('Comment marche le système de combat ?'.cyan)
    await sleep(1000)
    console.log(`C'est tout simple : `)
    await sleep(1000)
    console.log(`On vous octroie au début du combat deux stacks d'attaques`)
    await sleep(1000)
    console.log(`Et on vous donne le choix entre trois actions :`)
    await sleep(1000)
    console.log(`Attaquer, parer une attaque et charger une attaque.`)
    await sleep(1000)
    console.log(`attaquer`.green, `vous fera perdre une stack d'attaque, mais vous aurez des chances de toucher votre adversaire.`)
    await sleep(1000)
    console.log(`parer`.green,`permettra de parer une potentielle attaque de votre adversaire`)
    await sleep(1000)
    console.log(`Et`, `charger`.green, `vous permet de gagner une stack d'attaque !`)
    await sleep(1000)
    console.log(`Faites le bon choix !`)
    await sleep(1000)
    console.log(`Votre adversaire aura 33% de chance de faire chacune des 3 actions`)
    await sleep(1000)
    console.log(`Sauf lorsqu'il n'a plus d'attaques disponible (deux au départ également), il sera forcé de charger une attaque.`)
    await sleep(1000)
    console.log(`Voilà, vous savez tout, maintenant place au combat !`)
    sleep(1000)
    await waitKeyPress();
  }
  
  console.log('vous entrez en combat avec', ennemy.name, '!')
  await waitKeyPress();

  while (!isFightOver){
    const inputChoice = await inquirer.prompt({
      type: "list",
      name: "choice",
      message: 'choisissez quelle action vous voulez effectuer :',
      choices: character.fight.attack === 0 ? actionsWithoutAttack : actions
    }).then(async (answer) => {
      action = answer.choice
      ennemyAction = ennemy.fight.attack === 0 ? actions[2].value : actions[diceRoll(0,2)].value
  
      switch (action) {
        case 'attack':
          character.fight.attack -= 1
          await attackPrompt(character);
          break;
        case 'parade':
          await paradePrompt(character);
          break;
        case 'charge':
          character.fight.attack += 1 
          await chargePrompt(character);
          break;
      }
    })
    await checkActions(character, ennemy, action, ennemyAction)
    isFightOver = await checkIfOver(character, ennemy)
    await waitKeyPress();
  }
  console.log('combat terminé'.red)
  console.log(character)
  // write file character.json
  return character
  
}

async function checkIfOver(character, ennemy){
  if(character.hp <= 0 || ennemy.hp <= 0){
    return true;
  }
  return false;
}

async function attackPrompt(character){
  console.log("vous avez choisi d'attaquer");
  await sleep(1000)
  console.log(`il vous reste désormais ${character.fight.attack} attaque(s)`);
  await sleep(1000)

}
async function paradePrompt(character){
  console.log('vous avez choisi de parer une potentielle attaque');
  await sleep(1000)
}
async function chargePrompt(character){
  console.log('vous avez choisi de charger une attaque');
  await sleep(1000)
  console.log(`vous possedez desormais ${character.fight.attack} attaque(s)`);
  await sleep(1000)
}

async function checkActions(character, ennemy, action, ennemyAction) {
  console.log('action :'.green, action.green)
  console.log('ennemyAction :'.red, ennemyAction.red)
  if(action === 'attack' && ennemyAction === 'attack'){

    updateHp(ennemy, character.attack)
    updateHp(character, ennemy.attack)

    console.log(`vous vous attaquez mutuellement, et vous blessez l'un et l'autre.`);
    await sleep(1000);
    console.log(`il vous reste ${character.hp < 0 ? 0 : character.hp } points de vie`);
    await sleep(1000);
    console.log(`l'ennemi possède maintenant ${ennemy.hp < 0 ? 0 : ennemy.hp } points de vie`);
    await sleep(1000);
  }
  if(action === 'attack' && ennemyAction === 'parade'){
    let res = diceRoll(1,20);
    if(res > ennemy.parade){

      updateHp(ennemy, character.attack)

      console.log(`l'ennemi rate sa parade, vous lui infligez ${character.attack} points de dégats !`);
      await sleep(1000);
      console.log(`il lui reste ${ennemy.hp < 0 ? 0 : ennemy.hp} points de vie`);
      await sleep(1000);
    } else{
      console.log(`l'ennemi a paré votre attaque !`) ;
      await sleep(1000);
    }
  }
  if(action === 'parade' && ennemyAction === 'attack'){
    let res = diceRoll(1,20);
    if(res > ennemy.parade){

      updateHp(character, ennemy.attack)

      console.log(`vous ratez votre parade, l'ennemi vous inflige ${ennemy.attack} points de dégats !`);
      await sleep(1000);
      console.log(`il vous reste ${character.hp < 0 ? 0 : character.hp} points de vie`);
      await sleep(1000);
    } else {
      console.log(`vous avez paré son attaque !`) ;
      await sleep(1000);
    }
  }
  if(action === 'parade' && ennemyAction === 'parade'){
    console.log(`vous avez tous les deux essayé de parer, rien ne se passe.`);
    await sleep(1000);
  }
  if(action === 'charge' && ennemyAction === 'charge'){
    console.log(`vous avez tous les deux chargé une attaque, rien ne se passe.`);
    await sleep(1000);
  }
  if(action === 'charge' && ennemyAction === 'attack'){
    updateHp(character, ennemy.attack)
    console.log(`l'ennemi vous inflige ${ennemy.attack} points de dégats !`);
    await sleep(1000);
    console.log(`il vous reste ${character.hp < 0 ? 0 : character.hp} points de vie`);
    await sleep(1000);
  }
  if(action === 'attack' && ennemyAction === 'charge'){
    updateHp(ennemy, character.attack)
    console.log(`vous lui infligez ${character.attack} points de dégats !`);
    await sleep(1000);
    console.log(`il lui reste ${ennemy.hp < 0 ? 0 : ennemy.hp} points de vie`);
    await sleep(1000);
  }
  if(action === 'parade' && ennemyAction === 'charge'){
    console.log(`l'ennemi a chargé une attaque, votre parade à été inefficace.`)
  }
  if(action === 'charge' && ennemyAction === 'parade'){
    console.log(`vous avez chargé une attaque, la parade de l'ennemi à été inefficace.`)
  }
}

function updateHp(target, amount){
  target.hp -= amount
}

export { fight };
