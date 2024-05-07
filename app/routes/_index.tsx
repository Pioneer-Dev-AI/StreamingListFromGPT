import type { MetaFunction } from "@remix-run/node";
import { useState } from "react";

export const meta: MetaFunction = () => {
  return [
    { title: "Remix Streaming Lists from GPT" },
    { name: "description", content: "Welcome to PioneerDev!" },
  ];
};

export default function Index() {
  const [input, setInput] = useState("");
  const [facts, setFacts] = useState([]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const formData = new FormData(event.target as HTMLFormElement);
    const text = formData.get("text");

    const sse = new EventSource(`/facts/stream?text_=${text}`);

    sse.addEventListener("facts", (event) => {
      console.log("message: ", event);
      // setFacts((prevFacts) => [...prevFacts, event.data]);
    });

    sse.addEventListener("error", (event) => {
      console.log("got error: ", event);
      sse.close();
    });
  };

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>Welcome to Remix</h1>
      <form onSubmit={handleFormSubmit}>
        <input
          type="text"
          name="text"
          value={input}
          onChange={handleInputChange}
        />
        <button type="submit">Get Facts</button>
      </form>
      <ul>
        {facts.map((fact, index) => (
          <li key={index}>{fact}</li>
        ))}
      </ul>
    </div>
  );
}
