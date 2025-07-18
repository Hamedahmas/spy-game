const players = ["شیر", "گربه", "روباه", "خرگوش", "سگ", "لاک‌پشت"];
const you = "خرگوش"; // می‌تونی این رو از URL بخونی
const isSpy = false;  // اگر جاسوس بود
const allCodes = {};  // کدها در ۳ مرحله

document.getElementById("you").innerText = you;
const table = document.getElementById("table");
const angleStep = 360 / players.length;

players.forEach((p, i) => {
  const div = document.createElement("div");
  div.className = "player";
  div.innerText = p;
  const angle = angleStep * i;
  const radius = 120;
  const x = 120 + radius * Math.cos(angle * Math.PI / 180);
  const y = 120 + radius * Math.sin(angle * Math.PI / 180);
  div.style.left = `${x}px`;
  div.style.top = `${y}px`;
  table.appendChild(div);
});

document.getElementById("code").innerText = isSpy
  ? "شما جاسوس هستید! کدی ندارید."
  : "لطفا کد مرحله را وارد کن";

let round = 0;
function submitCode() {
  const input = document.getElementById("yourCode");
  const code = input.value.trim();
  if (!code) return alert("کدی وارد کن");
  if (!allCodes[you]) allCodes[you] = [];
  allCodes[you].push(code);
  input.value = "";
  round++;
  if (round < 3) {
    alert(`کد مرحله ${round} ثبت شد`);
  } else {
    document.getElementById("submitArea").style.display = "none";
    simulateOthers();
    showAllCodes();
  }
}

function simulateOthers() {
  players.forEach(p => {
    if (p !== you) {
      allCodes[p] = [
        p === "روباه" ? "-" : p + "_کد۱",
        p === "روباه" ? "-" : p + "_کد۲",
        p === "روباه" ? "-" : p + "_کد۳"
      ];
    }
  });
}

function showAllCodes() {
  document.getElementById("allCodes").style.display = "block";
  const ul = document.getElementById("codesList");
  ul.innerHTML = "";
  players.forEach(p => {
    const li = document.createElement("li");
    const codes = allCodes[p] ? allCodes[p].join(" / ") : "ندارد";
    li.innerHTML = `<b>${p}</b>: ${codes}`;
    ul.appendChild(li);
  });

  setTimeout(() => {
    document.getElementById("voteSection").style.display = "block";
    const voteButtons = document.getElementById("voteButtons");
    players.forEach(p => {
      const btn = document.createElement("button");
      btn.innerText = p;
      btn.onclick = () => {
        const result = document.getElementById("result");
        result.innerHTML = `<b>تو به ${p} رای دادی.</b><br><br>`;
        result.innerHTML += p === "روباه"
          ? "<span style='color:lime'>شما جاسوس را درست حدس زدید! بازیکنان بردند.</span>"
          : "<span style='color:red'>اشتباه حدس زدی! جاسوس برد.</span>";
        result.innerHTML += "<br><br><b>جاسوس: روباه</b>";
        document.getElementById("voteSection").style.display = "none";
      };
      voteButtons.appendChild(btn);
    });
  }, 1000);
}
