import React, { useState } from "react";

export default function App() {
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState("");

  const prompt = "codeverse@org:~$";

  // Handle user commands
  const handleCommand = async (cmd) => {
    let output = "";
    const args = cmd.split(" ");

    switch (args[0].toLowerCase()) {
      case "help":
        output = `
Available commands:
- help: Show this help message
- about: About CodeVerseOrg
- devs: Show developer info (SmitroniX)
- repos: List CodeVerseOrg repos
- repo <name>: Show details of a specific repo
- clear: Clear the terminal
        `;
        break;

      case "about":
        output =
          "🚀 Welcome to CodeVerseOrg!\nA hub for open-source coding projects and collaboration.";
        break;

      case "devs":
        try {
          const userRes = await fetch("https://api.github.com/users/SmitroniX");
          const user = await userRes.json();
          const pinnedRes = await fetch(
            "https://gh-pinned-repos.egoist.dev/?username=SmitroniX"
          );
          const pinned = await pinnedRes.json();

          output = `👨‍💻 ${user.name || user.login}
${user.bio || "No bio"}
GitHub: ${user.html_url}
Public Repos: ${user.public_repos}
Followers: ${user.followers}

📌 Pinned Repos:
${pinned
  .map(
    (r) => `- ${r.repo} ⭐${r.stars}
  ${r.link}`
  )
  .join("\n")}
          `;
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
          if (!Array.isArray(repos)) throw new Error();

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
          if (repo.message) {
            output = `⚠️ Repo '${args[1]}' not found.`;
          } else {
            output = `📦 ${repo.full_name}
${repo.description || "No description"}
⭐ Stars: ${repo.stargazers_count} | 🍴 Forks: ${repo.forks_count}
🔗 ${repo.html_url}`;
          }
        } catch {
          output = "⚠️ Failed to fetch repository.";
        }
        break;

      case "clear":
        setHistory([]);
        return;

      case "":
        output = "";
        break;

      default:
        output = `command not found: ${args[0]}`;
    }

    setHistory((prev) => [...prev, { cmd, output }]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleCommand(input.trim());
    setInput("");
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "900px",
        color: "#00ff66",
        fontFamily: "monospace",
        fontSize: "16px",
      }}
    >
      <div>
        <p>Welcome to CodeVerseOrg Terminal 🌐</p>
        <p>Type 'help' to see available commands.</p>
        {history.map((entry, i) => (
          <div key={i}>
            <span>{prompt} {entry.cmd}</span>
            <pre style={{ whiteSpace: "pre-wrap" }}>{entry.output}</pre>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        <span>{prompt} </span>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{
            background: "transparent",
            border: "none",
            outline: "none",
            color: "#00ff66",
            fontFamily: "monospace",
            fontSize: "16px",
            width: "70%",
          }}
          autoFocus
        />
      </form>
    </div>
  );
}
