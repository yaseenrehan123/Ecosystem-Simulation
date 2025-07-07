import { Text, type Engine, type EntityManager } from "piton-engine";
import { RabbitCountText, Tag } from "../components";

export function showRabbitCountSystem(engine:Engine){
    const em:EntityManager = engine.getEntityManager();
    let count:number = 0;
    em.query('All',{
        tag:Tag
    },(id,{tag})=>{
        if(!engine.isEntityActive(id)) return;
        if(tag.value === "Rabbit"){
            count++;
        };
    });
    em.query('All',{
        rabbitCountText:RabbitCountText,
        text:Text
    },(id,{rabbitCountText,text})=>{
        text.content = `Rabbits: ${count}`;
    });
};
