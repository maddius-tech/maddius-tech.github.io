let questions = [];
let showAnswers = false;

const generateRandomNum = (numDigits) => {
    const max = 10 ** numDigits - 1;
    return Math.floor((Math.random() * max) + 1);
}

const generateQuestions = (numQs, numDigits) => {
    const questions = [];

    for (let i=0; i < numQs; i++) {
        const num1 = generateRandomNum(numDigits);
        const num2 = generateRandomNum(numDigits);

        const q = {
            question: `${num1} + ${num2}`,
            ans: `${num1 + num2}`,
        }

        questions.push(q);
    }

    return questions;
}

const displayQuestions = (questions) => {
    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = '';

    questions.forEach((q, index) => {
        const row = document.createElement('tr');
        
        const questionNumCell = document.createElement('td');
        questionNumCell.textContent = index + 1;
        row.appendChild(questionNumCell);

        const questionCell = document.createElement('td');
        questionCell.textContent = q.question;
        row.appendChild(questionCell);

        const answerCell = document.createElement('td');
        answerCell.classList.add('answer-cell');
        answerCell.textContent = '???';
        row.appendChild(answerCell);

        tbody.appendChild(row);
    });
}

const updateAnswers = () => {
    const answerCells = document.querySelectorAll('.answer-cell');

    answerCells.forEach((cell, i) => {
        cell.textContent = showAnswers ? questions[i].ans : "???";
    });

    ansButton.textContent = showAnswers ? 'Hide Answers' : 'Reveal Answers';
};

document.getElementById("goButton").addEventListener('click', () => {
    const numDigits = Number(document.getElementById('numDigits').value);
    const numQs = Number(document.getElementById('numQs').value);

    questions = generateQuestions(numQs, numDigits);

    showAnswers = false;
    displayQuestions(questions);
    updateAnswers();
});

const ansButton = document.getElementById('answersButton');
ansButton.addEventListener('click', () => {
    showAnswers = !showAnswers;
    updateAnswers();
});; 