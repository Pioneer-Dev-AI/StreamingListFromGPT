import { useState, useCallback } from "react";
import type { Action } from "~/types";

const useFactStream = () => {
  const [facts, setFacts] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isWaiting, setIsWaiting] = useState(false);

  const handleFactChunk = useCallback(
    (chunk: string) => {
      setFacts((prevFacts) => {
        let chunkToInsert = chunk;
        if (chunk.includes("*")) {
          const splitChunk = chunk.split("*");
          if (splitChunk.length > 1) {
            if (prevFacts.length > 0) {
              prevFacts[prevFacts.length - 1] += splitChunk[0];
            }
            prevFacts.push("");
            chunkToInsert = splitChunk[1];
          }
        }
        if (prevFacts.length > 0) {
          prevFacts[prevFacts.length - 1] += chunkToInsert;
          setIsWaiting(false);
        }
        return prevFacts.map((fact) => fact.trimStart().replace(/\n/g, ""));
      });
    },
    [setFacts]
  );

  const startStreaming = (topic: string) => {
    setFacts([]);
    setError(null);
    setIsWaiting(true);

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
      setIsWaiting(false);
      sse.close();
    });
  };

  return {
    facts,
    error,
    isWaiting,
    startStreaming,
    setFacts,
  };
};

export default useFactStream;
