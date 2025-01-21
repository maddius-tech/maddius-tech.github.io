//
// GLOBAL VARIABLES
//

// Get canvas and context
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

// For Supabase (leaderboard database)
const supabaseUrl = 'https://qeyhzsgsmmvyxrilacrs.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFleWh6c2dzbW12eXhyaWxhY3JzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc0MjE5ODQsImV4cCI6MjA1Mjk5Nzk4NH0.wBKKLSpLHeixLn8Iue-IRvDSJ1M1N-zUSbb01TfQHLE';
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);
const gridSize = 50;

// Running game
let gameRunning = true;
const endGameButton = document.getElementById('end-game-button');
const gameOverPopup = document.getElementById('game-over-popup');

// Game modes
const shortGame = 20;
const medGame = 60;
const longGame = 300;
let inTimerMode = false;
let timerInterval; // to store interval ID
let timeRemaining;
let selectedTime = medGame;
const gameOverlay = document.getElementById('game-overlay');
const switchPopup = document.getElementById('switch-popup');
const countdownButton = document.getElementById('countdown-button');
const zenButton = document.getElementById('zen-button');
const timerButton = document.getElementById('timer-button');
const countdownSpan = document.getElementById('countdown-span');
const timeButtons = document.querySelectorAll('.time-option');
    
// Coordinates
let milletSeebCoordinates = [];
let sunflowerSeebCoordinates = [];
const maddiStartPos = { x: 0, y: 0 }; // Initial position at (0, 0)
let maddiPos = { ...maddiStartPos }; // Creates new object
let maddiEating = false;
let maddiDirection;

// Scores
let milletCount = 0;
let sunflowerCount = 0;
let score = 0;
const milletCountElement = document.getElementById('millet-count');
const sunflowerCountElement = document.getElementById('sunflower-count');
const totalScoreElement = document.getElementById('total-score');

// Leaderboard
const playerNameInput = document.getElementById('player-name');
const saveScoreButton = document.getElementById('save-score-button');

// Avatar selection
let selectedMaddi = 0;
let maddisAvailable = false;
const headerMaddis = [];

//
// IMAGES SETUP
//

let loadedImages = {};
const images = [
    { name: 'millet-seeb', src: '../need-for-seeb/images/millet-seeb.png' },
    { name: 'sunflower-seeb', src: '/need-for-seeb/images/sunflower-seeb.png' },
    { name: 'maddi-0', src: 'need-for-seeb/images/maddi-0.png' },
    { name: 'maddi-1', src: 'need-for-seeb/images/maddi-1.png' },
    { name: 'maddi-2', src: 'need-for-seeb/images/maddi-2.png' },
    { name: 'maddi-3', src: 'need-for-seeb/images/maddi-3.png' },
    { name: 'maddi-4', src: 'need-for-seeb/images/maddi-4.png' },
    { name: 'maddi-5', src: 'need-for-seeb/images/maddi-5.png' },
    { name: 'maddi-eating', src: 'need-for-seeb/images/maddi-eating.png' }
];

// Load images using promises
const loadImage = (src) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = () => resolve(img);
        img.onerror = () => reject(`Failed to load image at ${src}`);
    });
};

// Function to load all images and return object of image names and loaded image elements
const loadAllImages = () => {
    const imagePromises = images.map(imageObj => loadImage(imageObj.src).then(img => {
        return { name: imageObj.name, img: img };
    }));
    return Promise.all(imagePromises).then(imageObjects => {
        // Create an object with the image names as keys and the images as values
        loadedImages = imageObjects.reduce((acc, { name, img }) => {
            acc[name] = img;
            return acc;
        }, {});
    });
};

// Populate header
function populateHeader() {
    const imageContainers = document.querySelectorAll('.header-img-container');
    imageContainers.forEach((container, index) => {
        if (loadedImages[`maddi-${index}`]) {
            const img = document.createElement('img');
            img.src = loadedImages[`maddi-${index}`].src;
            img.alt = `Maddi ${index}`;
            img.classList.add('maddi-img');
            img.dataset.mIndex = index;
            container.appendChild(img);

            img.addEventListener('mouseenter', highlightMaddi.bind(null, index));
            img.addEventListener('mouseleave', unhighlightMaddi.bind(null, index));
            img.addEventListener('click', changeMaddi.bind(null, index));

            headerMaddis.push(img);
        }
    });
}

// Put images into scoreboard
function addImageToScoreboard(seebType) {
    const container = document.getElementById(`${seebType}-container`);
    if (loadedImages[`${seebType}-seeb`]) {
        const img = document.createElement('img');
        img.src = loadedImages[`${seebType}-seeb`].src;
        img.alt = seebType;
        img.classList.add('inline-image');
        container.appendChild(img);
    }
}

//
// SEEB FUNCTIONS
//

// Checks if coordinate is occupied
function isCoordOccupied(coord) {
    // Check Maddi position
    const hasMaddi = maddiPos.x === coord.x && maddiPos.y === coord.y;

    // Return true if the coordinate exists in either array
    return hasMillet(coord) || hasSunflower(coord) || hasMaddi;
}

function hasMillet(coord) {
    return milletSeebCoordinates.some(existingCoord => existingCoord.x === coord.x && existingCoord.y === coord.y);
}

function hasSunflower(coord) {
    return sunflowerSeebCoordinates.some(existingCoord => existingCoord.x === coord.x && existingCoord.y === coord.y);
}

// Generates random coordinates within the grid
function generateInitialSeeb() {
    //Generate millet seebs
    for (let i = 0; i < 5; i++) {
        generateNewSeeb(milletSeebCoordinates);
    }
    //Generate sunflower seebs
    for (let i = 0; i < 3; i++) {
        generateNewSeeb(sunflowerSeebCoordinates);
    }
}

function generateNewSeeb(seebArray) {
    const numRows = Math.floor(canvas.height / gridSize);
    const numCols = Math.floor(canvas.width / gridSize);

    let randomRow, randomCol, newCoord;
    do {
        randomRow = Math.floor(Math.random() * numRows);
        randomCol = Math.floor(Math.random() * numCols);
        newCoord = { x: randomCol * gridSize, y: randomRow * gridSize };
    } while (isCoordOccupied(newCoord)); // Check both arrays

    seebArray.push(newCoord);
}

function removeSeeb(coord, coordArray) {
    for (let i = 0; i < coordArray.length; i++) {
        if (coordArray[i].x === coord.x && coordArray[i].y === coord.y) {
            coordArray.splice(i, 1); // Remove the matching element
            break; // Exit the loop after removal
        }
    }
}

//
// DRAWING
//

function drawGrid() {
    ctx.strokeStyle = '#cccccc'; // Light gray for grid lines
    ctx.lineWidth = 1;

    // Draw vertical lines
    for (let x = 0; x <= canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }

    // Draw horizontal lines
    for (let y = 0; y <= canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
}

// Function to draw a specified image at a specified grid coordinate
function drawImageAtPosition(image, coord) {
    ctx.drawImage(image, coord.x, coord.y, gridSize, gridSize); // Draw the new image
}

function drawAdjustedImage(img, x, y, rotationAngle, flip = false) {
    const width = img.width;
    const height = img.height;

    ctx.save();

    ctx.translate(x + width / 2, y + height / 2);
    ctx.rotate(rotationAngle);
    
    if (flip) {
        ctx.scale(-1, 1);
        ctx.drawImage(img, -width/2 + gridSize, -height/2, width, height);
    } else if (rotationAngle === Math.PI / 2) {
        ctx.scale(1, -1);
        ctx.drawImage(img, -width/2 + gridSize/2, -height/2 - gridSize/2, width, height);
    } else {
        ctx.scale(1, -1);
        ctx.drawImage(img, -width/2 + gridSize/2, -height/2 + gridSize/2, width, height);
    }
    
    ctx.restore();
}

function drawSeebInGrid() {
    milletSeebCoordinates.forEach(coord => {
        drawImageAtPosition(loadedImages['millet-seeb'], coord);
    });
    sunflowerSeebCoordinates.forEach(coord => {
        drawImageAtPosition(loadedImages['sunflower-seeb'], coord);
    });
}

function drawMaddiEating() {
    switch (maddiDirection) {
        case 'ArrowUp':
            drawAdjustedImage(loadedImages['maddi-eating'], maddiPos.x, maddiPos.y, Math.PI / 2);
            break;
        case 'ArrowDown':
            drawAdjustedImage(loadedImages['maddi-eating'], maddiPos.x, maddiPos.y, -Math.PI / 2);
            break;
        case 'ArrowLeft':
            ctx.drawImage(loadedImages['maddi-eating'], maddiPos.x, maddiPos.y, gridSize*2, gridSize); 
            break;
        case 'ArrowRight':
            drawAdjustedImage(loadedImages['maddi-eating'], maddiPos.x, maddiPos.y, 0, true);
            break;
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawGrid();

    drawSeebInGrid();

    if (maddiEating) {
        drawMaddiEating(); 
    } else {
        drawImageAtPosition(loadedImages[`maddi-${selectedMaddi}`], maddiPos);
    }

}

//
// GAMEPLAY
//

// Moving Maddi with arrow keys
window.addEventListener('keydown', (event) => {
    if (!gameRunning) {
        return; //Ignore key presses if game not running
    }

    // Move the image based on arrow key input
    const moveAmount = gridSize; // Move by one grid square
    
    switch (event.key) {
        case 'ArrowUp':
            maddiPos.y = Math.max(0, maddiPos.y - moveAmount);
            break;
        case 'ArrowDown':
            maddiPos.y = Math.min(canvas.height - gridSize, maddiPos.y + moveAmount);
            break;
        case 'ArrowLeft':
            maddiPos.x = Math.max(0, maddiPos.x - moveAmount); // Prevent moving off the left
            break;
        case 'ArrowRight':
            maddiPos.x = Math.min(canvas.width - gridSize, maddiPos.x + moveAmount); // Prevent moving off the right
            break;
    }

    if (hasMillet(maddiPos)) {
        maddiDirection = event.key;
        maddiEat(milletSeebCoordinates);
    } else if (hasSunflower(maddiPos)) {
        maddiDirection = event.key;
        maddiEat(sunflowerSeebCoordinates);
    } else {
        draw();
    }

});

function maddiEat(seebArray) {
    //removing seeb, adding new seeb
    removeSeeb(maddiPos, seebArray);
    generateNewSeeb(seebArray);
    
    //updating scores
    if (seebArray === milletSeebCoordinates) {
        milletCount += 1;
    } else if (seebArray === sunflowerSeebCoordinates) {
        sunflowerCount += 1;
    }
    updateScores();

    //maddi eating animation
    maddiEating = true;
    draw();
    setTimeout(() => {
        maddiEating = false;
        draw();
    }, 250);    
}

function updateScores() {
    milletCountElement.textContent = milletCount;
    sunflowerCountElement.textContent = sunflowerCount;
    score = milletCount + sunflowerCount*3;
    totalScoreElement.textContent = score;
}

//
// PAUSING/ENDING GAME
//

// Deactivate game & show overlay
function deactivateGame() {
    gameOverlay.style.display = "block";
    gameRunning = false;

    //Deactivate buttons on info panels
    const boardButtons = document.querySelectorAll('.board button');
    boardButtons.forEach(button => {
        button.disabled = true;
    });
}

// Reactivate Game
function reactivateGame() {
    gameOverlay.style.display = "none";
    hideAllPopups();
    gameRunning = true;

    //Reactivate buttons on info panels
    const boardButtons = document.querySelectorAll('.board button');
    boardButtons.forEach(button => {
        button.disabled = false;
    });
}

//Show specified popup
function showPopup(popup) {
    popup.style.display = "block";
}

//Hide all popups
function hideAllPopups() {
    const popups = document.querySelectorAll('.popup');
    popups.forEach(popup => {
        popup.style.display = "none";
    });
}

// Ends game
function endGame() {
    if (!gameRunning) return; //Prevents multiple triggers
    deactivateGame();
    if (inTimerMode) {
        clearInterval(timerInterval);
    }

    //Display Game Over message
    const finalScore = document.getElementById('final-score');
    finalScore.textContent = score;
    showPopup(gameOverPopup);
}

// Restarts game
function restartGame() {    
    resetGameState();
    reactivateGame();
    if (inTimerMode) {
        clearInterval(timerInterval);
        startTimer();
    }
    gameLoop();
}

function resetGameState() {
    // Reset scores
    milletCount = 0;
    sunflowerCount = 0;
    score = 0;
    updateScores();
    
    // Reset gameboard
    milletSeebCoordinates = [];
    sunflowerSeebCoordinates = [];
    generateInitialSeeb();
    maddiPos = { ...maddiStartPos }; 

    // Reset disabled buttons
    playerNameInput.disabled = false;
    saveScoreButton.disabled = false;
    saveScoreButton.textContent = "Save score";
}

//Adding event listeners
endGameButton.addEventListener("click", endGame);
document.getElementById('end-restart-button').addEventListener("click", restartGame);

//
// GAME MODES
//

// Checks if user is ready to end current game
function confirmSwitch(event) {
    return new Promise((resolve, reject) => {
        deactivateGame();
    
        // Changing button text
        let buttonText;
        if (event.target.classList.contains('time-option')) {
            buttonText = "Change game length";
        } else if (event.target.id === "zen-button") {
            buttonText = "Switch to Zen Mode";
        } else if (event.target.id === "timer-button") {
            buttonText = "Switch to Timer Mode";
        }
        document.getElementById('switch-game-span').textContent = buttonText;
        
        showPopup(switchPopup);

        // Add event listners for buttons
        const confirmSwitchButton = document.getElementById('confirm-switch-button');
        const cancelSwitchButton = document.getElementById('cancel-switch-button');

        confirmSwitchButton.addEventListener("click", () => {
            resolve(); //User confirmed
        }, { once: true });

        cancelSwitchButton.addEventListener("click", () => {
            reactivateGame();
            reject();
        }, { once: true });
    });
}

async function activateTimerMode(event) {
    // Confirmation popup if game is running
    if (gameRunning) {
        try {
            await confirmSwitch(event);
        } catch {
            return;
        }
    }

    reactivateGame();
    inTimerMode = true;
    displayLeaderboard();

    //Switch buttons
    countdownButton.classList.remove('hidden');
    countdownSpan.textContent = convertTimeFormat(selectedTime);
    timerButton.classList.add('selected');
    zenButton.classList.remove('selected');
    document.getElementById('time-toggle').classList.remove('hidden');
    restartGame();
}

async function deactivateTimerMode(event) {
    // Confirmation popup if game is running
    if (gameRunning) {
        try {
            await confirmSwitch(event);
        } catch {
            return;
        }
    }

    if (!inTimerMode) {
        return;
    }
    inTimerMode = false;
    clearInterval(timerInterval);
    displayLeaderboard();

    //Switch buttons
    countdownButton.classList.add('hidden');
    timerButton.classList.remove('selected');
    zenButton.classList.add('selected');
    document.getElementById('time-toggle').classList.add('hidden');
    
    restartGame();
}

function startTimer() {
    timeRemaining = selectedTime;
    countdownSpan.textContent = convertTimeFormat(timeRemaining);

    //Start the countdown
    timerInterval = setInterval(() => {
        if (gameRunning) {
            timeRemaining --;
            countdownSpan.textContent = convertTimeFormat(timeRemaining);
    
            // Change to red when less than 10 seconds
            if (timeRemaining <= 10) {
                countdownSpan.style.color = 'red';
            }
    
            if (timeRemaining <= 0) {
                countdownSpan.style.color = 'black';
                endGame();
            }
        }
    }, 1000);
}

function convertTimeFormat(totalSeconds) {    
    if (totalSeconds > 60) {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    } else {
        return totalSeconds;
    }
}

// Uses variables to set up buttons on page load
function setupTimeButton(button, time) {
    button.textContent = convertTimeFormat(time);
    button.dataset.time = time;
    if (time === selectedTime) {
        button.classList.add('selected');
    }
}

// Event listeners for changing game modes
zenButton.addEventListener("click", deactivateTimerMode);
timerButton.addEventListener("click", activateTimerMode);

// Event listeners for time options
timeButtons.forEach(button => {
    button.addEventListener("click", async (event) => {
        // Confirmation popup if game is running
        let wasRunning = false;
        if (gameRunning) {
            wasRunning = true;
            try {
                await confirmSwitch(event);
            } catch {
                return;
            }
        }
        
        //Removes 'selected' class from all buttons
        timeButtons.forEach(btn => btn.classList.remove('selected'));
        //Adds 'selected' class to clicked button
        button.classList.add('selected');
        // Sets selectedTime for game
        selectedTime = parseInt(button.dataset.time);

        displayLeaderboard();
        
        if (wasRunning) {
            restartGame();
        }
    });
});

//
// CHANGING AVATAR
//

// Allows user to choose new avatar
function selectNewMaddi() {
    deactivateGame();
    
    maddisAvailable = true;
    highlightMaddi(selectedMaddi);
}

// Implements the change once new avatar is chosen
function changeMaddi(index) {
    if (!maddisAvailable) {
        return;
    }

    selectedMaddi = index;
    maddisAvailable = false;
    draw();
    reactivateGame();
}

function highlightMaddi(index) {
    if (!maddisAvailable) {
        return;
    }
    headerMaddis.forEach((_, index) => {
        unhighlightMaddi(index);
    });
    headerMaddis[index].classList.add('highlight');
}

function unhighlightMaddi(index) {
    headerMaddis[index].classList.remove('highlight');
}

document.getElementById('change-maddi-button').addEventListener("click", selectNewMaddi);

//
// LEADERBOARD FUNCTIONS
//

async function saveScore() {
    // Disables input & button
    saveScoreButton.disabled = true;
    playerNameInput.disabled = true;

    // Get player name. "Anon" if nothing is entered.
    let playerName = playerNameInput.value;
    if (playerName.trim() === "") {
        playerName = "anon";
    }

    let gameMode = getGameMode();

    try {
        await saveToSupabase(playerName, score, gameMode, selectedMaddi);
    } catch (error) {
        console.error(error);
        saveToLocalStorage(playerName, score, gameMode, selectedMaddi);
        console.log("Error saving to Supabase. Saved to local storage instead.");
    }

    saveScoreButton.textContent = "Score saved!";
    
    // Updates leaderboard
    displayLeaderboard();
}

async function saveToSupabase(name, score, game_mode, avatar) {    
    const { data, error } = await supabaseClient
        .from('leaderboard')
        .insert([{ name, score, game_mode, avatar}]);
    
    if (error) {
        throw new Error(`Error saving to Supabase: ${error.message}`);
    } else {
        console.log('Saved:', data);
    }
}

function saveToLocalStorage(name, score, gameMode, avatar) {
    const leaderboardKey = `${gameMode}-leaderboard`;
    const leaderboard = JSON.parse(localStorage.getItem(leaderboardKey)) || [];
    
    // Add new name & score
    leaderboard.push({ name, score, avatar });
    
    // Sort leaderboard in descending order (highest first)
    leaderboard.sort((a, b) => b.score - a.score);
    
    // Limits number of entries
    if (leaderboard.length > 5) { //If more than 5 entries,
        leaderboard.pop(); // removes lowest score
    }
    
    // Saving updated leaderboard into localStorage
    localStorage.setItem(leaderboardKey, JSON.stringify(leaderboard));
}

async function displayLeaderboard() {
    // Getting leaderboard info from Supabase or localStorage
    const gameMode = getGameMode();
    let leaderboard;
    try {
        leaderboard = await getSupabaseLeaderboard(gameMode);
    } catch (error) {
        console.error(error);
        leaderboard = getLocalLeaderboard(gameMode);
        console.log("Error fetching leaderboard from Supabase. Showing local leaderboard instead.");
    }

    // Getting table from html
    const leaderboardTable = document.querySelector('#leaderboard-table tbody');
    leaderboardTable.innerHTML = "";

    // Creating rows and adding to leaderboard
    leaderboard.forEach((entry, index) => {
        const row = document.createElement('tr');

        const rankCell = document.createElement('td');
        rankCell.textContent = index + 1;
        row.appendChild(rankCell);

        const avatarCell = document.createElement('td');
        if (entry.avatar !== undefined && entry.avatar !== null) {
            const avatarImg = document.createElement('img');
            avatarImg.src = `need-for-seeb/images/maddi-${entry.avatar}.png`;
            avatarImg.alt = "Avatar image";
            avatarCell.appendChild(avatarImg);
        }
        row.appendChild(avatarCell);

        const nameCell = document.createElement('td');
        nameCell.textContent = entry.name;
        row.appendChild(nameCell);

        const scoreCell = document.createElement('td');
        scoreCell.textContent = entry.score;
        row.appendChild(scoreCell);

        leaderboardTable.appendChild(row);
    });
}

async function getSupabaseLeaderboard(gameMode) {
    const { data, error } = await supabaseClient
        .from('leaderboard')
        .select('name, score, avatar')
        .eq('game_mode', gameMode)
        .order('score', { ascending: false})
        .limit(5);
        
    if (error) {
        throw new Error(`Error fetching leaderboard from Supabase: ${error.message}`);
    } else {
        return data;
    }

}

function getLocalLeaderboard(gameMode) {
    const leaderboardKey = `${gameMode}-leaderboard`;
    return JSON.parse(localStorage.getItem(leaderboardKey)) || [];
}

// Get number ID of current game mode
function getGameMode() {
    if (!inTimerMode) {
        return 0;
    } else if (inTimerMode) {
        return selectedTime;
    }
}

//Event listener
saveScoreButton.addEventListener("click", saveScore);

//Displays leaderboard when window loads
window.onload = displayLeaderboard;

//
// GAME ENTRY POINT
//

// Once the images are loaded, we call the gameLoop and pass the loaded images to it
loadAllImages()
    .then(() => {
        console.log("All images loaded!");
        
        // Page setup
        populateHeader();
        addImageToScoreboard('millet');
        addImageToScoreboard('sunflower');
        setupTimeButton(timeButtons[0], shortGame);
        setupTimeButton(timeButtons[1], medGame);
        setupTimeButton(timeButtons[2], longGame);

        // Start game
        generateInitialSeeb();
        gameLoop(); // Pass loaded images to game loop
    })
    .catch((error) => {
        console.error(error); // Handle errors
    });

function gameLoop() {
    draw(); // Render the frame
}
