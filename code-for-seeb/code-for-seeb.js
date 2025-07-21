import { levelInfo } from "./levels/levels-info.js";
import firebase from "../scripts/firebase-init.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import { getDoc, doc } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

window.addEventListener("DOMContentLoaded", async () => {
    const container = document.getElementById("levels-map-container");
    const { auth, db } = await firebase;

    const levelDivs = {};
    levelInfo.forEach(level => {
        const div = document.createElement('div');
        div.classList.add('level-card', 'rounded-box');
        div.innerHTML = `
            <h3>${level.title}</h3>
            <p class="star-display"></p>
        `;
        container.appendChild(div);
        levelDivs[level.id] = div;
    });

    onAuthStateChanged(auth, async (user) => {
        if (!user) {
            console.log('not logged in');
            return;
        }

        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);
        const userData = userDocSnap.exists() ? userDocSnap.data() : { progress: {} };

        levelInfo.forEach(level => {
            const levelProgress = userData.progress?.[level.id];
            const div = levelDivs[level.id];
            const starDisplay = div.querySelector(".star-display");

            if (starDisplay) {
                starDisplay.textContent = `Stars: ${levelProgress ? levelProgress : 0}`;
            }

        });
    });
});