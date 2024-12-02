import type { Challenge } from './challenge';

export interface Context {
  say(content: string): void;
  think(content: unknown): void;
}

export interface Model {
  solve(challenge: Challenge, ctx: Context): Promise<string>;
}
