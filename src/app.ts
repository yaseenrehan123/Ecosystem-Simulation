import { Engine, EntityTemplates, Sprite, Transform } from "piton-engine";
import type { EntityId, EntityManager, Vector2 } from "piton-engine";
import type { SimulationData } from "./types";
import { DebugLineOfSight, Energy, LineOfSight, Moveable, Tag } from "./components";
import { debugLineOfSightSystem } from "./systems/debugLineOfSightSystem";
import { moveableSystem } from "./systems/moveableSystem";
import { assignTargetSystem } from "./systems/assignTargetSystem";
import { debugTargetPosition } from "./systems/debugTargetPositionSystem";
import { initSimulationUi } from "./ui/simulationUi";
import { showCarrotCountSystem } from "./systems/showCarrotCountSystem";
import { showRabbitCountSystem } from "./systems/showRabbitCountSystem";
import { showFoxCountSystem } from "./systems/showFoxCountSystem";
import { eatingSystem } from "./systems/eatingSystem";
import { handleMoveSpeedSystem } from "./systems/handleMoveSpeedSystem";
import { depleteEnergySystem } from "./systems/depleteEnergySystem";
import { reproductionSystem } from "./systems/reproductionSystem";
import { RabbitPrefab } from "./prefabs/rabbitPrefab";
import { FoxPrefab } from "./prefabs/foxPrefab";
const engine: Engine = new Engine({
    resources: {
        images_JSON_path: "data/imagesData.json",
        jsons: {
            simulationData: "data/simulationData.json"
        }
    }
});
const em: EntityManager = engine.getEntityManager();
const entityTemplates: EntityTemplates = new EntityTemplates(engine);
let simulationData: SimulationData;
engine.addStartFunction(start.bind(this));
engine.addUpdateFunction(update.bind(this));
function start() {
    simulationData = engine.getJSON('simulationData');
    const simulationSceneId:EntityId = entityTemplates.createSceneEntity('simulation');
    engine.loadScene(simulationSceneId);

    initSimulationUi(engine);

    spawnRabits({
        max: 16,
        parentId:simulationSceneId
    });
    spawnFoxes({
        max:4,
        parentId:simulationSceneId
    })
};
function update() {
    const deltaTime: number = engine.getDeltaTime();
    spawnCarrots(deltaTime);
    depleteEnergySystem(engine);
    debugLineOfSightSystem(engine);
    reproductionSystem(engine);
    assignTargetSystem(engine);
    debugTargetPosition(engine);
    handleMoveSpeedSystem(engine);
    moveableSystem(engine);
    eatingSystem(engine);
    showCarrotCountSystem(engine);
    showRabbitCountSystem(engine);
    showFoxCountSystem(engine);
};
function spawnRabits(options: { max: number,parentId?:EntityId }) {
    const canvasBounds: Vector2 = engine.getCanvasBounds();
    for (let i = 0; i < options.max; i++) {
        const spawnPos: Vector2 = {
            x: engine.getRandomFloat(0, canvasBounds.x),
            y: engine.getRandomFloat(0, canvasBounds.y)
        };
        const id:EntityId = new RabbitPrefab({
            engine:engine,
            pos:{
                x:spawnPos.x,
                y:spawnPos.y
            },
            parentId:options.parentId
        }).init();
    };
};
function spawnCarrots(deltaTime: number) {
    const delay: number = simulationData.foodSpawnDelay;
    const min: number = simulationData.minFoodSpawns;
    const max: number = simulationData.maxFoodSpawns;
    let counter: number = simulationData.foodSpawnCounter;
    counter -= deltaTime;
    if (counter <= 0) {
        const canvasBounds: Vector2 = engine.getCanvasBounds();
        const spawnAmount: number = engine.getRandomInt(min, max);
        const img: HTMLImageElement = engine.getImage('carrot');
        for (let i = 0; i < spawnAmount; i++) {
            const spawnPos: Vector2 = {
                x: engine.getRandomFloat(0, canvasBounds.x),
                y: engine.getRandomFloat(0, canvasBounds.y)
            };
            const id: EntityId = entityTemplates.createSpriteEntity(img, 16, 16);
            em.addComponent(id,Tag,new Tag({value:'Carrot'}));
            const transform = em.getComponent(id, Transform,true);
            transform.globalPosition.position = spawnPos;
        };
        counter = delay;
    };
    simulationData.foodSpawnCounter = counter;
};
function spawnFoxes(options: { max: number,parentId?:EntityId }) {
    const canvasBounds: Vector2 = engine.getCanvasBounds();
    for (let i = 0; i < options.max; i++) {
        const spawnPos: Vector2 = {
            x: engine.getRandomFloat(0, canvasBounds.x),
            y: engine.getRandomFloat(0, canvasBounds.y)
        };
        const id:EntityId = new FoxPrefab({
            engine:engine,
            pos:{
                x:spawnPos.x,
                y:spawnPos.y
            },
            parentId:options.parentId
        }).init();
    };
};