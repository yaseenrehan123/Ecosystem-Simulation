import { Transform, type Engine, type EntityManager, type Vector2 } from "piton-engine";
import { Moveable } from "../components";

export function debugTargetPosition(engine:Engine){
    const em:EntityManager = engine.getEntityManager();
    const ctx:CanvasRenderingContext2D = engine.getCtx();
    em.query('All',{
        movable:Moveable,
        transform:Transform
    },(id,{movable,transform})=>{
        const pos:Vector2 = transform.globalPosition.position;
        const targetPos:Vector2 = movable.targetPos;
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = 'red';
        ctx.moveTo(pos.x,pos.y);
        ctx.lineTo(targetPos.x,targetPos.y);
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
    });
}