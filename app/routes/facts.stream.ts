import { type LoaderFunctionArgs } from "@remix-run/node";
import { eventStream } from "~/event-stream.server";

import { generateFactCompletion, checkCompletionIsValid } from "~/gpt.server";
import { Action } from "~/types";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const text = url.searchParams.get("text");
  return eventStream(request.signal, function setup(send) {
    const sendMessage = (payload: Action) => {
      send({ event: "message", data: JSON.stringify(payload) });
    };
    if (!text) {
      // Send an error message if the text parameter is missing
      sendMessage({
        action: "error",
        message: "Missing text parameter",
      });
      return () => {};
    }
    generateFacts({ sendMessage, text });
    return function clear() {};
  });
}

async function generateFacts({
  sendMessage,
  text,
}: {
  sendMessage: (payload: Action) => void;
  text: string;
}) {
  try {
    const factGenerator = generateFactCompletion(text);
    let rawText = "";
    for await (const chunk of await factGenerator) {
      rawText += chunk;
      sendMessage({
        action: "facts",
        chunk,
      });
    }
    
    /*
    Check if the completion is valid using GPT before we finish.
    If invalid, throw an error.
    We use another prompt/GPT call here because if we put that logic in the generateFactCompletion prompt,
    it biases the GPT too often and causes it to give up too easily.
    */
    const isValid = await checkCompletionIsValid(rawText);
    if (!isValid) {
      sendMessage({
        action: "error",
        message: "Invalid input, please search another term",
      });
    }

    sendMessage({ action: "stop" });
  } catch (err) {
    sendMessage({
      action: "error",
      message: err instanceof Error ? err.message : String(err),
    });
  }
}
