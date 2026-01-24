let zIndex = 1;

const aboutText = `
<b>Snoopy’s OS</b><br><br>
A glass-style web operating system.<br>
Built using HTML, CSS, and JavaScript.<br><br>
Version: 0.1 alpha
`;

function openWindow(title, content) {
  const win = document.createElement("div");
  win.className = "window";
  win.style.zIndex = ++zIndex;
  win.style.left = "120px";
  win.style.top = "120px";

  win.innerHTML = `
    <div class="titlebar">
      <span>${title}</span>
      <div class="close" onclick="this.parentElement.parentElement.remove()">X</div>
    </div>
    <div class="content">${content}</div>
  `;

  document.body.appendChild(win);
  makeDraggable(win);
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
