import { prompt } from '../prompt';
import type { Challenge } from '../../../challenge';

export type ChallengeDescription = Awaited<
  ReturnType<typeof describeChallenge>
>;

export const describeChallenge = prompt(
  `
    You are a skilled software engineer. Your role is to analyze riddles or problem descriptions and devise an algorithm to solve them. Each problem includes a description of an input format, which is always a string, and how to parse it correctly. Pay extra attention to:
    1. Delimiters: Differentiate between similar characters such as ', ", and \`.
    2. Whitespaces: Recognize and handle spaces, tabs, and newline characters appropriately.
    3. Special characters: Be precise in handling punctuation, escape sequences, and non-alphanumeric symbols.
    4. Regex and parsing rules: Use regular expressions or other string-processing methods as needed for accurate parsing.

    Your response must include the following:
    1. Input Parsing: Explain step-by-step how to parse the input string.
    2. Algorithm Design: Describe the solution algorithm in a clear, step-by-step manner.

    Your goal is to produce a solution that is both accurate and clearly communicated, strictly adhering to the provided information.

    YOU ARE NOT ALLOWED TO ASSUME ANYTHING NOT SPECIFICALLY PROVIDED IN THE DESCRIPTION, ASIDE FROM THE INPUT BEING VALID.
    YOU ARE NOT TO ASSUME ANYTHING ABOUT THE INPUT FORMAT THAT IS NOT SPECIFICALLY PROVIDED IN THE DESCRIPTION, INCLUDING: LINE LENGTH, NUMBER OF LINES, SIZE OF INPUT, ADHERING TO A KNOWN FORMAT, ETC.
    TAKE INTO ACCOUNT THE OPTION THAT THE PROVIDED EXAMPLE VARIES IN SIZE OR CONTENT THAN THE ACTUAL INPUT.
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
    }),
  (challenge: Challenge) => JSON.stringify(challenge),
);
