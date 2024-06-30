import type { MetaFunction } from "@remix-run/node";
import { useCallback, useEffect, useState } from "react";

type Action =
  | {
      action: "facts";
      chunk: string;
    }
  | {
      action: "stop";
    }
  | {
      action: "error";
      message: string;
    };

export const meta: MetaFunction = () => {
  return [
    { title: "Remix Streaming Lists from GPT" },
    {
      name: "description",
      content:
        "A demo showing how to implement streaming data and create a structured list using GPT 3.5 completions",
    },
  ];
};

export default function Index() {
  const [input, setInput] = useState("");
  const [facts, setFacts] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isWaiting, setIsWaiting] = useState(false); // Changed to isWaiting

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  const handleFactChunk = useCallback(
    (chunk: string) => {
      setFacts((prevFacts) => {
        let chunkToInsert = chunk;
        // if we have "*" in the chunk we are starting a new fact
        if (chunk.includes("*")) {
          const splitChunk = chunk.split("*");
          if (splitChunk.length > 1) {
            // insert the chunk before the "*" to the previous fact
            if (prevFacts.length > 0) {
              // update the last fact
              prevFacts[prevFacts.length - 1] += splitChunk[0];
            }
            // initialize the fact
            prevFacts.push("");
            // insert the rest of the chunk as a new fact
            chunkToInsert = splitChunk[1];
          }
        }
        // only insert the chunk after we found the * to initialize it
        if (prevFacts.length > 0) {
          prevFacts[prevFacts.length - 1] += chunkToInsert;
          setIsWaiting(false); // Set isWaiting to true when streaming
        }
        // trim whitespace at the front and remove newlines
        return prevFacts.map((fact) => fact.trimStart().replace(/\n/g, ""));
      });
    },
    [setFacts]
  );

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFacts([]);
    setError(null);
    setIsWaiting(true); // Reset isWaiting when form is submitted

    const formData = new FormData(event.target as HTMLFormElement);
    const topic = formData.get("topic");

    const sse = new EventSource(`/facts/stream?topic=${topic}`);

    sse.addEventListener("message", (event) => {
      const parsedData: Action = JSON.parse(event.data);
      if (parsedData.action === "facts") {
        handleFactChunk(parsedData.chunk);
      } else if (parsedData.action === "error") {
        setError(parsedData.message);
        setIsWaiting(false);
        sse.close();
      } else if (parsedData.action === "stop") {
        setIsWaiting(false);
        sse.close();
      }
    });

    sse.addEventListener("error", () => {
      setError("An unexpected error occurred");
      setIsWaiting(false); // Set isWaiting to false on error
      sse.close();
    });
  };

  useEffect(() => {
    facts.forEach((fact, index) => {
      const element = document.getElementById(`textarea-${index}`);
      if (element) {
        adjustHeight(element as HTMLTextAreaElement);
      }
    });
  }, [facts]);

  // New handler to adjust textarea height
  const adjustHeight = (element: HTMLTextAreaElement) => {
    element.style.height = "auto"; // Reset the height
    element.style.height = `${element.scrollHeight}px`; // Adjust to content
  };

  return (
    <div
      style={{
        fontFamily: "system-ui, sans-serif",
        lineHeight: "1.8",
        textAlign: "center",
        margin: "0 auto",
      }}
    >
      <h1 className="font-bold">Streaming List from GPT</h1>
      <p>Type a topic to learn facts about it</p>
      <form onSubmit={handleFormSubmit} style={{ margin: "20px" }}>
        <input
          type="text"
          name="topic"
          value={input}
          onChange={handleInputChange}
          style={{ margin: "5px" }}
        />
        <button type="submit" style={{ margin: "5px" }}>
          Get Facts
        </button>
      </form>
      {error ? (
        <div style={{ color: "red", margin: "5px" }}>{error}</div>
      ) : isWaiting ? (
        <div>Loading facts...</div>
      ) : facts.length > 0 ? (
        <div style={{ margin: "5px" }}>
          <h3>Edit the facts below for correctness</h3>
          {facts.map((fact, index) => (
            <div key={index} style={{ margin: "5px" }}>
              <textarea
                id={`textarea-${index}`}
                value={fact}
                onChange={(e) => {
                  const updatedFact = e.target.value;
                  setFacts((prevFacts) => {
                    const updatedFacts = [...prevFacts];
                    updatedFacts[index] = updatedFact;
                    return updatedFacts;
                  });
                }}
                style={{ width: "600px", marginTop: "5px", resize: "none" }}
              />
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
