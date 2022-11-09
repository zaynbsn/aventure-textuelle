import { writeFileSync } from 'node:fs';

/**
 * 
 * @param {Object} character 
 */
export const save = async (character) =>{
    await writeFileSync('./assets/character.json', JSON.stringify(character), (err)=>{
        if (err) console.log(err)       
    });
}

export default save