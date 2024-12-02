import fs from 'node:fs/promises';
import prompts from 'prompts';
import type { Model } from './model';
import type { Challenge } from './challenge';
import type { Solver } from './solver';

if (!process.env.OPENAI_API_KEY) {
  const { openaiApiKey } = await prompts({
    name: 'openaiApiKey',
    type: 'invisible',
    message: 'Enter your OpenAI API key',
    validate: (value) => (value ? true : 'OpenAI API key is required.'),
  });

  if (!openaiApiKey) {
    console.error(
      'No OpenAI API key provided. It is required for using this program. To create one, visit https://platform.openai.com/api-keys',
    );
    process.exit(1);
  }

  process.env.OPENAI_API_KEY = openaiApiKey;
  await fs.writeFile('.env', `OPENAI_API_KEY=${openaiApiKey}\n`);
}

const modelsList = await fs.readdir('./src/models');
const { modelName } = await prompts({
  name: 'modelName',
  type: 'select',
  message: 'Select a model',
  choices: modelsList.map((model) => ({ title: model, value: model })),
});

const model = (await import(`./models/${modelName}/model`).then(
  (exported) => exported.model,
)) as Model;

const challengesList = await fs.readdir('./src/challenges');
const { challengeName } = await prompts({
  name: 'challengeName',
  type: 'select',
  message: 'Select a challenge',
  choices: challengesList.map((model) => ({
    title: model,
    value: model,
  })),
});

const partsList = await fs.readdir(`./src/challenges/${challengeName}`);
const { part } = await prompts({
  name: 'part',
  type: 'select',
  message: 'Select a challenge part',
  choices: partsList
    .filter((f) => f.endsWith('.ts'))
    .map((part) => ({ title: part.slice(0, -3), value: part })),
});

const challenge = await import(`./challenges/${challengeName}/${part}`).then(
  (exported) => exported.challenge as Challenge,
);

console.log('Running model...');

const solverCode = await model.solve(challenge);

const solutionDir = `./src/solutions/${challengeName}/${part.slice(0, -3)}`;

await fs.mkdir(solutionDir, {
  recursive: true,
});

const solverFilePath = `${solutionDir}/solver.ts`;

await fs.writeFile(solverFilePath, solverCode);

console.log(
  `Solver code written to ${solverFilePath}. Please review the file.`,
);

const { shouldRun } = await prompts({
  name: 'shouldRun',
  type: 'confirm',
  message: 'Run the solver?',
});

if (shouldRun) {
  const solver = await import(
    `./solutions/${challengeName}/${part.slice(0, -3)}/solver`
  ).then((exported) => exported.solver as Solver);

  const solution = await solver(challenge.input);
  await fs.writeFile(`${solutionDir}/solution.txt`, solution);

  console.log(`Solution written to ${solutionDir}/solution.txt`);
}
