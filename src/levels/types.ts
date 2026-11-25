/** Plain, JSON-serializable data. Coordinates are world pixels, rectangles top-left. */
export interface Point { readonly x: number; readonly y: number }
export interface Rect extends Point { readonly width: number; readonly height: number }
export interface Level {
  readonly id: string;
  readonly world: { readonly width: number; readonly height: number };
  /** Player centre; the current silhouette is 24 × 36. */
  readonly spawn: Point;
  readonly platforms: readonly Rect[];
  readonly walls: readonly Rect[];
  readonly obstacles: readonly (Rect & { readonly kind: 'spikes' })[];
  readonly deathZones: readonly Rect[];
  readonly goal: Rect;
}

export function validateLevel(level: Level): void {
  const fail = (message: string): never => { throw new Error(`Invalid level ${level.id}: ${message}`); };
  const { width, height } = level.world;
  if (!level.id.trim()) fail('missing id');
  if (![width, height].every(n => Number.isFinite(n) && n > 0)) fail('world dimensions');
  const checkRect = (rect: Rect) => {
    if (![rect.x, rect.y, rect.width, rect.height].every(Number.isFinite)
      || rect.width <= 0 || rect.height <= 0 || rect.x < 0 || rect.y < 0
      || rect.x + rect.width > width || rect.y + rect.height > height) fail('rectangle outside world or invalid dimensions');
  };
  const solids = [...level.platforms, ...level.walls];
  const lethal = [...level.obstacles, ...level.deathZones];
  [...solids, ...lethal, level.goal].forEach(checkRect);
  if (level.obstacles.some(obstacle => obstacle.kind !== 'spikes')) fail('unknown obstacle');
  const spawn = { x: level.spawn.x - 12, y: level.spawn.y - 18, width: 24, height: 36 };
  checkRect(spawn);
  const overlaps = (a: Rect, b: Rect) => a.x < b.x + b.width && a.x + a.width > b.x
    && a.y < b.y + b.height && a.y + a.height > b.y;
  if ([...solids, ...lethal, level.goal].some(rect => overlaps(spawn, rect))) fail('unsafe spawn');
  if ([...solids, ...lethal].some(rect => overlaps(level.goal, rect))) fail('blocked goal');
}
