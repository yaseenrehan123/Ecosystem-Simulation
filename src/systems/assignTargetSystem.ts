import { Engine, Transform, type EntityId, type EntityManager, type Vector2 } from "piton-engine";
import { Moveable, LineOfSight, Tag } from "../components";

export function assignTargetSystem(engine: Engine): void {
    const em: EntityManager = engine.getEntityManager();
    const canvas = engine.getCanvasBounds();
    const allEntities: EntityId[] = em.getAllEntities();

    em.query('All', {
        transform: Transform,
        moveable: Moveable,
        lineOfSight: LineOfSight,
        tag: Tag
    }, (id, { transform, moveable, lineOfSight, tag }) => {
        const selfPos = transform.globalPosition.position;
        const radius = lineOfSight.value;

        // For filtering nearby entities
        let targetsOfInterest: { id: number, pos: Vector2 }[] = [];
        let threats: Vector2[] = [];

        for (const other of allEntities) {
            if (other === id) continue;
            const otherTag = em.getComponent(other, Tag);
            const otherTransform = em.getComponent(other, Transform);
            if (!otherTag || !otherTransform) continue;

            const otherPos = otherTransform.globalPosition.position;
            const dist = Math.hypot(otherPos.x - selfPos.x, otherPos.y - selfPos.y);
            if (dist > radius) continue;

            // RABBIT logic
            if (tag.value === 'Rabbit') {
                if (otherTag.value === 'Fox') {
                    threats.push(otherPos);
                } else if (otherTag.value === 'Carrot') {
                    targetsOfInterest.push({ id: other, pos: otherPos });
                }
            }

            // FOX logic
            if (tag.value === 'Fox' && otherTag.value === 'Rabbit') {
                targetsOfInterest.push({ id: other, pos: otherPos });
            }
        }

        // 🐇 Rabbit escapes predators first
        if (tag.value === 'Rabbit' && threats.length > 0) {
            let avgX = 0, avgY = 0;
            for (const threat of threats) {
                avgX += threat.x;
                avgY += threat.y;
            }
            avgX /= threats.length;
            avgY /= threats.length;

            // Move opposite to average threat center
            const escapeDir: Vector2 = {
                x: selfPos.x - avgX,
                y: selfPos.y - avgY
            };
            const length = Math.hypot(escapeDir.x, escapeDir.y);
            if (length > 0) {
                escapeDir.x /= length;
                escapeDir.y /= length;
            }

            // Set target a bit away in that direction
            const runDistance = 100;
            let targetX = selfPos.x + escapeDir.x * runDistance;
            let targetY = selfPos.y + escapeDir.y * runDistance;

            // Clamp within canvas
            targetX = Math.max(0, Math.min(canvas.x, targetX));
            targetY = Math.max(0, Math.min(canvas.y, targetY));

            // Check if we're too close to a wall after clamping
            const buffer = 10;
            const stuckInCorner =
                (targetX <= buffer || targetX >= canvas.x - buffer) &&
                (targetY <= buffer || targetY >= canvas.y - buffer);

            if (stuckInCorner) {
                // Pick a new random direction away from walls
                const randomAngle = engine.getRandomFloat(0, Math.PI * 2);
                const dx = Math.cos(randomAngle);
                const dy = Math.sin(randomAngle);

                targetX = Math.max(buffer, Math.min(canvas.x - buffer, selfPos.x + dx * runDistance));
                targetY = Math.max(buffer, Math.min(canvas.y - buffer, selfPos.y + dy * runDistance));
            }

            moveable.targetPos = {
                x: targetX,
                y: targetY
            };

            return;
        }

        // If there's a valid target (carrot for rabbit, rabbit for fox)
        if (targetsOfInterest.length > 0) {
            let closest = targetsOfInterest[0];
            let closestDist = Math.hypot(
                closest.pos.x - selfPos.x,
                closest.pos.y - selfPos.y
            );

            for (const target of targetsOfInterest) {
                const d = Math.hypot(target.pos.x - selfPos.x, target.pos.y - selfPos.y);
                if (d < closestDist) {
                    closest = target;
                    closestDist = d;
                }
            }

            moveable.targetPos = closest.pos;
            moveable.targetId = closest.id;
            return;
        }

        // Wander to random position if nothing found

        if (moveable.reachedTarget) {
            moveable.targetPos = {
                x: engine.getRandomFloat(0, canvas.x),
                y: engine.getRandomFloat(0, canvas.y)
            };
        }
        moveable.targetId = null;

    });
};
