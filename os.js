let zIndex = 1;
const tasks = document.getElementById("tasks");

function launchApp(app) {
  openWindow(app, getAppContent(app));
}

function openWindow(title, content) {
  const win = document.createElement("div");
  win.className = "window";
  win.style.zIndex = ++zIndex;
  win.style.left = "120px";
  win.style.top = "120px";

  const taskBtn = document.createElement("button");
  taskBtn.textContent = title;
  taskBtn.onclick = () => {
    win.classList.toggle("hidden");
    win.style.zIndex = ++zIndex;
  };
  tasks.appendChild(taskBtn);

  win.innerHTML = `
    <div class="titlebar">
      <span>${title}</span>
      <div class="controls">
        <button onclick="minimize(this)">_</button>
        <button onclick="maximize(this)">□</button>
        <button onclick="closeWin(this, event)">X</button>
      </div>
    </div>
    <div class="content">${content}</div>
  `;

  document.body.appendChild(win);
  makeDraggable(win);
}

function minimize(btn) {
  btn.closest(".window").classList.add("hidden");
}

function maximize(btn) {
  const win = btn.closest(".window");
  win.classList.toggle("max");
}

function closeWin(btn, e) {
  e.stopPropagation();
  btn.closest(".window").remove();
}

function getAppContent(app) {
  if (app === "About") return "Snoopy’s OS<br>Version 0.2";
  if (app === "Files") return "File system not mounted.";
  if (app === "Settings") return "Settings panel.";
  return "Unknown app.";
}


/* ===== DRAGGING ===== */
function makeDraggable(win) {
  const bar = win.querySelector(".titlebar");
  let offsetX = 0;
  let offsetY = 0;

  bar.onmousedown = e => {
    offsetX = e.clientX - win.offsetLeft;
    offsetY = e.clientY - win.offsetTop;

    document.onmousemove = e => {
      win.style.left = e.clientX - offsetX + "px";
      win.style.top = e.clientY - offsetY + "px";
      win.style.zIndex = ++zIndex;
    };

    document.onmouseup = () => {
      document.onmousemove = null;
    };
  };
}

/* ===== CLOCK ===== */
setInterval(() => {
  const now = new Date();
  document.getElementById("clock").textContent =
    now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}, 1000);

document.getElementById("start").onclick = () => {
  document.getElementById("startMenu").classList.toggle("hidden");
};

