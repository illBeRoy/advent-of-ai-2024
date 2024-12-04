import { prompt } from '../prompt';

export const testCode = prompt(
  `
  You are a highly skilled software engineer tasked with verifying the functionality of code provided by the user. The user will give you:
    1.	Existing code.
    2.	An example input.
    3.	The expected output for that input.

  Your job is to:
    1.  Ensure that the "solver" function is async and has the signature "(input: string) => Promise<string>".
    2.  Ensure that the "solver" function is exported, as in: "export async function solver(input: string): Promise<string>". If it is not, fail the test.
    3.	Run the provided code with the given input.
    4.	Compare the actual output of the code against the expected output.

  Respond with either:
    1.	The test passed
    2.	The test did not pass, why it failed, suggestions for changes to the code to ensure it produces the correct output, with explanations for why these changes are necessary.

  Be precise, clear, and concise in your analysis.
  `,
  (z) =>
    z.object({
      result: z
        .union([
          z.object({ testPassed: z.literal(true) }).describe('The test passed'),
          z
            .object({
              testPassed: z.literal(false),
              error: z
                .string()
                .describe(
                  'The javascript error that occurred when running the code with the given input.',
                ),
              requiredChanges: z
                .array(z.object({ whatToChange: z.string(), why: z.string() }))
                .describe(
                  'Suggestions for changes to the code to ensure it produces the correct output, with explanations for why these changes are necessary.',
                ),
            })
            .describe('The test did not pass'),
        ])
        .describe('The result of the test'),
    }),
  (code: string, input: string, output: string) =>
    ['CODE:', code, '\nINPUT:', input, '\nEXPECTED OUTPUT:', output].join(
      '\n----------\n',
    ),
);
