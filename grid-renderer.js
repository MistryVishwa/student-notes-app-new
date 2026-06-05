document.addEventListener("DOMContentLoaded", async () => {
    const grid = document.getElementById("project-grid");
    if (!grid) return;
    try {
        const response = await fetch("projects.json");
        const projects = await response.json();
        grid.innerHTML = ""; // Clear container
        projects.forEach(proj => {
            const card = document.createElement("a");
            card.href = proj.path;
            card.className = "app-card"; // Adjust class name to match repository's standard CSS
            card.innerHTML = `<div class="icon-container"><i class="${proj.icon}"></i></div><h3>${proj.name}</h3><span class="tag">${proj.tag}</span>`;
            grid.appendChild(card);
        });
    } catch (error) {
        console.error("Failed to load projects:", error);
        grid.innerHTML = "<p>Error loading projects. Please try again later.</p>";
    }
});