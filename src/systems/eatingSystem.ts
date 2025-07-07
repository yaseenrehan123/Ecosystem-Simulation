import type { Engine, EntityId, EntityManager } from "piton-engine";
import { EntityTemplates, Transform } from "piton-engine";
import { DebugLineOfSight, Energy, Moveable, Tag } from "../components";
import type { SimulationData } from "../types";

export function eatingSystem(engine: Engine) {
    const simulationData:SimulationData = engine.getJSON('simulationData');
    const em: EntityManager = engine.getEntityManager();
    const entityTemplates: EntityTemplates = new EntityTemplates(engine);
    em.query('All', {
        moveable: Moveable,
        tag: Tag
    }, (id, { moveable, tag }) => {
        if (!engine.isEntityActive(id)) return;
        if (!moveable.reachedTarget) return;
        if (moveable.targetId && em.hasEntity(moveable.targetId)) {
            const energy = em.getComponent(id,Energy,true);
            energy.value += simulationData.energyGainUponEating;

            const targetTag = em.getComponent(moveable.targetId, Tag,true);
            const targetTransform = em.getComponent(moveable.targetId, Transform,true);
            let img:HTMLImageElement = engine.getImage('orangePixel');
            if (targetTag.value === "Carrot") {
                console.log("CARROT GOT EATEN");
                img = engine.getImage('orangePixel');
            }
            else if (targetTag.value === "Rabbit") {
                img = engine.getImage('pinkPixel');
                console.log("RABBIT GOT EATEN");
            };
            const { id: particleContainerId, instance: instance } = entityTemplates.createParticleContainerEntity({
                img: img,
                minScaleRange: { x: 8, y: 8 },
                maxScaleRange: { x: 10, y: 10 },
                minLifeTimeRange: 0.4,
                maxLifeTimeRange: 0.55
            });
            const particleTransform = em.getComponent(particleContainerId, Transform,true);
            particleTransform.globalPosition.position = targetTransform.globalPosition.position;
            instance();
            const debugLineOfSight = em.getComponent(moveable.targetId,DebugLineOfSight);
            if(debugLineOfSight){
                if(debugLineOfSight.shapeId){
                    engine.removeEntityWithCleanup(debugLineOfSight.shapeId);
                };
                debugLineOfSight.shapeId = null;
            }
            engine.removeEntityWithCleanup(moveable.targetId);
            moveable.targetId = null;
        }
    });
}