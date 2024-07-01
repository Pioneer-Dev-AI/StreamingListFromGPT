import React from "react";

interface FactListProps {
  facts: string[];
  setFacts: React.Dispatch<React.SetStateAction<string[]>>;
  adjustHeight: (element: HTMLTextAreaElement) => void;
}

const FactList: React.FC<FactListProps> = ({
  facts,
  setFacts,
  adjustHeight,
}) => (
  <div className="m-[5px] text-black">
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
          style={{ width: "100%", marginTop: "5px", resize: "none" }}
        />
      </div>
    ))}
  </div>
);

export default FactList;
