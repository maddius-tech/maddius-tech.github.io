import { getOptions, shuffleArray } from "./optionUtils.js";

//Helper
const createSubmitButton = (parent) => {
    const submitBtn = document.createElement('div');
    submitBtn.id = 'answer-submit';
    submitBtn.classList.add('rounded-box');
    submitBtn.innerHTML = '<p>Go!</p>';

    parent.appendChild(submitBtn);
    return submitBtn;
}

//Functions for different question types
const displayMultiChoiceQ = (questionData, { questionText, optionsContainer }, handleAnswer) => {
    //Change displays
    optionsContainer.classList.value = '';
    optionsContainer.classList.add("options-grid");

    //Get info from object
    const { question, correctAnswer, optionInfo } = questionData;
    
    //Display question
    questionText.innerHTML = question;
    
    //Get options, add correct answer if needed & randomize order
    const options = getOptions(optionInfo);
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
                //Clear content from this question
                questionText.innerHTML = '';
                optionsContainer.innerHTML = '';
            }
            handleAnswer(isCorrect);
        });
        
        //Add to container
        optionsContainer.appendChild(optionDiv);
    });
}

const displayOrderQ = (questionData, elements, handleAnswer) => {
    //Get info from objects
    const { question, correctAnswer, optionInfo } = questionData;
    const { questionText, optionsContainer, answersContainer, answers } = elements;
    
    //Change displays
    answersContainer.classList.remove("hidden");
    optionsContainer.classList.value = '';
    optionsContainer.classList.add("options-row");

    //Create submit button
    const submitBtn = createSubmitButton(answersContainer);
    submitBtn.addEventListener('click', () => {
        //Get answer
        const selectedDivs = Array.from(answers.children); 
        let answer = "";
        selectedDivs.forEach(div => {
            answer += div.textContent;
        });

        //Store whether it is correct
        const isCorrect = answer === correctAnswer;
        if (isCorrect) {
            //Clear content from this question
            questionText.innerHTML = '';
            optionsContainer.innerHTML = '';
            answers.innerHTML = '';
            submitBtn.remove();
        }
        handleAnswer(isCorrect);
    });

    //Display question
    questionText.innerHTML = question;
    
    //Get options & randomize order
    const options = getOptions(optionInfo);
    const shuffledOptions = shuffleArray(options);

    //Displaying options
    shuffledOptions.forEach(option => {
        //Create div for option
        const optionDiv = document.createElement("div");
        optionDiv.classList.add("option-div", "rounded-box");
        optionDiv.textContent = option;

        optionDiv.addEventListener('click', () => {
            if (optionDiv.parentElement.id === "options-container") {
                answers.appendChild(optionDiv);
            } else {
                optionsContainer.appendChild(optionDiv);
            }
        });
        
        //Add to container
        optionsContainer.appendChild(optionDiv);
    });
};

// Lookup table
const questionTypes = {
    "multiChoice": displayMultiChoiceQ,
    "order": displayOrderQ,
};

export const displayQuestion = (questionData, container, answerCallback) => {
    const questionType = questionData['questionType'];
    const questionFn = questionTypes[questionType];
    
    if (!questionFn) {
        throw new Error(`Unknown question type: ${questionType}`);
    }
    
    //Get elements
    const elements = {
        questionText: container.querySelector("#question-text"),
        optionsContainer: container.querySelector("#options-container"),
        answersContainer: container.querySelector("#answers-container"),
        answers: container.querySelector("#answers"),
    };

    return questionFn(questionData, elements, answerCallback);
}