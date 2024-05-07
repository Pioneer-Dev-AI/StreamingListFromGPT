/// `ChatGPT.tsx` from https://github.com/openai/openai-node/issues/18
import OpenAI from "openai";
import type { ChatCompletionMessageParam } from "openai/resources/index.mjs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function* createSimpleCompletion(
  messages: Array<{ role: string; content: string }>
) {
  const stream = await openai.chat.completions.create({
    model: "gpt-3.5-turbo-0125",
    messages: messages as ChatCompletionMessageParam[],
    stream: true,
  });
  for await (const part of stream) {
    const delta = part.choices[0]?.delta?.content || "";
    yield delta;
  }
}
