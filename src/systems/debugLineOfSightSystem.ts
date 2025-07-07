import { Shape, type Engine, type EntityId, type EntityManager, type ShapeType } from "piton-engine";
import { EntityTemplates, Transform } from "piton-engine";
import { DebugLineOfSight, LineOfSight } from "../components";
export function debugLineOfSightSystem(engine: Engine): void {
    const em: EntityManager = engine.getEntityManager();
    const entityTemplates: EntityTemplates = new EntityTemplates(engine);
    em.query('All', {
        lineOfSight: LineOfSight,
        debugLineOfSight: DebugLineOfSight,
        transform: Transform
    }, (id, { lineOfSight, debugLineOfSight, transform }) => {
        if (!engine.isEntityActive(id)) return
        if (debugLineOfSight.shapeId === null) {
            const shapeId: EntityId = entityTemplates.createCircleEntity(lineOfSight.value);
            const shape: Shape<ShapeType> = em.getComponent(shapeId, Shape,true);
            shape.layer = -1
            shape.color = debugLineOfSight.shapeColor;
            shape.alpha = 0.1
            debugLineOfSight.shapeId = shapeId;
        };
        const shapeTransform: Transform = em.getComponent(debugLineOfSight.shapeId, Transform,true);
        
        shapeTransform.globalPosition.position = transform.globalPosition.position;

    });
};