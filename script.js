let display = document.getElementById('result');
display.value = '';

function appendNumber(num) {
    display.value += num;
}

function appendOperator(operator) {
    display.value += operator;
}

function clearDisplay() {
    display.value = '';
}

function calculate() {
    try {
        display.value = eval(display.value);
    } catch (error) {
        display.value = '错误';
    }
} 