import { type LoaderFunctionArgs } from "@remix-run/node";
import { eventStream } from "~/event-stream.server";

import { generateFactCompletion, checkCompletionIsValid } from "~/ai.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const text = url.searchParams.get("text");
  return eventStream(request.signal, function setup(send) {
    const sendMessage = (payload: object) =>
      send({ event: "message", data: JSON.stringify(payload) });
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
  sendMessage: (payload: object) => void;
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

    // Check if the completion is valid using GPT before we finish
    // if invalid, throw an error
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
