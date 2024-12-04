import fs from 'node:fs';
import type { Challenge } from '../../challenge';

export const challenge: Challenge = {
  name: 'Day 4, Part 1',
  description: fs.readFileSync(`${__dirname}/part1.description.txt`, 'utf-8'),
  input: fs.readFileSync(`${__dirname}/input.txt`, 'utf-8'),
};
