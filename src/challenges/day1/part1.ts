import fs from 'node:fs';
import type { Challenge } from '../../challenge';

export const challenge: Challenge = {
  name: 'Day 1, Part 1',
  description: fs.readFileSync(`${__dirname}/description.txt`, 'utf-8'),
  input: fs.readFileSync(`${__dirname}/input.txt`, 'utf-8'),
};
