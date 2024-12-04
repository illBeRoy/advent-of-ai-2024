import { prompt } from '../prompt';
import type { ChallengeDescription } from './describeChallenge';

export const writeCode = prompt(
  `
    You are a software engineer.
    You are writing code.
    The user will provide you with a description of the algorithm you need to implement, as well as a description of how to parse the input.

    Implement a single exported async function called "solver" with signature "(input: string) => Promise<string>".
    The input of the function is a string, formatted exactly as described in the input format.
    The function should resolve to a string with the expected solution.

    WRITE CODE IN TYPESCRIPT.
    CODE MUST BE VALID.
    YOU ARE NOT TO IMPORT OR REQUIRE OR RELY ON ANY EXTERNAL MODULE.
    THE "solver" FUNCTION MUST BE EXPORTED, AS IN: "export async function solver(input: string): Promise<string>".
  `,
  (z) =>
    z.object({
      code: z.string().describe('The resulting typescript code'),
      reasoning: z
        .string()
        .describe('Tell us about the code you wrote in 1-2 sentences.'),
    }),
  (challengeDescription: ChallengeDescription) =>
    [
      'ALGORITHM:',
      challengeDescription.algorithm.map((step, i) => `${i}. ${step}`),
      '',
      'HOW TO PARSE INPUT STRING:',
      challengeDescription.howToParseInputString,
    ]
      .flat()
      .join('\n'),
);
