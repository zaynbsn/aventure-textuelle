import inquirer from 'inquirer';
import colors from 'colors'
import { writeFileSync } from 'node:fs';

const character = {"name":"","class":"","hp":40,"attack":8,"parade":10,"path":[0,0,1,3,3,3],"stats":{"courage":"","perception":"","charism":"","strength":"","dexterity":""}}

let reset = await inquirer.prompt({
    type: "confirm",
    message: `Voulez vous vraiment reinitialiser la partie (la sauvegarde sera supprimée) ?`,
    name: "reset",
})

if(reset){
    await writeFileSync('./assets/character.json', JSON.stringify(character), (err)=>{
        if (err) console.log(err)       
    }).then(()=>{
        console.log('Partie reinitialisée avec succès'.bgGreen)
    })
}
s