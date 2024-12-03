import { z } from 'zod';
import type { Model } from '../../model';
import type { Challenge } from '../../challenge';
import { prompt } from './prompt';

export const model: Model = {
  solve: async (challenge, ctx) => {
    ctx.say('🧮 Breaking down the challenge...');
    const taskDescription = await describeChallenge(challenge);
    ctx.say(
      `✅ Challenge description broken down. Algorithm expected to have ${taskDescription.algorithm.length} steps.`,
    );
    ctx.think(taskDescription);

    ctx.say('💻 Writing code...');
    const code = await writeCode(taskDescription);
    ctx.think(code);

    return code.code;
  },
};

const describeChallenge = prompt(
  `
    You are a software engineer.
    The user will provide you with the description of a challenge.
    
    Please provide a breakdown of the challenge as you understand it.
  `,
  (z) =>
    z.object({
      howToParseInputString: z
        .string()
        .describe(
          'A full description of how to parse the input string. Try to find an example in the provided description. When it comes to delimiters, be precise: provide the exact string I need to use as delimiter (e.g. "*", "|", " ", etc.). Note that delimiters can be a single character or a multi-character string.',
        ),
      algorithm: z
        .array(z.string())
        .describe(
          'A list of steps describing an algorithm that solves the challenge, in natural language. every step should be pure, that is, not introduce any side effects, such as initializing variables.',
        ),
      example: z.object({
        input: z
          .string()
          .describe('an input example as provided in the description'),
        output: z
          .string()
          .describe(
            'the expected output for the given example, as provided in the description',
          ),
      }),
    }),
  (challenge: Challenge) => JSON.stringify(challenge),
);

type ChallengeDescription = Awaited<ReturnType<typeof describeChallenge>>;

const writeCode = prompt(
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
