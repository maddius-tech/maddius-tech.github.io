export const questions = [
    /*
    */
    {
        question: "What's the <strong>opening tag</strong> for a paragraph?",
        correctAnswer: "<p>",
        questionType: 'multiChoice',
        optionInfo: {
            optionType: 'wrongSymbols', 
            targetComponents: ['<', '>'],
            extraParams: "<p>",
        },
    },
    {
        question: "What's the <strong>opening tag</strong> for a big heading?",
        correctAnswer: "<h1>",
        questionType: 'multiChoice',
        optionInfo: {
            optionType: 'wrongSymbols', 
            targetComponents: ['<', '>'],
            extraParams: "<h1>",
        },
    },
    {
        question: "What's the <strong>opening tag</strong> for a small heading?",
        correctAnswer: "<h3>",
        questionType: 'multiChoice',
        optionInfo: {
            optionType: 'wrongSymbols', 
            targetComponents: ['<', '>'],
            extraParams: "<h3>",
        },
    },
    {
        question: "What's the <strong>closing tag</strong> for a paragraph?",
        correctAnswer: "</p>",
        questionType: 'multiChoice',
        optionInfo: {
            optionType: 'wrongSymbols', 
            targetComponents: ['<', '>'],
            extraParams: "</p>",
        },
    },
    {
        question: "Which <strong>closing tag</strong> is correct?",
        correctAnswer: "</p>",
        questionType: 'multiChoice',
        optionInfo: {
            optionType: 'wrongPlace',
            targetComponents: ['/'],
            extraParams: ['<', 'p', '>'],
        },
    },
    {
        question: "Which <strong>closing tag</strong> is correct?",
        correctAnswer: "</h1>",
        questionType: 'multiChoice',
        optionInfo: {
            optionType: 'wrongPlace',
            targetComponents: ['/'],
            extraParams: ['<', 'h1', '>'],
        },
    },
    {
        question: "Which makes a <strong>paragraph</strong> saying 'Hello!'?",
        correctAnswer: "<p>Hello!</p>",
        questionType: 'multiChoice',
        optionInfo: {
            optionType: 'customOptions',
            customOptions: [
                '<p Hello! /p>',
                '<p Hello! />',
                'p<Hello!>/p',
            ],
        },
    },
    {
        question: "Put these in the correct order.",
        correctAnswer: "<p>I love muffins.</p>",
        questionType: 'order',
        optionInfo: {
            optionType: 'customOptions',
            customOptions: [
                '<p>',
                'I love muffins.',
                '</p>',
            ],
        },
    },
];