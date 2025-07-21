//Functions for different question types
const displayMultiChoiceQ = (questionData, container, handleAnswer) => {
    //Get elements
    const questionText = container.querySelector("#question-text");
    const optionsContainer = container.querySelector("#options-container");
    
    //Get info from object
    const question = questionData['question'];
    const correctAnswer = questionData['correctAnswer'];
    const mistakes = questionData['mistakes'];
    
    //Display question
    questionText.innerHTML = question;
    
    //Get options, add correct answer if needed & randomize order
    const options = generateOptions(mistakes);
    if (!options.includes(correctAnswer)) {
        options.push(correctAnswer);
    }
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
const wrongSymbols = ({ targetComponents, extraParams }) => {
    const differentSymbols = [
        ['(', ')'],
        ['"', '"'],
        ['{', '}'],
        ['<', '>'],
    ];

    let optionsArray = [];
    differentSymbols.forEach(symbols => {
        let newOption = extraParams;
        //Replace each target component with corresponding new symbols
        for (let i = 0; i < targetComponents.length; i++) {
            newOption = newOption.replace(targetComponents[i], symbols[i]);
        }
        optionsArray.push(newOption);
    });

    return optionsArray;
};

const wrongPlace = ({ targetComponents, extraParams: otherComponents }) => {
    let optionsArray = [];

    //Currently only handles 1 target component
    const targetComponent = targetComponents[0];

    for (let i = 0; i <= otherComponents.length; i++) {
        const newArray = [
            ...otherComponents.slice(0, i),
            targetComponent,
            ...otherComponents.slice(i),
        ];
        const newOption = newArray.join(''); 
        optionsArray.push(newOption);
    };

    //Later: need to handle limiting number of options for long arrays?? If needed.

    return optionsArray;
};

const customMistakes = ({ customMistakes }) => customMistakes;

// Lookup tables
const questionTypes = {
    "multiChoice": displayMultiChoiceQ,
};

const mistakeGenerators = {
    "wrongSymbols": wrongSymbols,
    "wrongPlace": wrongPlace,
    "customArray": customMistakes,

};

//Helpers
function shuffleArray(array) {
    const newArr = [...array]; // Make a shallow copy to avoid modifying original
    for (let i = newArr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArr[i], newArr[j]] = [newArr[j], newArr[i]]; // Swap elements
    }
    return newArr;
};

export const generateOptions = (mistakes) => {
    //Get mistake info
    const { mistakeType } = mistakes;
    const mistakeFn = mistakeGenerators[mistakeType];
    
    if (!mistakeFn) {
        throw new Error(`Unknown mistake type: ${mistakeType}`);
    }

    return mistakeFn(mistakes);
};

export const displayQuestion = (questionData, container, answerCallback) => {
    const questionType = questionData['questionType'];
    const questionFn = questionTypes[questionType];
    
    if (!questionFn) {
        throw new Error(`Unknown question type: ${questionType}`);
    }

    return questionFn(questionData, container, answerCallback);
}

