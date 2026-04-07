const trailOrder = [
  { name: "Mind Maps", path: "mind-maps" },
  { name: "Regression", path: "regression" },
  { name: "Diagnostics", path: "diagnostics" },
  { name: "k-Means Clustering", path: "k-means-clustering" },
  { name: "Lifecycle", path: "lifecycle" },
];

document.addEventListener("DOMContentLoaded", () => {
  const footer = document.querySelector(".nav-footer");
  if (!footer) return;

  const currentIndex = trailOrder.findIndex((topic) =>
    window.location.href.includes(`/${topic.path}/`),
  );

  if (currentIndex !== -1) {
    let footerHTML = "";

    if (currentIndex > 0) {
      const prev = trailOrder[currentIndex - 1];
      footerHTML += `<a href="../${prev.path}/" class="nav-link-prev">${prev.name}</a>\n`;
    } else footerHTML += `<span></span>\n`;

    footerHTML += `<a href="../" class="nav-home">Home</a>\n`;

    if (currentIndex < trailOrder.length - 1) {
      const next = trailOrder[currentIndex + 1];
      footerHTML += `<a href="../${next.path}/" class="nav-link-next">${next.name}</a>\n`;
    } else footerHTML += `<span></span>\n`;

    footer.innerHTML = footerHTML;
  }
});
