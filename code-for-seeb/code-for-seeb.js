import { levelInfo } from "./levels/levels-info.js";

window.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("levels-map-container");
    console.log(container);
    console.log(levelInfo);

    levelInfo.forEach(level => {
        const div = document.createElement('div');
        div.classList.add('level-card', 'rounded-box');
        div.innerHTML = `
            <h3>${level.title}</h3> 
        `;
        container.appendChild(div);
    });
});