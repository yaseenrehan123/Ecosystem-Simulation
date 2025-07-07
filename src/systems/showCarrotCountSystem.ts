import { Text, type Engine, type EntityManager } from "piton-engine";
import { CarrotCountText, Tag } from "../components";

export function showCarrotCountSystem(engine:Engine){
    const em:EntityManager = engine.getEntityManager();
    let count:number = 0;
    em.query('All',{
        tag:Tag
    },(id,{tag})=>{
        if(!engine.isEntityActive(id)) return;
        if(tag.value === "Carrot"){
            count++;
        };
    });
    em.query('All',{
        carrotCountText:CarrotCountText,
        text:Text
    },(id,{carrotCountText,text})=>{
        text.content = `Carrots: ${count}`;
    });
};
