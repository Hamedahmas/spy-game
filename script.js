
document.getElementById("btn-host").onclick = () => {
  document.getElementById("role-selection").classList.add("hidden");
  document.getElementById("host-panel").classList.remove("hidden");
};
document.getElementById("btn-player").onclick = () => {
  document.getElementById("role-selection").classList.add("hidden");
  document.getElementById("join-panel").classList.remove("hidden");
};
document.getElementById("generate-code").onclick = () => {
  const code = Math.floor(1000 + Math.random() * 9000);
  document.getElementById("game-code").innerText = code;
  document.getElementById("game-code-display").classList.remove("hidden");
};
