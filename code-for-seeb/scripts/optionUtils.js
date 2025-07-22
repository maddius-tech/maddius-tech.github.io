
//Option generators
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

const customOptions = ({ customOptions }) => customOptions;

// Lookup table
const optionGenerators = {
    "wrongSymbols": wrongSymbols,
    "wrongPlace": wrongPlace,
    "customOptions": customOptions,
};

//Helpers
export const shuffleArray = (array) => {
    const newArr = [...array]; // Make a shallow copy to avoid modifying original
    for (let i = newArr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArr[i], newArr[j]] = [newArr[j], newArr[i]]; // Swap elements
    }
    return newArr;
};

export const getOptions = (optionInfo) => {
    //Get option info
    const { optionType } = optionInfo;
    const optionFn = optionGenerators[optionType];
    
    if (!optionFn) {
        throw new Error(`Unknown option type: ${optionType}`);
    }

    return optionFn(optionInfo);
};
