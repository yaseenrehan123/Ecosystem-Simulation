import type { Engine, EntityId, EntityManager } from "piton-engine";
import { Alignment, EntityTemplates, Text } from "piton-engine";
import { CarrotCountText, FoxCountText, RabbitCountText } from "../components";
export function initSimulationUi(engine:Engine){
    const em:EntityManager = engine.getEntityManager();
    const entityTemplates:EntityTemplates = new EntityTemplates(engine);
    const simulationSceneId:EntityId | null = engine.getSceneByName('simulation',true);

    const initCarrotText =()=>{
        const id:EntityId = entityTemplates.createTextEntity('Carrots: ',simulationSceneId);
        em.addComponent(id,Alignment,new Alignment({
            alignmentHorizontal:'left',
            alignmentVertical:'top',
            offset:{x:0,y:10}
        }));
        em.addComponent(id,CarrotCountText,new CarrotCountText());
        const text = em.getComponent(id,Text,true);
        text.size = 20;
        text.layer = 1;
    };
    
    const initRabbitText =()=>{
        const id:EntityId = entityTemplates.createTextEntity('Rabbits: ',simulationSceneId);
        em.addComponent(id,Alignment,new Alignment({
            alignmentHorizontal:'left',
            alignmentVertical:'top',
            offset:{x:0,y:50}
        }));
        em.addComponent(id,RabbitCountText,new RabbitCountText());
        const text = em.getComponent(id,Text,true);
        text.size = 20;
        text.layer = 1;
    };

    const initFoxText =()=>{
        const id:EntityId = entityTemplates.createTextEntity('Foxes: ',simulationSceneId);
        em.addComponent(id,Alignment,new Alignment({
            alignmentHorizontal:'left',
            alignmentVertical:'top',
            offset:{x:0,y:90}
        }));
        em.addComponent(id,FoxCountText,new FoxCountText());
        const text = em.getComponent(id,Text,true);
        text.size = 20;
        text.layer = 1;
    }

    initCarrotText();
    initRabbitText();
    initFoxText();
}