import type { Engine, EntityManager } from "piton-engine";
import { Energy, Moveable } from "../components";

export function handleMoveSpeedSystem(engine: Engine) {
    const em: EntityManager = engine.getEntityManager();
    em.query('All', {
        moveable: Moveable,
        energy: Energy
    }, (id, { moveable, energy }) => {
        const clampedEnergyRatio: number = Math.max(0, Math.min(1,energy.value / energy.maxValue));
        moveable.speed = moveable.minSpeed + (moveable.maxSpeed - moveable.minSpeed) * clampedEnergyRatio;
        //console.log(`Entity ${id} | Energy: ${energy.value} | Speed: ${moveable.speed}`);
    });
}