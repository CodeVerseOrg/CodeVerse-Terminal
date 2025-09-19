const output = document.getElementById("output");
const cmdInput = document.getElementById("cmd");
const terminal = document.getElementById("terminal");

const commands = {
  help: "Available commands:\n- help\n- about\n- devs\n- repos\n- clear",
  about: "Welcome to CodeVerseOrg! 🚀\nA hub for open-source coding projects and collaboration.",
  clear: () => { output.innerHTML = ""; }
};

// Fetch developer info (from GitHub API + Pinned repos)
async function fetchDevs() {
  const res = await fetch("https://api.github.com/users/SmitroniX");
  const dev = await res.json();

  // Fetch pinned repos using unofficial API
  const pinnedRes = await fetch("https://gh-pinned-repos.egoist.dev/?username=SmitroniX");
  const pinned = await pinnedRes.json();

  let pinnedList = "📌 Pinned Repos:\n";
  pinned.forEach(repo => {
    pinnedList += `   🔗 <a href="${repo.link}" target="_blank">${repo.repo}</a> - ${repo.description || "No description"}\n`;
  });

  return `👨‍💻 Developer: ${dev.name || "Unknown"} (@${dev.login})\n🔗 GitHub: ${dev.html_url}\n📌 Bio: ${dev.bio || "No bio provided"}\n\n${pinnedList}`;
}

// Fetch repos from CodeVerseOrg (auto-updating)
async function fetchRepos() {
  const res = await fetch("https://api.github.com/orgs/CodeVerseOrg/repos?per_page=100&sort=updated");
  const repos = await res.json();

  if (!repos.length || repos.message) return "⚠️ No repositories found for CodeVerseOrg.";

  return repos.map(r => 
    `📂 <a href="${r.html_url}" target="_blank">${r.name}</a> - ${r.description || "No description"} ⭐ ${r.stargazers_count}`
  ).join("\n");
}

// Run commands
async function runCommand(cmd) {
  let response;
  switch (cmd) {
    case "help": response = commands.help; break;
    case "about": response = commands.about; break;
    case "devs": response = await fetchDevs(); break;
    case "repos": response = await fetchRepos(); break;
    case "clear": return commands.clear();
    default: response = `Command not found: ${cmd}`;
  }

  output.innerHTML += `\ncodeverse@org:~$ ${cmd}\n${response}\n`;
  terminal.scrollTop = terminal.scrollHeight;
}

// Input handler
cmdInput.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    const cmd = cmdInput.value.trim();
    if (cmd) runCommand(cmd);
    cmdInput.value = "";
  }
});

// Startup message
output.innerHTML = "Welcome to CodeVerseOrg Terminal 🌐\nType 'help' to see available commands.\n";
