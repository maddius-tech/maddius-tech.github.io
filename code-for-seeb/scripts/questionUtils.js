
const wrongSymbols = (correctAnswer) => {
    const tagName = correctAnswer.replace(/[<>]/g, '');
    return [
        `(${tagName})`,
        `"${tagName}"`,
        `{${tagName}}`
    ];
};

// Lookup table
const mistakeGenerators = {
    "wrongSymbols": wrongSymbols,
};

//Helper
function shuffleArray(array) {
    const newArr = [...array]; // Make a shallow copy to avoid modifying original
    for (let i = newArr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArr[i], newArr[j]] = [newArr[j], newArr[i]]; // Swap elements
    }
    return newArr;
};

export const generateOptions = (correctAnswer, mistakeType) => {
    const mistakeFn = mistakeGenerators[mistakeType];
    
    if (!mistakeFn) {
        throw new Error(`Unknown mistake type: ${mistakeType}`);
    }
        
    return mistakeFn(correctAnswer);
};

export const displayMultiChoiceQ = (container, question, correctAnswer, options) => {
    //Get elements
    const questionText = container.querySelector("#question-text");
    const optionsContainer = container.querySelector("#options-container");
    
    //Display question
    questionText.innerHTML = question;

    //Add correct answer to options & randomize
    options.push(correctAnswer);
    const shuffledOptions = shuffleArray(options);
    
    shuffledOptions.forEach(option => {
        const optionDiv = document.createElement("div");
        optionDiv.classList.add("option-div", "rounded-box");

        optionDiv.dataset.correct = (option === correctAnswer).toString();

        optionDiv.textContent = option;
        optionsContainer.appendChild(optionDiv);
    });
    
}