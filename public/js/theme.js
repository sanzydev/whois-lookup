const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
let theme = localStorage.getItem("theme") || "auto";

const themeToggle = document.getElementById("themeToggle");
themeToggle.addEventListener("click", () => {
  if (theme == "auto") {
    if (prefersDarkScheme.matches) {
      document.querySelector("body").setAttribute("data-bs-theme", "dark");
      localStorage.setItem("theme", "dark");
      theme = "dark";
      themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
      document.querySelector("body").setAttribute("data-bs-theme", "light");
      localStorage.setItem("theme", "light");
      theme = "light";
      themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }
  } else if (theme === "dark") {
    localStorage.setItem("theme", "light");
    theme = "light";
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    document.querySelector("body").setAttribute("data-bs-theme", "light");
  } else {
    localStorage.setItem("theme", "dark");
    theme = "dark";
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    document.querySelector("body").setAttribute("data-bs-theme", "dark");
  }
});

if (theme === "auto") {
  if (prefersDarkScheme.matches) {
    document.querySelector("body").setAttribute("data-bs-theme", "dark");
    localStorage.setItem("theme", "dark");
    theme = "dark";
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
  } else {
    document.querySelector("body").setAttribute("data-bs-theme", "light");
    localStorage.setItem("theme", "light");
    theme = "light";
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
  }
} else if (theme === "dark") {
  document.querySelector("body").setAttribute("data-bs-theme", "dark");
  themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
} else {
  document.querySelector("body").setAttribute("data-bs-theme", "light");
  themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
}