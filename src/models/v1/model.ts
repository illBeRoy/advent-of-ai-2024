import OpenAI from 'openai';
import type { Model } from '../../model';

export const model: Model = {
  solve: async (challenge) => {
    const openai = new OpenAI();

    const prompt = `
    You are a software engineer.
    The user will provide you with a challenge.
    Your job is to write a typescript function that, given a specific input (in format described within the challenge), returns the solution.

    The function should be written in typescript.
    The function should be valid and runnable.
    The function should be exported as "solver".
    The function should adhere to the following interface: (input: string) => Promise<string>;

    Your response is going to be used as a typescript file, so return your code in a typescript format, NOT markdown, HTML, or any other format.
    Do NOT wrap your code in a code block or any other formatting.
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: prompt },
        { role: 'user', content: challenge.description },
      ],
    });

    return response.choices[0].message.content;
  },
};
