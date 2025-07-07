import { Transform, type Engine, type EntityId, type EntityManager } from "piton-engine";
import { EntityTemplates } from "piton-engine";
import type { PrefabOptions } from "../types";
import { DebugLineOfSight, Energy, LineOfSight, Moveable, Tag } from "../components";
export class RabbitPrefab {
    private options:PrefabOptions;
    constructor(options: PrefabOptions) {
        this.options = options;
    };
    init(): EntityId {
        const engine:Engine = this.options.engine;
        const em:EntityManager = engine.getEntityManager();
        const entityTemplates:EntityTemplates = new EntityTemplates(engine);

        const img: HTMLImageElement = engine.getImage("rabbit");
        const id: EntityId = entityTemplates.createSpriteEntity(img, 16, 16, this.options.parentId);
        em.addComponent(id, Moveable, new Moveable());
        em.addComponent(id, LineOfSight, new LineOfSight({ value: 100 }));
        em.addComponent(id, DebugLineOfSight, new DebugLineOfSight({ shapeColor: 'rgb(174, 255, 140)' }));
        em.addComponent(id, Tag, new Tag({ value: 'Rabbit' }));
        em.addComponent(id, Energy, new Energy({ maxValue: 1 }));
        const transform: Transform = em.getComponent(id, Transform,true);
        const moveable: Moveable = em.getComponent(id, Moveable,true);
        transform.globalPosition.position = this.options.pos ?? {x:0,y:0};
        moveable.targetPos = transform.globalPosition.position;
        return id;
    };
};