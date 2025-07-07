import type { EntityId, Vector2 } from "piton-engine";
import type { DebugLineOfSightOptions, EnergyOptions, EntityTag, LineOfSightOptions, MoveableOptions, TagOptions } from "./types";

export class Moveable{
    public targetPos:Vector2 = {x:0,y:0}; //SET THROUGH CODE
    public reachedTarget:boolean = false; //SET THROUGH CODE
    public targetId:EntityId | null = null; //SET THROUGH CODE
    public minSpeed:number;
    public maxSpeed:number;
    public speed:number;
    constructor(options:MoveableOptions = {}){
        this.minSpeed = options.minSpeed ?? 50;
        this.maxSpeed = options.maxSpeed ?? 100;
        this.speed = this.maxSpeed;
    };
};
export class LineOfSight{
    public value:number;
    constructor(options:LineOfSightOptions = {}){
        this.value = options.value ?? 15;
    }
};
export class DebugLineOfSight{
    public enabled:boolean;
    public shapeId:EntityId | null;
    public shapeColor:string;
    constructor(options:DebugLineOfSightOptions = {}){
        this.enabled = options.enabled ?? true;
        this.shapeId = options.shapeId ?? null;
        this.shapeColor = options.shapeColor ?? 'red';
    }
};
export class Tag{
    public value:EntityTag;
    constructor(options:TagOptions){
        this.value = options.value ?? 'None';
    }
};
export class CarrotCountText{}; //TAG COMPONENT
export class RabbitCountText{}; //TAG COMPONENT
export class FoxCountText{}; //TAG COMPONENT
export class Energy{
    public maxValue:number;
    public value:number;
    constructor(options:EnergyOptions){
        this.maxValue = options.maxValue ?? 1;
        this.value = this.maxValue;
    }
};