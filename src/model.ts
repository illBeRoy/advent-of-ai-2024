import type { Challenge } from './challenge';

export interface Context {
  say(content: string): void;
  think(content: unknown): void;
}

export interface Model {
  name: string;
  solve(challenge: Challenge, ctx: Context): Promise<string>;
}
