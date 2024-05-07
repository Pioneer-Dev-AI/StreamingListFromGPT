import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const LIST_FACT_SYSTEM_PROMPT = `
List facts about the input the user provides.
Provide up to 8 facts.
Each fact should be structured as a list with each item prepended with a "*"


Example 1:
User: "Tom Brady"
* Tom Brady holds numerous NFL records, including most career touchdown passes and most career wins as a starting quarterback.
* He has appeared in 10 Super Bowls, the most of any player in NFL history, and has won seven of them.
* Brady was drafted by the New England Patriots in the 6th round of the 2000 NFL Draft, with the 199th overall pick.
* He played 20 seasons with the New England Patriots before moving to the Tampa Bay Buccaneers in 2020.
* Brady has been named Super Bowl MVP five times, which is more than any other player in history.
* He was named to the Pro Bowl 15 times throughout his career.
* Tom Brady has thrown for over 84,000 passing yards, which is one of the highest totals in NFL history.
* He is known for his strict diet and fitness regimen, which he credits for his longevity in the league.

Example 2:
User: "Kent Dodds"
* Kent Dodds is well-known for his contributions to open source software, particularly in the JavaScript ecosystem. He has created and maintained several popular libraries and tools that are widely used in the industry.
* He is highly regarded for his educational content, including articles, videos, and courses on modern JavaScript, React, and testing. His materials are widely used by developers to improve their skills.
* Kent is the creator of the testing library called "Testing Library," which is used to write tests for JavaScript and React applications in a way that encourages good testing practices.
* He previously worked at PayPal as a full-time JavaScript engineer, where he focused on building and maintaining scalable applications.


Only use a "*" to start each fact.
  `;

export async function generateFactCompletion(text: string) {
  const messages = [
    { role: "system", content: LIST_FACT_SYSTEM_PROMPT },
    { role: "user", content: text },
  ];
  return createStreamingCompletion(messages);
}

const FACT_CHECKING_SYSTEM_PROMPT = `
If the assitant is replying with something like "I'm sorry but the input you provided doesn't contain recongizable information", return "NO" otherwise return "YES".
Only respond "NO" if it is clear the assistant doesn't have facts to provide.
Respond "YES" if the assistant has provided facts, even if they are incorrect.
`;

export async function checkCompletionIsValid(text: string) {
  /**
   * This function is used to check if the completion is valid.
   * If it's not, we can prompt the user to provide a new input.
   */
  const messages = [
    { role: "system", content: FACT_CHECKING_SYSTEM_PROMPT },
    { role: "assistant", content: text },
  ];
  const completion = await createSimpleCompletion(messages);
  return completion !== "NO";
}

async function* createStreamingCompletion(
  messages: Array<{ role: string; content: string }>
) {
  const stream = await openai.chat.completions.create({
    model: "gpt-3.5-turbo-0125",
    messages: messages as OpenAI.Chat.ChatCompletionMessageParam[],
    stream: true,
  });
  for await (const part of stream) {
    const delta = part.choices[0]?.delta?.content || "";
    yield delta;
  }
}

async function createSimpleCompletion(
  messages: Array<{ role: string; content: string }>
) {
  const output = await openai.chat.completions.create({
    model: "gpt-3.5-turbo-0125",
    messages: messages as OpenAI.Chat.ChatCompletionMessageParam[],
  });
  return output.choices[0]?.message.content || "";
}
