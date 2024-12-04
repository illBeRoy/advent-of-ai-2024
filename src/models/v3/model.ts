import type { Model } from '../../model';
import { describeChallenge } from './prompts/describeChallenge';
import { provideExamples } from './prompts/provideExamples';
import { refactorCode } from './prompts/refactorCode';
import { testCode } from './prompts/testCode';
import { writeCode } from './prompts/writeCode';

export const model: Model = {
  name: 'Model where I used gpt-4o to generate the prompts',
  solve: async (challenge, ctx) => {
    ctx.say('🧮 Breaking down the challenge...');
    const taskDescription = await describeChallenge(challenge);
    ctx.say(
      `✅ Challenge description broken down. Algorithm expected to have ${taskDescription.algorithm.length} steps.`,
    );
    ctx.think(taskDescription);

    ctx.say('🔍 Looking for examples in the challenge description...');
    const examples = await provideExamples(challenge);
    ctx.think(examples);

    ctx.say('💻 Writing code...');
    const codeWritingResults = await writeCode(taskDescription);
    ctx.think(codeWritingResults);

    let code = codeWritingResults.code;
    for (let attempt = 1; attempt <= 5; attempt++) {
      ctx.say(`🧪 Testing code... (attempt ${attempt})`);
      const testResults = await testCode(
        code,
        examples.example.input,
        examples.example.output,
      );

      if (testResults.result.testPassed) {
        ctx.say('✅ Test passed!');
        break;
      }

      ctx.say('❌ Test failed');
      ctx.think(testResults);

      if (attempt === 5) {
        ctx.say('❌ Code failed tests 5 times in a row.');
        return '';
      }

      ctx.say('🧰 Refactoring code...');
      const refactoringResults = await refactorCode(
        code,
        testResults.result.requiredChanges.map((change) => change.whatToChange),
      );
      ctx.think(refactoringResults);

      code = refactoringResults.refactoredCode;
    }

    return code;
  },
};
