// let {render} = require('mustache');
import fs from "fs"
import mustache from "mustache" 
import util from "util" 
import storyFile from '../assets/main.json' assert { type: 'json' };
import character from '../assets/character.json' assert { type: 'json' };

export const resumeFunction = async (previousEvent) => {

    const template = fs.readFileSync('./assets/template.md').toString()

    let nodePath = []

    if(!character.path.length){
        return null
    }
    
    let _node
    let previousNodeId = character.path[character.path.length -1]
    for(let node of storyFile){
        if(node.id === previousNodeId){
            _node = {...node}
        }
    }
    
    let _nodeEvent
    for(let event of _node.event){
        if(event.id === previousEvent.id){
            _nodeEvent = event
        }
    }
    
    _node.event = []
    _node.event = _nodeEvent
    nodePath.push(_node)

    let data = {
        text : nodePath[0].text,
        nodeId : nodePath[0].id,
        eventText : nodePath[0].event.text
    }

    let output = mustache.render(template, data)
    fs.appendFileSync(`./resume_${character.name}.md`, output, "UTF-8",{'flags': 'a+'});

}

export default resumeFunction

