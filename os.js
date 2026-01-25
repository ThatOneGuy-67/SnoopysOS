let zIndex = 1;

// ===== CUSTOM CURSOR =====
const cursor = document.createElement("div");
cursor.classList.add("custom-cursor");
document.body.appendChild(cursor);
document.addEventListener("mousemove", e => {
  cursor.style.left = e.clientX + "px";
  cursor.style.top = e.clientY + "px";
});

// ===== BOOT SCREEN =====
const bootText = document.getElementById("bootText");

function randomLine() {
  const hex = () => Math.floor(Math.random() * 0xffffffff).toString(16);
  let isError = Math.random() < 0.1;
  let prefix = isError ? "[ERROR] " : (Math.random() > 0.2 ? "[ OK ] " : "[WARN] ");
  let length = 40 + Math.floor(Math.random() * 40);
  let line = prefix;
  while (line.length < length) line += `sys_${hex()} `;
  return { line, isError };
}

let bootLinesPrinted = 0;
const maxBootLines = 700;

function printBootLine() {
  if (bootLinesPrinted < maxBootLines) {
    const { line, isError } = randomLine();
    const span = document.createElement("span");
    span.textContent = line + "\n";
    if (isError) span.style.color = "red";
    bootText.appendChild(span);
    bootText.parentElement.scrollTop = bootText.parentElement.scrollHeight;
    bootLinesPrinted++;
    setTimeout(printBootLine, 6.7);   // adjust speed here
  } else {
    const success = document.createElement("span");
    success.textContent = "[SUCCESS] Boot completed\n";
    success.style.color = "green";
    bootText.appendChild(success);
    bootText.parentElement.scrollTop = bootText.parentElement.scrollHeight;
    startCountdown(3);
  }
}

function startCountdown(seconds) {
  if (seconds > 0) {
    const span = document.createElement("span");
    span.textContent = `Launching Snoopy's OS in ${seconds}...\n`;
    span.style.color = "lightgreen";
    bootText.appendChild(span);
    bootText.parentElement.scrollTop = bootText.parentElement.scrollHeight;
    setTimeout(() => startCountdown(seconds - 1), 1000);
  } else {
    document.getElementById("boot").classList.add("hidden");
    document.getElementById("loginScreen").classList.remove("hidden");
    document.getElementById("user").focus();
  }
}

printBootLine();

// ===== LOGIN =====
function login() {
  const username = document.getElementById("user").value.trim();
  if (!username) return alert("Enter username!");
  document.getElementById("loginScreen").remove();
  document.getElementById("osRoot").classList.remove("hidden");
}

// ===== WINDOWS / TASKBAR =====
const tasks = document.getElementById("tasks");

function launchApp(app) {
  openWindow(app, appHTML[app] || getAppContent(app));
}

function openWindow(title, content){
  const win = document.createElement("div");
  win.className = "window";
  win.style.zIndex = ++zIndex;

  const taskBtn = document.createElement("button");
  const taskId = "task_" + Date.now();
  win.dataset.task = taskId;
  taskBtn.id = taskId;
  taskBtn.textContent = title;
  taskBtn.onclick = () => { 
    win.classList.toggle("hidden"); 
    win.style.zIndex = ++zIndex;
  };
  tasks.appendChild(taskBtn);

  // AUTO-DETECT URL → IFRAME
  const windowContent = typeof content === "string" && content.startsWith("http")
    ? `<iframe src="${content}" style="width:100%;height:100%;display:block;border:none;" sandbox="allow-scripts allow-same-origin"></iframe>`
    : content;

  win.innerHTML = `
    <div class="titlebar">
      <span>${title}</span>
      <div class="controls">
        <button onclick="minimize(this)">—</button>
        <button onclick="maximize(this)">▢</button>
        <button onclick="closeWin(this,event)">✕</button>
      </div>
    </div>
    <div class="content">${windowContent}</div>
  `;

  document.body.appendChild(win);
  makeDraggable(win);

  // CENTER AFTER WINDOW RENDERS
  requestAnimationFrame(() => {
    // use a second frame in case iframe content affects size
    requestAnimationFrame(() => {
      const rect = win.getBoundingClientRect();
      win.style.left = Math.max(0, (window.innerWidth - rect.width)/2) + "px";
      win.style.top  = Math.max(0, (window.innerHeight - rect.height)/2) + "px";
    });
  });
}


// ===== DRAG + SNAP =====
function makeDraggable(win) {
  const bar = win.querySelector(".titlebar");
  let offsetX = 0, offsetY = 0;

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

// ===== MINIMIZE/MAXIMIZE/CLOSE =====
function minimize(btn) {
  btn.closest(".window").classList.add("hidden");
}
function maximize(btn) {
  btn.closest(".window").classList.toggle("max");
}
function closeWin(btn, e) {
  e.stopPropagation();
  const win = btn.closest(".window");
  document.getElementById(win.dataset.task)?.remove();
  win.remove();
}

// ===== APPS (PASTE LINKS HERE) =====
const appHTML = {
  "Chat": "https://thatoneguy-67.github.io/Snoopy-s-Chat/",
  "Soundboard": "https://thatoneguy-67.github.io/ThatOneGuys-Soundboard/"
  "Games": "https://thatoneguy-67.github.io/SnoopyOS-Games/"
};

function getAppContent(app) {
  if (app === "About") return "SnoopyOS v0.3<br>Glass + Snap + Boot Screen";
  if (app === "Files") return "<ul><li>Documents</li><li>Downloads</li><li>System</li></ul>";
  if (app === "Settings") return "Settings panel coming soon";
  return "Unknown app";
}
// ===== CLOCK =====
function updateClock() {
  const clock = document.getElementById("clock");
  const now = new Date();
  clock.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit'});
}
setInterval(updateClock, 1000);
updateClock();
