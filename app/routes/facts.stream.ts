import { type LoaderFunctionArgs } from "@remix-run/node";
import { eventStream } from "~/event-stream.server";
import { generateFactCompletion } from "~/ai.server";
import { type SendFunction, type CleanupFunction } from "~/event-stream.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const text = url.searchParams.get("text");
  return eventStream(request.signal, function setup(send, close) {
    if (!text) {
      console.log("Missing text parameter")
      send({
        event: "facts",
        data: JSON.stringify({
          action: "error",
          message: "Missing text parameter",
        }),
      });
      setTimeout(() => {
        close();
      }, 0);
      return () => {};
    }
    generateFacts({ send, close, text });
    return () => {};
  });
}

async function generateFacts({
  send,
  close,
  text,
}: {
  send: SendFunction;
  close: CleanupFunction;
  text: string;
}) {
  const sendMessage = (payload: object) =>
    send({ event: "facts", data: JSON.stringify(payload) });

  try {
    const descriptionGenerator = generateFactCompletion(text);
    for await (const chunk of await descriptionGenerator) {
      sendMessage({
        action: "facts",
        data: { chunk },
      });
    }

    sendMessage({ action: "stop" });
    close(); // Close only after the last description
  } catch (err) {
    sendMessage({
      action: "error",
      message: err instanceof Error ? err.message : String(err),
    });
    close();
  }
}
