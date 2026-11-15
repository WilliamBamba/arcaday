export type Action = 'left' | 'right' | 'jump';
export interface InputFrame { direction: number; jumpHeld: boolean; jumpPressed: boolean }

/** Each finger/key owns a source; releasing one never releases another. */
export class Controls {
  private sources = new Map<string, Action>();
  private pendingJump = false;

  press(source: string, action: Action): void {
    if (action === 'jump' && !this.held('jump')) this.pendingJump = true;
    this.sources.set(source, action);
  }
  release(source: string): void { this.sources.delete(source); }
  held(action: Action): boolean { return [...this.sources.values()].includes(action); }
  clear(): void { this.sources.clear(); this.pendingJump = false; }
  sample(): InputFrame {
    const frame = {
      direction: Number(this.held('right')) - Number(this.held('left')),
      jumpHeld: this.held('jump'), jumpPressed: this.pendingJump,
    };
    this.pendingJump = false;
    return frame;
  }
}

const keys: Record<string, Action> = {
  ArrowLeft: 'left', KeyA: 'left', KeyQ: 'left', ArrowRight: 'right', KeyD: 'right',
  Space: 'jump', ArrowUp: 'jump', KeyW: 'jump', KeyZ: 'jump',
};

export function bindControls(controls: Controls): () => void {
  const abort = new AbortController();
  const options = { signal: abort.signal };
  const buttons = document.querySelectorAll<HTMLButtonElement>('button[data-action]');
  const paint = () => buttons.forEach(button => {
    button.dataset.held = String(controls.held(button.dataset.action as Action));
  });
  // Ownership survives leaving the rectangle, but not interruption or release.
  const pointers = new Map<number, HTMLButtonElement>();
  const finish = (id: number) => {
    const button = pointers.get(id);
    pointers.delete(id);
    controls.release(`pointer:${id}`);
    if (button?.hasPointerCapture(id)) button.releasePointerCapture(id);
    paint();
  };
  const clear = () => {
    for (const id of pointers.keys()) finish(id);
    controls.clear();
    paint();
  };
  const updatePointer = (event: PointerEvent) => {
    const button = pointers.get(event.pointerId);
    if (!button) return;
    if (!button.hasPointerCapture(event.pointerId)) {
      finish(event.pointerId);
      return;
    }
    const rect = button.getBoundingClientRect();
    const inside = event.clientX >= rect.left && event.clientX < rect.right
      && event.clientY >= rect.top && event.clientY < rect.bottom;
    if (inside) controls.press(`pointer:${event.pointerId}`, button.dataset.action as Action);
    else controls.release(`pointer:${event.pointerId}`);
    paint();
  };
  buttons.forEach(button => {
    button.addEventListener('pointerdown', event => {
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      event.preventDefault();
      button.setPointerCapture(event.pointerId);
      pointers.set(event.pointerId, button);
      updatePointer(event);
    }, options);
    button.addEventListener('pointermove', updatePointer, options);
    for (const type of ['pointerup', 'pointercancel', 'lostpointercapture'] as const) {
      button.addEventListener(type, event => finish(event.pointerId), options);
    }
  });
  document.querySelector('.touch-controls')?.addEventListener('contextmenu', event => event.preventDefault(), options);
  window.addEventListener('keydown', event => {
    const action = keys[event.code];
    if (!action) return;
    event.preventDefault();
    if (!event.repeat) controls.press(`key:${event.code}`, action);
    paint();
  }, options);
  window.addEventListener('keyup', event => {
    if (!keys[event.code]) return;
    event.preventDefault(); controls.release(`key:${event.code}`); paint();
  }, options);
  window.addEventListener('blur', clear, options);
  document.addEventListener('visibilitychange', clear, options);
  return () => { abort.abort(); clear(); };
}
