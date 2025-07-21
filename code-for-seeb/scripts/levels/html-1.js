export const questions = [
    {
        question: "What's the <strong>opening tag</strong> for a paragraph?",
        correctAnswer: "<p>",
        questionType: 'multiChoice',
        mistakes: {
            mistakeType: 'wrongSymbols', 
            targetComponents: ['<', '>'],
        },
    },
    {
        question: "What's the <strong>opening tag</strong> for a big heading?",
        correctAnswer: "<h1>",
        questionType: 'multiChoice',
        mistakes: {
            mistakeType: 'wrongSymbols', 
            targetComponents: ['<', '>'],
        },
    },
    {
        question: "What's the <strong>opening tag</strong> for a small heading?",
        correctAnswer: "<h3>",
        questionType: 'multiChoice',
        mistakes: {
            mistakeType: 'wrongSymbols', 
            targetComponents: ['<', '>'],
        },
    },
    {
        question: "What's the <strong>closing tag</strong> for a paragraph?",
        correctAnswer: "</p>",
        questionType: 'multiChoice',
        mistakes: {
            mistakeType: 'wrongSymbols', 
            targetComponents: ['<', '>'],
        },
    },
    {
        question: "Which <strong>closing tag</strong> is correct?",
        correctAnswer: "</p>",
        questionType: 'multiChoice',
        mistakes: {
            mistakeType: 'wrongPlace',
            targetComponents: ['/'],
            extraParams: ['<', 'p', '>'],
        },
    },
    {
        question: "Which <strong>closing tag</strong> is correct?",
        correctAnswer: "</h1>",
        questionType: 'multiChoice',
        mistakes: {
            mistakeType: 'wrongPlace',
            targetComponents: ['/'],
            extraParams: ['<', 'h1', '>'],
        },
    },
];