import { Text, type Engine, type EntityManager } from "piton-engine";
import { FoxCountText, Tag } from "../components";

export function showFoxCountSystem(engine:Engine){
    const em:EntityManager = engine.getEntityManager();
    let count:number = 0;
    em.query('All',{
        tag:Tag
    },(id,{tag})=>{
        if(!engine.isEntityActive(id)) return;
        if(tag.value === "Fox"){
            count++;
        };
    });
    em.query('All',{
        foxCountText:FoxCountText,
        text:Text
    },(id,{foxCountText,text})=>{
        text.content = `Foxes: ${count}`;
    });
};
