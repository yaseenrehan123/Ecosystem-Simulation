import { Transform, type Engine, type EntityManager, type Vector2 } from "piton-engine";
import { Moveable, Tag } from "../components";

export function moveableSystem(engine:Engine):void{
    const em:EntityManager = engine.getEntityManager();
    const deltaTime:number = engine.getDeltaTime();
    em.query('All',{
        moveable:Moveable,
        transform:Transform
    },(id,{moveable,transform})=>{
        const pos:Vector2 = transform.globalPosition.position;
        const targetPos:Vector2 = moveable.targetPos;
        const moveDir:Vector2 = {
            x:targetPos.x - pos.x,
            y:targetPos.y - pos.y
        };
        const distance:number = Math.hypot(moveDir.x,moveDir.y);
        const deadzone:number = 3;
        if(distance > deadzone){
            moveable.reachedTarget = false;
            const normalizedMoveDir:Vector2 = {
                x:moveDir.x / distance,
                y:moveDir.y / distance
            };
            if(normalizedMoveDir.x > 0){
                transform.scale.value.x = 1;
            }else{
                transform.scale.value.x = -1;
            }
            pos.x += normalizedMoveDir.x * moveable.speed * deltaTime;
            pos.y += normalizedMoveDir.y * moveable.speed * deltaTime;
        }
        else{
            moveable.reachedTarget = true;
        }
    });
};