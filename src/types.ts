import type { Engine, EntityId, Vector2 } from "piton-engine";

//JSON TYPES
export type SimulationData = {
    foodSpawnDelay:number,
    foodSpawnCounter:number,
    minFoodSpawns:number,
    maxFoodSpawns:number,
    energyDepletionRate:number,
    energyGainUponEating:number
};
//GENERAL TYPES
export type EntityTag = 'None' | 'Rabbit' | 'Fox' | 'Carrot';
//COMPONENT TYPES
export type MoveableOptions = {
    minSpeed?:number,
    maxSpeed?:number,
};
export type LineOfSightOptions = {
    value?:number;
};
export type DebugLineOfSightOptions = {
    enabled?:boolean,
    shapeId?:EntityId | null,
    shapeColor?:string
};
export type TagOptions = {
    value?:EntityTag
};
export type EnergyOptions = {
    maxValue?:number
};
//CLASS TYPES
export type PrefabOptions = {
    engine:Engine,
    parentId?:EntityId
    pos?:Vector2
}