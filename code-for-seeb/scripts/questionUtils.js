//Functions for different question types
const displayMultiChoiceQ = (questionData, container, handleAnswer) => {
    //Get elements
    const questionText = container.querySelector("#question-text");
    const optionsContainer = container.querySelector("#options-container");
    
    //Get info from object
    const question = questionData['question'];
    const correctAnswer = questionData['correctAnswer'];
    const mistakeType = questionData['mistakeType'];
    
    //Display question
    questionText.innerHTML = question;
    
    //Get options, add correct answer & randomize order
    const options = generateOptions(correctAnswer, mistakeType);
    options.push(correctAnswer);
    const shuffledOptions = shuffleArray(options);
    
    //Displaying options
    shuffledOptions.forEach(option => {
        //Create div for option
        const optionDiv = document.createElement("div");
        optionDiv.classList.add("option-div", "rounded-box");
        optionDiv.textContent = option;

        //Store whether it is correct
        const isCorrect = option === correctAnswer;
        optionDiv.addEventListener('click', () => {
            if (isCorrect) {
                questionText.innerHTML = '';
                optionsContainer.innerHTML = '';
            }
            handleAnswer(isCorrect);
        });
        
        //Add to container
        optionsContainer.appendChild(optionDiv);
    });
}

//Mistake generators
const wrongSymbols = (correctAnswer) => {
    const tagName = correctAnswer.replace(/[<>]/g, '');
    return [
        `(${tagName})`,
        `"${tagName}"`,
        `{${tagName}}`
    ];
};

// Lookup tables
const questionTypes = {
    "multiChoice": displayMultiChoiceQ,
};

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

export const displayQuestion = (questionData, container, answerCallback) => {
    const questionType = questionData['questionType'];
    const questionFn = questionTypes[questionType];
    
    if (!questionFn) {
        throw new Error(`Unknown question type: ${questionType}`);
    }

    return questionFn(questionData, container, answerCallback);
}

