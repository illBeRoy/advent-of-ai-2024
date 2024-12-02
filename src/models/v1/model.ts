import { z } from 'zod';
import OpenAI from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import type { Model } from '../../model';
import type { Challenge } from '../../challenge';

const openai = new OpenAI();

export const model: Model = {
  solve: async (challenge, ctx) => {
    ctx.say('🧮 Breaking down the challenge...');
    const taskDescription = await describeChallenge(challenge);
    ctx.say(
      `✅ Challenge description broken down. Algorithm expected to have ${taskDescription.algorithm.length} steps.`,
    );
    ctx.think(taskDescription);

    const steps: z.infer<typeof AlgorithmStepOutput>[] = [];
    for (const step of taskDescription.algorithm) {
      ctx.say(
        `🔢 Implementing step ${steps.length + 1}/${taskDescription.algorithm.length}...`,
      );
      ctx.think(step);

      const stepResult = await implementAlgorithmStep({
        input: {
          type: steps[steps.length - 1]?.output.type ?? 'string',
          description:
            steps[steps.length - 1]?.output.description ??
            taskDescription.inputFormat,
        },
        output:
          step === taskDescription.algorithm.at(-1)
            ? { type: 'string' }
            : undefined,
        description: step,
        functionName: `step${steps.length + 1}`,
      });

      ctx.think(stepResult);
      steps.push(stepResult);
    }

    ctx.say('🔌 Creating solver...');
    const exportedFn = await createExportedSolver(steps.length);

    let code = [...steps.map((step) => step.code), exportedFn.code].join(
      '\n\n',
    );

    let attempts = 0;
    while (true) {
      if (attempts > 5) {
        console.error(
          '❌ Code did not pass code review after 5 attempts. Saving intermediate code into file',
        );
        return code;
      }

      ctx.say('🔍 Validating code...');
      ctx.think(code);

      const validationResult = await validateCode(
        code,
        taskDescription.algorithm.join('\n'),
        taskDescription.inputFormat,
      );

      if (validationResult.result.passesCodeReview) {
        ctx.say('✅ Code passes code review!');
        break;
      } else {
        ctx.say('❌ Code did not pass code review!');
        ctx.say(`  Changes made: ${validationResult.result.changesIMade}`);
        attempts += 1;
        code = validationResult.result.revisedCode;
      }
    }

    ctx.say('✅ Done!');
    return code;
  },
};

async function describeChallenge(challenge: Challenge) {
  const prompt = `
    You are a software engineer.
    The user will provide you with the description of a challenge.
    
    Please provide a breakdown of the challenge as you understand it.
    `;

  const replyFormat = z.object({
    inputFormat: z
      .string()
      .describe(
        'A full description of how to parse the input string. Try to find an example in the provided description. When it comes to delimiters, be precise: provide the exact string I need to use as delimiter (e.g. "*", "|", " ", etc.). Note that delimiters can be a single character or a multi-character string.',
      ),
    algorithm: z
      .array(z.string())
      .describe(
        'A list of steps describing an algorithm that solves the challenge, in natural language. every step should be pure, that is, not introduce any side effects, such as initializing variables.',
      ),
  });

  const response = await openai.beta.chat.completions.parse({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: prompt },
      { role: 'user', content: challenge.description },
    ],
    response_format: zodResponseFormat(replyFormat, 'reply'),
  });

  return response.choices[0].message.parsed!;
}

const AlgorithmStepInput = z.object({
  input: z.object({
    type: z.string().describe('The type of the input, as a typescript type'),
    description: z
      .string()
      .describe('A description of the input, in natural language'),
  }),
  output: z
    .object({
      type: z.string().describe('The type of the output, as a typescript type'),
    })
    .optional(),
  description: z
    .string()
    .describe('A description of the step, in natural language'),
  functionName: z
    .string()
    .describe('The name of the function to implement, in camelCase'),
});

const AlgorithmStepOutput = z.object({
  output: z.object({
    type: z.string().describe('The type of the output, as a typescript type'),
    description: z
      .string()
      .describe('A description of the output, in natural language'),
  }),
  code: z.string().describe('The code to implement the step, in typescript'),
});

async function implementAlgorithmStep(
  step: z.infer<typeof AlgorithmStepInput>,
) {
  const prompt = `
    You are a software engineer.
    The user will provide you with the description of a function that includes:
    1. The input type
    2. Description of the input contents
    3. The name of the function to implement
    4. The logic you need to implement
    ${
      step.output
        ? `5. The output type\n6. Description of the output contents`
        : ''
    }

    Your job is to implement the function in typescript.
    The code should start with a comment that explains how the function works in one sentence.
    `;

  const response = await openai.beta.chat.completions.parse({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: prompt },
      {
        role: 'user',
        content: [
          `Input Type: ${step.input.type}`,
          `Input Description: ${step.input.description}`,
          `Function name: ${step.functionName}`,
          `Logic: ${step.description}`,
          ...(step.output
            ? [
                `Output Type: ${step.output.type}`,
                `Output Description: ${step.output.description}`,
              ]
            : []),
        ].join('\n\n'),
      },
    ],
    response_format: zodResponseFormat(AlgorithmStepOutput, 'reply'),
  });

  return response.choices[0].message.parsed!;
}

async function createExportedSolver(stepsCount: number) {
  const prompt = `
    You are a software engineer.
    The user will provide you with a list of function names.
    
    Your job is to write, in typescript, a single exported async function called "solver", that accepts a string and returns a Promise that resolves to a string.
    The implementation of the function is:
    1. take the input string
    2. pass that string to the first function in the list
    3. await the result of that function
    4. pass the result to the next function in the list and repeat steps 3 and 4 until all functions have been applied
    6. return the result of the final function

    example:

    user: step1,step2,step3
    you:
    export const solver = async (input) => {
      const result1 = await step1(input);
      const result2 = await step2(result1);
      const result3 = await step3(result2);
      return result3;
    }
    `;

  const replyFormat = z.object({
    code: z.string().describe('The resulting typescript code'),
  });

  const response = await openai.beta.chat.completions.parse({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: prompt },
      {
        role: 'user',
        content: new Array(stepsCount)
          .fill('step')
          .map((fn, i) => `${fn}${i + 1}`)
          .join(','),
      },
    ],
    response_format: zodResponseFormat(replyFormat, 'reply'),
  });

  return response.choices[0].message.parsed!;
}

async function validateCode(
  code: string,
  description: string,
  inputFormat: string,
) {
  const prompt = `
    You are a senior software engineer.
    You are conducting a code review.

    The user is a junior software engineer that implemented a function called "solver".
    The user will provide you with the code they implemented in typescript.

    The function "solver" is supposed to take a string as input and resolve to a string as output.

    Review the code according to the specification (provided below), and decided:
    1. If it works as expected
    2. If not, revise the code, and explain what changes you made.

    YOU WILL ONLY CHECK THE CODE FOR VALIDITY, NOT FOR STYLE OR CLEANLINESS.

    ANY CHANGES YOU MAKE MUST BE TO THE EXISTING FUNCTIONS, DO NOT ADD OR REMOVE ANY OF THEM.

    The specification:
    This file exports a single function called "solver". This function is of type \`(input: string) => Promise<string>\`.
    The function accepts a string as input according to the following specification:
    ${inputFormat}

    The function should fulfill the following specs:
    ${description}
    `;

  const outputSchema = z.object({
    result: z.union([
      z
        .object({ passesCodeReview: z.literal(true) })
        .describe('The code passes the code review'),
      z
        .object({
          passesCodeReview: z.literal(false),
          revisedCode: z.string().describe('the revised and fixed code'),
          changesIMade: z
            .string()
            .describe('The changes you made to the code. Up to two sentences.'),
        })
        .describe(
          'The code does not pass the code review, along with the fixed code and the changes you made',
        ),
    ]),
  });

  const response = await openai.beta.chat.completions.parse({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: prompt },
      { role: 'user', content: code },
    ],
    response_format: zodResponseFormat(outputSchema, 'reply'),
  });

  return response.choices[0].message.parsed!;
}
