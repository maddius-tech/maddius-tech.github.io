import { displayMultiChoiceQ as displayMultiChoiceQ, generateOptions } from "../questionUtils.js";

/*
import { generateMultiChoiceQ, generateOptions } from "../questionUtils.js";

generateMultiChoiceQ();
*/
const runQ1 = (container) => {
    console.log("running q1");
    
    const question = "What's the <strong>opening tag</strong> for a paragraph?";
    const correctAnswer = "<p>";
    const options = generateOptions(correctAnswer, "wrongSymbols");
    displayMultiChoiceQ(container, question, correctAnswer, options);
    
}


export const launchLevel = (container) => {
    console.log('launching html-1');

    runQ1(container);

}