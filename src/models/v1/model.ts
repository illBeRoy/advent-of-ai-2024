import type { Model } from '../../model';

export const model: Model = {
  solve: async (challenge) => {
    console.log('Solving challenge...');
    return 'export const solver = async (challenge) => { return "no way" }';
  },
};
