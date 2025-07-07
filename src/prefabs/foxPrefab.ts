import { Transform, type Engine, type EntityId, type EntityManager } from "piton-engine";
import { EntityTemplates } from "piton-engine";
import type { PrefabOptions } from "../types";
import { DebugLineOfSight, Energy, LineOfSight, Moveable, Tag } from "../components";
export class FoxPrefab {
    private options: PrefabOptions;
    constructor(options: PrefabOptions) {
        this.options = options;
    }

    init(): EntityId {
        const engine: Engine = this.options.engine;
        const em: EntityManager = engine.getEntityManager();
        const entityTemplates = new EntityTemplates(engine);

        const img: HTMLImageElement = engine.getImage("fox");
        const id: EntityId = entityTemplates.createSpriteEntity(img, 16, 16, this.options.parentId);
        em.addComponent(id, Moveable, new Moveable());
        em.addComponent(id, LineOfSight, new LineOfSight({ value: 100 }));
        em.addComponent(id, DebugLineOfSight, new DebugLineOfSight({ shapeColor: 'rgb(177, 16, 16)' }));
        em.addComponent(id, Tag, new Tag({ value: 'Fox' }));
        em.addComponent(id, Energy, new Energy({ maxValue: 1 }));
        const transform = em.getComponent(id, Transform,true);
        const moveable = em.getComponent(id, Moveable,true);
        transform.globalPosition.position = this.options.pos ?? { x: 0, y: 0 };
        moveable.targetPos = transform.globalPosition.position;
        return id;
    }
}
