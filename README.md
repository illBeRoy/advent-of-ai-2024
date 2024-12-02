# advent-of-ai-2024

An attempt at the Advent of Code 2024 challenge, without directly writing any code.

## About

This is a project to try and use an LLM to generate the code that should solve every day's Advent of Code challenge.

I am going to do that by writing "models" that should be able to solve a given challenge, and tweaking them until they do.

## Goals
Main goal: **solve all 25 challenges by only writing models that can solve them for me**
Secondary goal: **do so with as few models as possible**

## Project structure

It has three directories:
- `challenges`: where every day's challenge is defined.
- `models`: my attempts at creating models to solve the challenges.
- `solutions`: where the LLM generated code and solutions are saved.

## Rules
1. **I cannot write any code directly under the `solutions` directory**
2. Instead, I will write models under the `models` directory.
3. A model must be fully autonomous. It must be able to solve a challenge without prompting me for any input.
4. For any given challenge, I cannot provide any input data aside from the interface defined in the `challenge.ts` file.
5. While in the process of solving a challenge, I can refactor the current model. But, once a model manages to solve a challenge, it becomes immutable and I can no longer change it. At this point, if my latest model fails at solving the next challenge, I will have to create a new one.
6. My models cannot be specifically trained to solve any individual challenge. That is, I cannot give them any directives based on the challenge itself ("note that there are 11 elves sorting the presents at the same time"), but instead I can only give them general instructions ("while writing your solution, take parallelism into account").

## Running the project
The project uses Bun. If you have Bun installed, you can simply run the following to get started:

```sh
bun install
bun start
```

If you do not wish to use Bun, just make sure that your alternative runtime supports typescript, `.env` files, and top-level `await`.
