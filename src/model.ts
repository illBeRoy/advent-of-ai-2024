import type { Challenge } from './challenge';

export interface Model {
  solve(challenge: Challenge): Promise<string>;
}
