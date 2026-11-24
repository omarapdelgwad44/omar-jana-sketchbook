const sheets = [...document.querySelectorAll(".sheet")];
const prev = document.querySelector("[data-turn='prev']");
const next = document.querySelector("[data-turn='next']");
const count = document.querySelector("[data-count]");
const live = document.querySelector("[data-live]");
const digits = "٠١٢٣٤٥٦٧٨٩";

let index = Math.max(0, sheets.findIndex((sheet) => sheet.classList.contains("is-on")));

const arabicNumber = (value) => String(value).replace(/\d/g, (digit) => digits[digit]);

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function show(moved) {
  sheets.forEach((sheet, sheetIndex) => {
    const on = sheetIndex === index;
    sheet.classList.toggle("is-on", on);
    sheet.hidden = !on;
    sheet.classList.remove("is-turning");
  });

  const current = sheets[index];
  if (moved && !reducedMotion.matches) {
    current.classList.add("is-turning");
    current.addEventListener("animationend", () => current.classList.remove("is-turning"), { once: true });
  }

  prev.disabled = index === 0;
  next.disabled = index === sheets.length - 1;
  count.textContent = `${arabicNumber(index + 1)} من ${arabicNumber(sheets.length)}`;
  live.textContent = current.dataset.line || "";

  if (moved) {
    current.focus({ preventScroll: true });
  }
}

function go(nextIndex) {
  if (nextIndex < 0 || nextIndex >= sheets.length || nextIndex === index) return;
  index = nextIndex;
  show(true);
}

prev.addEventListener("click", () => go(index - 1));
next.addEventListener("click", () => go(index + 1));

document.addEventListener("keydown", (event) => {
  const typing = event.target.closest("input, textarea");
  if (typing) return;

  if (event.key === "ArrowLeft" || event.key === "PageDown") {
    event.preventDefault();
    go(index + 1);
  } else if (event.key === "ArrowRight" || event.key === "PageUp") {
    event.preventDefault();
    go(index - 1);
  } else if (event.key === "Home") {
    event.preventDefault();
    go(0);
  } else if (event.key === "End") {
    event.preventDefault();
    go(sheets.length - 1);
  }
});

let startX = 0;
let startY = 0;
const stage = document.querySelector(".stage");

stage.addEventListener("touchstart", (event) => {
  startX = event.changedTouches[0].clientX;
  startY = event.changedTouches[0].clientY;
}, { passive: true });

stage.addEventListener("touchend", (event) => {
  const deltaX = event.changedTouches[0].clientX - startX;
  const deltaY = event.changedTouches[0].clientY - startY;
  if (Math.abs(deltaX) < 48 || Math.abs(deltaX) < Math.abs(deltaY)) return;
  go(index + (deltaX < 0 ? 1 : -1));
});

show(false);
