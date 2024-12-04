import z from 'zod';
import OpenAI from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';

const openai = new OpenAI();

export const prompt = <
  T extends z.ZodObject<any>,
  TParams extends any[] = [string],
>(
  system: string,
  responseFormat: ($z: typeof z) => T,
  withInput?: (...params: TParams) => string,
) => {
  const zodSchema = responseFormat(z);

  return async function runPrompt(...params: TParams) {
    const response = await openai.beta.chat.completions.parse({
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: withInput?.(...params) ?? `${params[0]}` },
      ],
      model: 'gpt-4o-mini',
      response_format: zodResponseFormat(zodSchema, 'reply'),
    });

    return response.choices[0].message.parsed!;
  };
};
