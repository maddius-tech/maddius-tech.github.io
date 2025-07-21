import { levelInfo } from "./levels/levels-info.js";
import firebase from "../../scripts/firebase-init.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import { getDoc, doc } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
import { displayQuestion } from "./questionUtils.js";

//Global variables
const questionIndexRef = { value: 0 };
let currentQuestions = [];

//Elements
const mapContainer = document.getElementById("levels-map-container");
const gameContainer = document.getElementById("game-container");

const handleAnswer = (correct) => {
    if (correct) {
        console.log('right answer!!!');
        questionIndexRef.value++;
        console.log('NEXT QUESTION: ', questionIndexRef.value);
        if (questionIndexRef.value < currentQuestions.length) {
            displayQuestion(currentQuestions[questionIndexRef.value], gameContainer, handleAnswer);
        } else {
            console.log('FINISHED THE LEVEL');
        }
    } else {
        console.log('nooooo');
    }
};

const loadLevel = async (levelId) => {
    try {
        //Display gameplay container
        mapContainer.style.display = "none";
        gameContainer.style.display = "flex";

        //Load questions
        const module = await import(`./levels/${levelId}.js`);
        currentQuestions = module.questions;
        displayQuestion(currentQuestions[0], gameContainer, handleAnswer);
    } catch (error) {
        console.error(`Failed to load level ${levelId}:`);
    }
};

const loadLevelsMap = async () => {
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
        div.addEventListener("click", () => {
            console.log(`Clicked level: ${level.id}`);
            loadLevel(level.id);
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