import { levelInfo } from "./levels/levels-info.js";
import firebase from "../../scripts/firebase-init.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import { getDoc, doc } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const loadLevelsMap = async () => {
    const mapContainer = document.getElementById("levels-map-container");
    const gameContainer = document.getElementById("game-container");
    const { auth, db } = await firebase;

    const levelDivs = {};
    levelInfo.forEach(level => {
        //Create div for level
        const div = document.createElement('div');
        div.classList.add('level-card', 'rounded-box');
        div.innerHTML = `
            <h3>${level.title}</h3>
            <p class="star-display"></p>
        `;

        //Add click listener
        div.addEventListener("click", async () => {
            console.log(`Clicked level: ${level.id}`);
            const levelId = level.id;
            try {
                const module = await import(`./levels/${levelId}.js`);
                mapContainer.style.display = "none";
                gameContainer.style.display = "flex";
                module.launchLevel(gameContainer);
            } catch (error) {
                console.error(`Failed to load level ${levelId}:`);
            }
        });

        //Add to html & to object
        mapContainer.appendChild(div);
        levelDivs[level.id] = div;
    });

    onAuthStateChanged(auth, async (user) => {
        let userProgress = {};
        if (user) {
            const userDocRef = doc(db, "users", user.uid);
            const userDocSnap = await getDoc(userDocRef);
            const userData = userDocSnap.exists() ? userDocSnap.data() : { progress: {} };
            userProgress = userData.progress;
        }

        levelInfo.forEach(level => {
            const div = levelDivs[level.id];

            const levelProgress = userProgress?.[level.id];
            const starDisplay = div.querySelector(".star-display");

            if (user) {
                starDisplay.textContent = `Stars: ${levelProgress ?? 0}`;
            } else {
                starDisplay.textContent = "";
            }

        });
    });
};

window.addEventListener("DOMContentLoaded", async () => {
    loadLevelsMap();
});