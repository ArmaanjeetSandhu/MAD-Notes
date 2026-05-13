document.addEventListener("DOMContentLoaded", function () {
  renderMathInElement(document.body, {
    delimiters: [
      { left: String.raw`\(`, right: String.raw`\)`, display: false },
      { left: String.raw`\[`, right: String.raw`\]`, display: true },
    ],
    throwOnError: false,
  });
});
