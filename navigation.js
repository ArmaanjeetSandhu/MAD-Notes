const trailOrder = [
  { name: "Mind Maps", path: "mind-maps" },
  { name: "Regression", path: "regression" },
  { name: "Classification", path: "classification" },
  { name: "Diagnostics", path: "diagnostics" },
  { name: "k-Means Clustering", path: "k-means-clustering" },
  { name: "Density Estimation", path: "density-estimation" },
  { name: "Lifecycle", path: "lifecycle" },
];

let siteContentCache = null;

document.addEventListener("DOMContentLoaded", () => {
  const footer = document.querySelector(".nav-footer");
  if (footer) {
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
  }

  const pageContainer = document.querySelector(".page") || document.body;
  if (pageContainer) {
    const inSubfolder = trailOrder.some((topic) =>
      window.location.href.includes(`/${topic.path}/`),
    );
    const basePath = inSubfolder ? "../" : "./";

    const searchHTML = `
      <div class="search-container">
        <input type="text" id="site-search" placeholder="Press / to search..." autocomplete="off" />
        <div id="search-results" class="search-results" style="display: none;"></div>
      </div>
    `;
    pageContainer.insertAdjacentHTML("afterbegin", searchHTML);

    const searchInput = document.getElementById("site-search");
    const resultsContainer = document.getElementById("search-results");

    searchInput.addEventListener("focus", async () => {
      if (siteContentCache !== null) return;

      siteContentCache = [];
      searchInput.placeholder = "Loading search index...";

      for (let topic of trailOrder) {
        try {
          const response = await fetch(`${basePath}${topic.path}/index.html`);
          if (response.ok) {
            const htmlText = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlText, "text/html");

            const contentArea = doc.querySelector(".page") || doc.body;
            const cleanText = contentArea
              ? contentArea.innerText.replace(/\s+/g, " ").toLowerCase()
              : "";

            siteContentCache.push({
              title: topic.name,
              path: `${basePath}${topic.path}/`,
              content: cleanText,
            });
          }
        } catch (error) {
          console.warn(
            `Could not fetch ${topic.path} for search index.`,
            error,
          );
        }
      }
      searchInput.placeholder = "Press / to search...";
    });

    searchInput.addEventListener("input", (e) => {
      const query = e.target.value.toLowerCase().trim();
      resultsContainer.innerHTML = "";

      if (query.length < 2 || !siteContentCache) {
        resultsContainer.style.display = "none";
        return;
      }

      const matches = siteContentCache.filter((page) =>
        page.content.includes(query),
      );

      if (matches.length > 0) {
        matches.forEach((match) => {
          const resultLink = document.createElement("a");
          resultLink.href = match.path;
          resultLink.className = "search-result-item";
          resultLink.textContent = match.title;
          resultsContainer.appendChild(resultLink);
        });
      } else
        resultsContainer.innerHTML = `<div class="search-result-empty">No results found</div>`;

      resultsContainer.style.display = "block";
    });

    document.addEventListener("click", (e) => {
      if (!e.target.closest(".search-container"))
        resultsContainer.style.display = "none";
    });
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "/") {
    const activeTag = document.activeElement.tagName.toLowerCase();

    if (activeTag !== "input" && activeTag !== "textarea") {
      e.preventDefault();
      const searchInput = document.getElementById("site-search");
      if (searchInput) searchInput.focus();
    }
  }
});
