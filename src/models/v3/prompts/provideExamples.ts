import { prompt } from '../prompt';
import {
  EXAMPLE_DESCRIPTION_1,
  EXAMPLE_DESCRIPTION_2,
  EXAMPLE_DESCRIPTION_3,
  EXAMPLE_INPUT_1,
  EXAMPLE_INPUT_2,
  EXAMPLE_INPUT_3,
  EXAMPLE_OUTPUT_1,
  EXAMPLE_OUTPUT_2,
  EXAMPLE_OUTPUT_3,
} from '../examples';
import type { Challenge } from '../../../challenge';

export const provideExamples = prompt(
  `
    You are a skilled software engineer. Your role is to analyze riddles or problem descriptions and devise an algorithm to solve them. Each problem includes a description of an input format, which is always a string, and how to parse it correctly.
    The problem description contains examples of input and output. These examples are present in the description and must be taken directly from it—do not invent or assume any data. Carefully identify them from the context, even if they are not formatted (e.g., no markdown).

    Examples for descriptions and the expected example input and output you should extract from them:

    ${[
      [EXAMPLE_DESCRIPTION_1, EXAMPLE_INPUT_1, EXAMPLE_OUTPUT_1],
      [EXAMPLE_DESCRIPTION_2, EXAMPLE_INPUT_2, EXAMPLE_OUTPUT_2],
      [EXAMPLE_DESCRIPTION_3, EXAMPLE_INPUT_3, EXAMPLE_OUTPUT_3],
    ]
      .map(([desc, inp, out], i) =>
        [
          `EXAMPLE ${i + 1}:`,
          'DESCRIPTION:',
          desc,
          '',
          'INPUT:',
          inp,
          '',
          'OUTPUT:',
          out,
        ].join('\n'),
      )
      .join('\n\n')}
  `,
  (z) =>
    z.object({
      example: z.object({
        input: z.string().describe('The input you extracted from the example'),
        output: z
          .string()
          .describe('The output you extracted from the example'),
      }),
    }),
  (challenge: Challenge) => challenge.description,
);
