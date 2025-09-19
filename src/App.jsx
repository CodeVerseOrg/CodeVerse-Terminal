import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Typewriter } from "react-simple-typewriter";
import "./index.css";

export default function App() {
  const [booting, setBooting] = useState(true);
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState("");
  const [pointer, setPointer] = useState(-1);
  const terminalEndRef = useRef(null);

  const prompt = "codeverse@org:~$";

  useEffect(() => {
    if (booting) {
      const timer = setTimeout(() => setBooting(false), 6000);
      return () => clearTimeout(timer);
    }
  }, [booting]);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const handleCommand = async (cmd) => {
    let output = "";
    const args = cmd.trim().split(" ");

    switch (args[0].toLowerCase()) {
      case "help":
        output = `Available commands:
- help → Show this help message
- about → About CodeVerseOrg
- devs → Show developer info (SmitroniX)
- repos → List CodeVerseOrg repos
- repo <name> → Show details of a specific repo
- clear → Clear the terminal`;
        break;

      case "about":
        output =
          "🚀 Welcome to CodeVerseOrg!\nA hub for open-source coding projects and collaboration.";
        break;

      case "devs":
        try {
          const userRes = await fetch("https://api.github.com/users/SmitroniX");
          const user = await userRes.json();
          output = `👨‍💻 ${user.name || user.login}
${user.bio || "No bio"}
GitHub: ${user.html_url}
Public Repos: ${user.public_repos}
Followers: ${user.followers}`;
        } catch {
          output = "⚠️ Failed to fetch developer info.";
        }
        break;

      case "repos":
        try {
          const res = await fetch(
            "https://api.github.com/orgs/CodeVerseOrg/repos?per_page=100&sort=updated"
          );
          const repos = await res.json();
          output =
            "📂 CodeVerseOrg Repositories:\n" +
            repos
              .map(
                (r) =>
                  `- ${r.name} ⭐${r.stargazers_count}\n  ${r.description || "No description"}\n  ${r.html_url}`
              )
              .join("\n\n");
        } catch {
          output = "⚠️ Failed to fetch repositories.";
        }
        break;

      case "repo":
        if (!args[1]) {
          output = "Usage: repo <name>";
          break;
        }
        try {
          const res = await fetch(
            `https://api.github.com/repos/CodeVerseOrg/${args[1]}`
          );
          const repo = await res.json();
          output = repo.message
            ? `⚠️ Repo '${args[1]}' not found.`
            : `📦 ${repo.full_name}
${repo.description || "No description"}
⭐ Stars: ${repo.stargazers_count} | 🍴 Forks: ${repo.forks_count}
🔗 ${repo.html_url}`;
        } catch {
          output = "⚠️ Failed to fetch repository.";
        }
        break;

      case "clear":
        setHistory([]);
        return;

      default:
        output = `command not found: ${args[0]}`;
    }

    setHistory((prev) => [...prev, { cmd, output }]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    handleCommand(input);
    setInput("");
    setPointer(-1);
  };

  return (
    <div className="terminal">
      {booting ? (
        <div>
          <Typewriter
            words={[
              "Booting CodeVerseOrg Terminal...",
              "Loading modules...",
              "Fetching GitHub repos...",
              "Initializing environment...",
              "Ready ✅",
            ]}
            loop={false}
            cursor
            cursorStyle="█"
            typeSpeed={60}
            deleteSpeed={30}
            delaySpeed={1000}
          />
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <p>Welcome to CodeVerseOrg Terminal 🌐</p>
          <p>Type 'help' to see available commands.</p>

          {history.map((entry, i) => (
            <div key={i}>
              <div>
                <span className="prompt">{prompt} </span>
                <span>{entry.cmd}</span>
              </div>
              <motion.pre
                className="output"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {entry.output}
              </motion.pre>
            </div>
          ))}

          <form onSubmit={handleSubmit}>
            <span className="prompt">{prompt} </span>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="input"
              autoFocus
            />
            <span className="cursor">█</span>
          </form>

          <div ref={terminalEndRef}></div>
        </motion.div>
      )}
    </div>
  );
}
