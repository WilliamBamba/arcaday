import type { InputFrame } from '../input/controls';

export const MOVEMENT = { speed: 190, jumpSpeed: 470, releaseSpeed: 170, gravity: 1200 } as const;

/** Cut upward velocity on release; gravity and collision resolution belong to Phaser. */
export function movement(input: InputFrame, grounded: boolean, velocityY: number) {
  let y = velocityY;
  if (input.jumpPressed && grounded) y = -MOVEMENT.jumpSpeed;
  if (!input.jumpHeld && y < -MOVEMENT.releaseSpeed) y = -MOVEMENT.releaseSpeed;
  return { x: input.direction * MOVEMENT.speed, y };
}
