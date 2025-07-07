import { type Engine, type EntityManager, type EntityId, type Vector2, Transform, EntityTemplates } from "piton-engine";
import { Energy, Tag } from "../components";
import type { SimulationData } from "../types";
import { RabbitPrefab } from "../prefabs/rabbitPrefab";
import { FoxPrefab } from "../prefabs/foxPrefab";

export function reproductionSystem(engine: Engine) {
    const simulationData: SimulationData = engine.getJSON('simulationData');
    const em: EntityManager = engine.getEntityManager();
    const entityTemplates:EntityTemplates = new EntityTemplates(engine);
    em.query('All', {
        transform: Transform,
        tag: Tag,
        energy: Energy
    }, (id, { transform, tag, energy }) => {
        //console.log("REPRODUCIVE SYSTEM!")
        if (energy.value >= energy.maxValue * 2) {
            const simulationSceneId: EntityId | null = engine.getSceneByName('simulation',true);
            const randomOffset: Vector2 = {
                x: engine.getRandomFloat(-5, 5),
                y: engine.getRandomFloat(-5, 5)
            };
            // Reproduce
            energy.value -= energy.maxValue;
            //console.log("ENTITY REPRODUCED!")
            const pos: Vector2 = transform.globalPosition.position;

            const particleImg:HTMLImageElement = engine.getImage('heart');
            const {id:particleContainerId,instance:instance} = entityTemplates.createParticleContainerEntity({
                img:particleImg,
                minScaleRange:{x:1,y:1},
                maxScaleRange:{x:1.5,y:1.5},
                minLifeTimeRange:0.55,
                maxLifeTimeRange:0.65,
                maxNumber:4
            });
            const particleTransform = em.getComponent(particleContainerId,Transform,true);
            particleTransform.globalPosition.position = pos;
            instance();

            if (tag.value === "Rabbit") {
                const id: EntityId = new RabbitPrefab({
                    engine: engine,
                    pos: {
                        x: pos.x + randomOffset.x,
                        y: pos.y + randomOffset.y
                    },
                    parentId: simulationSceneId
                }).init();
                //console.log("RABBIT REPRODUCED!");
            } else if (tag.value === "Fox") {
                const id: EntityId = new FoxPrefab({
                    engine: engine,
                    pos: {
                        x: pos.x + randomOffset.x,
                        y: pos.y + randomOffset.y
                    },
                    parentId: simulationSceneId
                }).init();
                //console.log("FOX REPRODUCED!");
            }

            // Optionally: spawn a particle for reproduction event
        }
    });
}
