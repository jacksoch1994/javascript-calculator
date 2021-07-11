// Declare Regular Expression for anything that is a digit.
const regEx = /\d/;

//Helper Function Declarations

//Function that tests if all characters in the text field are allowed in an equation. (Only digits, mathematical operators, and parentheses are allowed.)
function hasValidCharacters(str) {
    if (str.split(/[0-9()^+\-/*x]\.?\s*/).join('')) {
        return false;
    } else {
        return true;
    }
}

//Converts the provided string into a list. Each character becomes its own element, with the exception of digits, where concecutive digits are combined into numbers. 
function stringToList(str) {
    let outputList = []
    let splitStr = str.split(' ').reverse();
    for (let element of splitStr) {

        let index = element.length - 1;
        while (element) {

            if (index === 0) {
                outputList.unshift(element);
                element = '';
            } else if (!/[0-9]/.test(element[index]) || !/[0-9]/.test(element[index - 1])) {
                outputList.unshift(element.substring(index));
                element = element.substring(0, index);
            }
            index--;
        }
    }
    return outputList;
}

//Checks to see if the provided list has a syntax that can be evaluated properly. Returns true if the list matches all rules. Returns false otherwise.
function hasValidSyntax(arr) {
    let leftParenthesesCount = 0;
    let rightParenthesesCount = 0;
    const regEx = /[0-9]/;

    //Preliminary Test: If the first element is anything besides a number, decimal, left parenthesis, or a negative symbol (-), the syntax is invalid. 
    if (!/[0-9(\-.]/.test(arr[0])) {
        return false;
    }

    for (let i = 0; i < arr.length; i++) {

        if (arr[i] === '(') {
            leftParenthesesCount++;
            //If the left parenthesis is at the last index, or the next value is a right parenthesis (nothing inside the parentheses) or operator, or the character immediately
            //to the left of the parenthesis is a number or right parentheses, the syntax is invalid. 
            if (i === arr.length - 1 || /[)+/*^x]/.test(arr[i + 1]) || (i !== 0 && /[0-9)]/.test(arr[i - 1])) ) {
                return false;
            } 
        }

        if (arr[i] === ')') {
            rightParenthesesCount++;
            //If there are ever more right parentheses than left, this means there are open parentheses in the equation. Therefore syntax is invalid.
            //Additionally, if there is a number directly to the right of the right parenthesis, the syntax is invalid.
            if (rightParenthesesCount > leftParenthesesCount || (i !== arr.length - 1 && /[0-9.]/.test(arr[i + 1])) || (i > 0 && !/[0-9).]/.test(arr[i - 1]))) {
                return false;
            }
        }

        if (!/[0-9().]/.test(arr[i])) {
            //If there are three operators in a row, the syntax is invalid. 
            if (i <= arr.length - 3 && !/[0-9().]/.test(arr[i + 1]) && !/[0-9().]/.test(arr[i + 2])) {
                return false;
            }
            //If there are two operators in a row, and the second operator is not a negative sign (-), the syntax is invalid.
            if (i <= arr.length - 2 && !/[0-9().\-]/.test(arr[i + 1])) {
                return false;
            }
        }

        //If the last element is either a number, decimal, or a right parenthesis, AND the parentheses counts match, return true. If the array ends in anything else, the syntax is invalid.
        if (i === arr.length - 1 && (/[0-9.]/.test(arr[i]) || arr[i] === ')') && (leftParenthesesCount === rightParenthesesCount)) {
            return true;
        } else if (i === arr.length) {
            return false;
        }

        
        //If there are two numbers in a row, the syntax is invalid. 
        if (i <= arr.length - 2 && regEx.test(arr[i]) && regEx.test(arr[i + 1])) {
            return false;
        }
        
        if (arr[i] === '.') {
            //If decimal does not have at least one number on either side, the syntax is invalid.
            if ( !( (i > 0 && regEx.test(arr[i - 1])) || (i < arr.length - 1 && regEx.test(arr[i + 1]) ) ) ) {
                return false;
            }
            //If the "number" would end up having two decimals, then the syntax is invalid.
            if (i < arr.length - 2 && regEx.test(arr[i + 1]) && arr[i + 2] === '.') {
                return false;
            }
        }

    }
}

//Function that takes an operator and two numbers, and returns the solution.
function performOperation(num1, num2, operator) {
    switch (operator) {
        case '+':
            return num1 + num2;
        case '-':
            return num1 - num2;
        case '/':
            return num1 / num2;
        case 'x':
            return num1 * num2;
        case '*':
            return num1 * num2;
        case '^':
            return num1 ** num2;
        default:
            return undefined;
    }
}

//Function that evaluates the provided list. Returns a value.
function evaluateEquation(arr) {
    let parenthesesEvaluated = false;

    //Loop to evaluate all parentheses within the equation before performing mathematical operations on the rest of the equation. 
    //Recursively calls the function once the inner most pair is met. Process continues until there are no more parentheses left in the equation.
    while (!parenthesesEvaluated) {
        let leftParenthesisIndex = -1;
        for (let i = 0; i < arr.length; i++) {
                        
            if (arr[i] === '(') {
                leftParenthesisIndex = i;
                
            } else if (arr[i] === ')') {
                arr = arr.slice(0, leftParenthesisIndex).concat(evaluateEquation(arr.slice(leftParenthesisIndex + 1, i))).concat(arr.slice(i + 1));
                break;
            } else if (i === arr.length - 1) {
                parenthesesEvaluated = true;
            }

        }

        //Finds each decimal point in the equation and combines it into a string with surrounding strings containing digits.
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] === '.') {

                if (i > 0 && i < arr.length - 1 && regEx.test(arr[i - 1]) && regEx.test(arr[i + 1])) {
                    arr.splice(i - 1, 3, arr[i - 1] + arr[i] + arr[i + 1]);
                } else if (i > 0 && regEx.test(arr[i - 1])) {
                    arr.splice(i - 1 , 2, arr[i - 1] + arr[i]);
                } else if (i < arr.length - 1 && regEx.test(arr[i + 1])) {
                    arr.splice(i, 2, arr[i] + arr[i + 1]);
                }

            }
        }

        //Finds every string in the list that consists of only digits and a decimal point, and converts the element to the Number data type.
        for (let i = 0; i < arr.length; i++) {
            
            if (/[0-9]\.?/.test(arr[i])) {
                arr[i] = Number(arr[i]);
            }
        }

        //For each negative sign (-), if there is a preceding operator, multiplies the following Number by -1, and replaces the negative sign.
        for (let i = 0; i < arr.length; i++) {
            if (i === 0 && arr[i] === '-') {
                arr.splice(0, 2, arr[i + 1] * -1)
            } else if (arr[i] === '-' && /[+\-*^x/]/.test(arr[i - 1])) {
                arr.splice(i, 2, arr[i + 1] * -1)
            }
        }

        console.log(arr);

        //Evaluate each grouping of two Numbers and Operators.
        let loopCount = 1;
        while (arr.length > 1) {
            
            //Loops through equation 5 times to evaluate operators in the order of operations.
            for (let i = 0; i < arr.length; i++) {
                if (loopCount === 1 && arr[i] === '^') {
                    arr.splice(i - 1, 3, performOperation(arr[i + 1], arr[i - 1], arr[i]));
                } else if (loopCount === 2 && arr[i] === 'x' || arr[i] === '*') {
                    arr.splice(i - 1, 3, performOperation(arr[i + 1], arr[i - 1], arr[i]));
                } else if (loopCount === 3 && arr[i] === '/') {
                    arr.splice(i - 1, 3, performOperation(arr[i + 1], arr[i - 1], arr[i]));
                } else if (loopCount === 4 && arr[i] === '+') {
                    arr.splice(i - 1, 3, performOperation(arr[i + 1], arr[i - 1], arr[i]));
                } else if (loopCount === 5 && arr[i] === '-') {
                    arr.splice(i - 1, 3, performOperation(arr[i + 1], arr[i - 1], arr[i]));
                }
                
            }
            loopCount++;
        }
        

    }

    return arr[0];
}

//Get Text Field "Screen"

let screen = document.getElementById("screen");

//Button Functionality

document.getElementById('one').onclick = () => {
    screen.value += '1';
    console.log(screen.value);
}

document.getElementById('two').onclick = () => {
    screen.value += '2';
    console.log(screen.value);
}

document.getElementById('three').onclick = () => {
    screen.value += '3';
    console.log(screen.value);
}

document.getElementById('four').onclick = () => {
    screen.value += '4';
    console.log(screen.value);
}

document.getElementById('five').onclick = () => {
    screen.value += '5';
    console.log(screen.value);
}

document.getElementById('six').onclick = () => {
    screen.value += '6';
    console.log(screen.value);
}

document.getElementById('seven').onclick = () => {
    screen.value += '7';
    console.log(screen.value);
}

document.getElementById('eight').onclick = () => {
    screen.value += '8';
    console.log(screen.value);
}

document.getElementById('nine').onclick = () => {
    screen.value += '9';
    console.log(screen.value);
}

document.getElementById('zero').onclick = () => {
    screen.value += '0';
    console.log(screen.value);
}

document.getElementById('add').onclick = () => {
    screen.value += '+';
    console.log(screen.value);
}

document.getElementById('subtract').onclick = () => {
    screen.value += '-';
    console.log(screen.value);
}

document.getElementById('multiply').onclick = () => {
    screen.value += 'x';
    console.log(screen.value);
}

document.getElementById('divide').onclick = () => {
    screen.value += '/';
    console.log(screen.value);
}

document.getElementById('decimal').onclick = () => {
    screen.value += '.';
    console.log(screen.value);
}

document.getElementById('carrot').onclick = () => {
    screen.value += '^';
    console.log(screen.value);
}

document.getElementById('left-parenthesis').onclick = () => {
    screen.value += '(';
    console.log(screen.value);
}

document.getElementById('right-parenthesis').onclick = () => {
    screen.value += ')';
    console.log(screen.value);
}

document.getElementById('equals').onclick = () => {
    let equation = screen.value;
    if (hasValidCharacters(equation)) {
        equation = stringToList(equation);
        if (hasValidSyntax(equation)) {
            screen.value = evaluateEquation(equation);
        } else {
            console.log('Invalid Syntax');
            alert('Invalid Syntax');
        }
    } else {
        console.log('Invalid Characters');
        alert('Invalid Characters');
    }
}

document.getElementById('all-clear').onclick = () => {
    screen.value = '';
}
