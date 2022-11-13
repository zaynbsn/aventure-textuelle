// let {render} = require('mustache');
import fs from "fs"
import mustache from "mustache" 
import util from "util" 
import storyFile from '../assets/main.json' assert { type: 'json' };
import character from '../assets/character.json' assert { type: 'json' };

export const resumeFunction = async () => {

    const template = fs.readFileSync('./assets/template.md').toString()

    let nodePath = []

    if(!character.path.length){
        return null
    }

    fs.writeFileSync(`./resume_${character.name}.md`, '# Moonlight adventure (résumé de la partie) ⚔', "UTF-8",{'flags': 'w+'});

    //init the path
    for(let i = 0; i<character.path.length; i++){
        for(let node of storyFile){
            if(node.id === character.path[i]){
                nodePath.push(node)
            }
        }
    }

    //write the resume
    for(let node of nodePath){
        let eventText = ""
        if(nodePath[nodePath.indexOf(node)+1]){
            let nextNodeId = nodePath[nodePath.indexOf(node)+1].id
            for(let event of node.event){
                if(event.nodeId === nextNodeId){
                    eventText = event.text
                }
            }
        }
        let data = {
            text : node.text,
            nodeId : node.id,
            eventText : eventText
        }

        let output = mustache.render(template, data)
        fs.appendFileSync(`./resume_${character.name}.md`, output, "UTF-8",{'flags': 'a+'});

    }


    // console.log(util.inspect(nodePath,false,null,true))
}

export default resumeFunction

