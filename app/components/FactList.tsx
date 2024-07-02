import React, { useEffect, useRef, useState } from "react";

interface FactListProps {
  facts: string[];
  setFacts: React.Dispatch<React.SetStateAction<string[]>>;
  input: string;
}

const FactList = ({ facts, input }: FactListProps) => {
  const [showFacts, setShowFacts] = useState<boolean[]>([]);
  const [searchInput, setSearchInput] = useState<string>("");
  const factEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    factEndRef.current?.scrollIntoView({ behavior: "auto" });
  };

  useEffect(() => {
    //save searchInput state
    setSearchInput(input);

    // Set showFacts to true for each fact after the component mounts
    setShowFacts(new Array(facts.length).fill(true));

    //Scroll to bottom when fact list is outside the view
    scrollToBottom();
  }, [facts]);

  return (
    <div className="mt-5">
      <h1 className="text-white text-3xl mb-5 capitalize text-center font-bold">
        {searchInput.toLowerCase()}
      </h1>
      <div className="text-black flex flex-col p-2 gap-2 mt-5 md:grid md:grid-cols-2 xl:grid-cols-3 md:px-10 xl:px-40">
        {facts.map((fact, index) => (
          <div
            key={index}
            className={`w-full bg-transparent mx-auto duration-300 ${
              showFacts[index] ? "fact-item" : ""
            } delay-300`}
          >
            <div className="fact-item-border border-2 p-2 font-extralight text-white text-sm h-full flex items-center justify-center">
              {showFacts[index] ? fact : ""}
            </div>
          </div>
        ))}
      </div>
      <div ref={factEndRef} />
    </div>
  );
};

export default FactList;
