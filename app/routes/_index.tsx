import type { MetaFunction } from "@remix-run/node";
import { useEffect, useState } from "react";

import FactInput from "~/components/FactInput";
import FactList from "~/components/FactList";
import HeaderNav from "~/components/HeaderNav";
import HeroTitle from "~/components/HeroTitle";
import ManOnRocket from "~/assets/ManOnRocket.svg";

import useFactStream from "~/hooks/useFactStream";
import { adjustHeight } from "~/utils/adjustHeight";

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
  const { facts, error, isWaiting, startStreaming, setFacts } = useFactStream();
  const [input, setInput] = useState<string>("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    startStreaming(input);
  };

  useEffect(() => {
    facts.forEach((fact, index) => {
      const element = document.getElementById(`textarea-${index}`);
      if (element) {
        adjustHeight(element as HTMLTextAreaElement);
      }
    });
  }, [facts]);

  return (
    <main className="h-full">
      <HeaderNav />
      <HeroTitle />

      <div className="flex items-center justify-center">
        <img
          src={ManOnRocket}
          alt="Man_on_Rocket"
          className="mix-blend-hard-light h-[350px] w-[250px] animate-rocket-move"
        />
      </div>

      {error ? (
        <div style={{ color: "red", margin: "5px" }}>{error}</div>
      ) : isWaiting ? (
        <div>Loading facts...</div>
      ) : facts.length > 0 ? (
        <FactList
          facts={facts}
          setFacts={setFacts}
          adjustHeight={adjustHeight}
        />
      ) : null}

      <FactInput
        input={input}
        handleInputChange={handleInputChange}
        handleFormSubmit={handleFormSubmit}
      />
    </main>
  );
}
