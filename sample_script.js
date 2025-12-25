// script.js
console.log("JS file loaded 🚀");

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("test-btn");

  btn.addEventListener("click", () => {
    alert("Button clicked. JS is working 👍");
  });
});
