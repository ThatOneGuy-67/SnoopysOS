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

  // Random error or normal line
  let isError = Math.random() < 0.1; // 10% chance
  let prefix = isError ? "[ERROR] " : (Math.random() > 0.2 ? "[ OK ] " : "[WARN] ");

  // Random line length
  let length = 40 + Math.floor(Math.random() * 40);
  let line = prefix;
  while (line.length < length) line += `sys_${hex()} `;

  return { line, isError };
}

let bootLinesPrinted = 0;
const maxBootLines = 200; // total lines before finishing boot

function printBootLine() {
  if (bootLinesPrinted < maxBootLines) {
    const { line, isError } = randomLine();
    const span = document.createElement("span");
    span.textContent = line + "\n";
    if (isError) span.style.color = "red";

    bootText.appendChild(span);
    bootText.parentElement.scrollTop = bootText.parentElement.scrollHeight;

    bootLinesPrinted++;
    setTimeout(printBootLine, 8); // faster typing
  } else {
    // Boot complete, show SUCCESS in green
    const success = document.createElement("span");
    success.textContent = "[SUCCESS] Boot completed\n";
    success.style.color = "green";
    bootText.appendChild(success);
    bootText.parentElement.scrollTop = bootText.parentElement.scrollHeight;

    // Start countdown
    startCountdown(5);
  }
}

// Countdown before launching OS
function startCountdown(seconds) {
  if (seconds > 0) {
    const span = document.createElement("span");
    span.textContent = `Launching Snoopy's OS in ${seconds}...\n`;
    span.style.color = "lightgreen";
    bootText.appendChild(span);
    bootText.parentElement.scrollTop = bootText.parentElement.scrollHeight;
    setTimeout(() => startCountdown(seconds - 1), 1000);
  } else {
    const span = document.createElement("span");
    span.textContent = "Launching Snoopy's OS now!\n";
    span.style.color = "lightgreen";
    bootText.appendChild(span);
    bootText.parentElement.scrollTop = bootText.parentElement.scrollHeight;

    // Here you can trigger your desktop / main OS screen
    launchSnoopysOS();
  }
}

// Placeholder function for launching your OS
function launchSnoopysOS() {
  console.log("Snoopy's OS would now appear!");
}

printBootLine();


// ===== LOGIN =====
function login(){
  const username = document.getElementById("user").value.trim();
  if(!username) return alert("Enter username!");
  document.getElementById("loginScreen").remove();
  document.getElementById("osRoot").classList.remove("hidden");
}

// ===== WINDOWS / TASKBAR =====
const tasks = document.getElementById("tasks");
function launchApp(app){
  openWindow(app, getAppContent(app));
}

function openWindow(title, content){
  const win = document.createElement("div");
  win.className = "window";
  win.style.zIndex = ++zIndex;
  win.style.left = "120px";
  win.style.top = "120px";

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

  win.innerHTML = `
    <div class="titlebar">
      <span>${title}</span>
      <div class="controls">
        <button onclick="minimize(this)">—</button>
        <button onclick="maximize(this)">▢</button>
        <button onclick="closeWin(this,event)">✕</button>
      </div>
    </div>
    <div class="content">${content}</div>
  `;
  document.body.appendChild(win);
  makeDraggable(win);
}

// ===== DRAG + SNAP =====
function makeDraggable(win){
  const bar = win.querySelector(".titlebar");
  let offsetX=0, offsetY=0;
  bar.onmousedown = e=>{
    offsetX=e.clientX-win.offsetLeft;
    offsetY=e.clientY-win.offsetTop;
    document.onmousemove = e=>{
      let x = e.clientX-offsetX;
      let y = e.clientY-offsetY;
      if(e.clientX<20) win.classList.add("snap-left");
      else if(e.clientX>window.innerWidth-20) win.classList.add("snap-right");
      else win.classList.remove("snap-left","snap-right");
      win.style.left = x+"px";
      win.style.top = y+"px";
      win.style.zIndex = ++zIndex;
    }
    document.onmouseup=()=>{document.onmousemove=null;}
  }
}

// ===== MINIMIZE/MAXIMIZE/CLOSE =====
function minimize(btn){ btn.closest(".window").classList.add("hidden"); }
function maximize(btn){ btn.closest(".window").classList.toggle("max"); }
function closeWin(btn,e){
  e.stopPropagation();
  const win = btn.closest(".window");
  const taskId = win.dataset.task;
  document.getElementById(taskId)?.remove();
  win.remove();
}

// ===== EXAMPLE APP CONTENT =====
function getAppContent(app){
  if(app==="About") return "SnoopyOS v0.3<br>Glass + Snap + Terminal Boot!";
  if(app==="Files") return "<ul><li>Documents</li><li>Downloads</li><li>System</li></ul>";
  if(app==="Settings") return "Settings panel: theme, permissions, etc.";
  return "Unknown app";
}
