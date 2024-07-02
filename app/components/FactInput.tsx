import React from "react";

interface FactInputProps {
  input: string;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleFormSubmit: (event: React.FormEvent) => void;
}

const FactInput: React.FC<FactInputProps> = ({
  input,
  handleInputChange,
  handleFormSubmit,
}) => (
  <form
    onSubmit={handleFormSubmit}
    className="flex justify-center w-full p-1 gap-2"
  >
    <input
      type="text"
      name="topic"
      placeholder="Type a topic, personality or anything..."
      value={input}
      onChange={handleInputChange}
      className="px-2 rounded-md focus:outline-none text-black text-[10px] w-[220px]"
    />
    <button
      type="submit"
      className="rounded font-bold p-2 get-button text-sm transition hover:scale-105 duration-400 hover:text-white/90"
    >
      Get Facts
    </button>
  </form>
);

export default FactInput;
