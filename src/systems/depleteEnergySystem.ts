import { EntityTemplates, Transform, type Engine, type EntityManager } from "piton-engine";
import type { SimulationData } from "../types";
import { DebugLineOfSight, Energy } from "../components";

export function depleteEnergySystem(engine: Engine) {
    const simulationData: SimulationData = engine.getJSON('simulationData');
    const em: EntityManager = engine.getEntityManager();
    const entityTemplates: EntityTemplates = new EntityTemplates(engine);
    const deltaTime: number = engine.getDeltaTime();
    em.query('All', {
        transform:Transform,
        energy: Energy
    }, (id, { transform,energy }) => {
        energy.value -= simulationData.energyDepletionRate * deltaTime;
        if (energy.value <= 0) {
            const particleImg: HTMLImageElement = engine.getImage('darkPixel');
            const { id: particleContainerId, instance: instance } = entityTemplates.createParticleContainerEntity({
                img: particleImg,
                minScaleRange: { x: 8, y: 8 },
                maxScaleRange: { x: 10, y: 10 },
                minLifeTimeRange: 0.4,
                maxLifeTimeRange: 0.55
            });
            
            const particleTransform = em.getComponent(particleContainerId, Transform,true);
            particleTransform.globalPosition.position = transform.globalPosition.position;
            
            instance();
            const debugLineOfSight = em.getComponent(id, DebugLineOfSight);
            if (debugLineOfSight) {
                if (debugLineOfSight.shapeId) {
                    engine.removeEntityWithCleanup(debugLineOfSight.shapeId);
                };
                debugLineOfSight.shapeId = null;
            }
            engine.removeEntityWithCleanup(id);
        }
    });
}