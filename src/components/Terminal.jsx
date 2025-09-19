import React, { useState } from "react";
import TypingLine from "./TypingLine";

export default function Terminal() {
  const [history, setHistory] = useState([
    "Welcome to CodeVerseOrg Terminal 💻",
    "Type 'help' to see available commands.",
  ]);
  const [input, setInput] = useState("");

  const handleCommand = (cmd) => {
    let output = "";
    switch (cmd.toLowerCase()) {
      case "help":
        output = "Available commands: help, about, repos, devs, clear";
        break;
      case "about":
        output = "CodeVerseOrg — Open source projects for learners & devs.";
        break;
      case "repos":
        output = "Fetching repos from GitHub… (coming soon)";
        break;
      case "devs":
        output = "Main dev: https://github.com/SmitroniX";
        break;
      case "clear":
        setHistory([]);
        return;
      default:
        output = `Command not found: ${cmd}`;
    }
    setHistory((prev) => [...prev, `$ ${cmd}`, output]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    handleCommand(input.trim());
    setInput("");
  };

  return (
    <div className="bg-black border border-green-500 rounded-lg p-4 shadow-lg">
      {history.map((line, idx) => (
        <TypingLine key={idx} text={line} delay={idx * 0.1} />
      ))}

      <form onSubmit={handleSubmit} className="flex items-center mt-2">
        <span className="text-green-400">$</span>
        <input
          className="bg-transparent flex-1 ml-2 outline-none text-green-400"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          autoFocus
        />
      </form>
    </div>
  );
}
