/** One transition per attempt; no persistence or daily-level logic. */
export class Run {
  phase: 'playing' | 'respawning' | 'won' = 'playing';
  deaths = 0;
  die(): boolean {
    if (this.phase !== 'playing') return false;
    this.phase = 'respawning';
    this.deaths++;
    return true;
  }
  respawn(): void { if (this.phase === 'respawning') this.phase = 'playing'; }
  win(): boolean {
    if (this.phase !== 'playing') return false;
    this.phase = 'won';
    return true;
  }
  restart(): void { this.deaths = 0; this.phase = 'playing'; }
}
