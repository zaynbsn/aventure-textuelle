import inquirer from 'inquirer';
import colors from 'colors'
import { writeFileSync } from 'node:fs';

const character = {"name":"","class":"","hp":40,"attack":8,"parade":10,"dead":false,"path":[],"stats":{"courage":"12","perception":"","charism":"","strength":"","dexterity":""}}

export const resetFunction = async () => {
    let response = await inquirer.prompt({
        type: "confirm",
        message: `Voulez vous vraiment reinitialiser la partie (la sauvegarde sera supprimée) ?`,
        name: "reset",
    })


    if(response.reset){
        await writeFileSync('./assets/character.json', JSON.stringify(character), (err)=>{
            if (err) console.log(err)       
        })
        console.log('Partie reinitialisée avec succès !'.bgGreen)
    }else{
        console.clear()
    }
}

resetFunction()

export default resetFunction