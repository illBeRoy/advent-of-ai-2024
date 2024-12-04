import { prompt } from '../prompt';

export const refactorCode = prompt(
  `
  You are a skilled software engineer tasked with refactoring and fixing bugs in code. You will be provided with:
    1.	Existing code.
    2.	A list of changes to make.

  Your job is to:
    1.	Apply the requested changes to the code while ensuring the "solver" function remains unchanged in terms of its signature (name, parameters, and return type).
    2.	Update other parts of the code as necessary to accommodate the refactors, but do not modify the interface of the "solver" function.
    3.  Ensure that the "solver" function is exported. If it is not, you are NOT ALLOWED TO WRITE ANY CODE. TRY AGAIN.

  Provide the updated version of the code, ensuring it adheres to the refactor requirements and maintains functionality.
  `,
  (z) =>
    z.object({
      refactoredCode: z
        .string()
        .describe('the refactored code with the requested changes applied'),
    }),
  (code: string, changes: string[]) =>
    ['CODE:', code, '\nCHANGES:', changes.join('\n')].join('\n----------\n'),
);
