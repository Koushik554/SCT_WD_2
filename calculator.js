class Calculator {
    constructor() {
        this.display = '0';
        this.previousValue = null;
        this.operation = null;
        this.startNewNumber = false;
        this.error = false;
        
        this.mainDisplayEl = document.getElementById('mainDisplay');
        this.calculationDisplayEl = document.getElementById('calculationDisplay');
        
        this.initKeyboardListener();
        this.updateDisplay();
    }

    // Initialize keyboard event listeners
    initKeyboardListener() {
        document.addEventListener('keydown', (e) => {
            // Prevent default for calculator keys
            if (/^[0-9.+\-*/=]$/.test(e.key) || e.key === 'Enter' || e.key === 'Escape') {
                e.preventDefault();
            }

            // Number keys
            if (/^[0-9]$/.test(e.key)) {
                this.inputNumber(e.key);
            }
            // Decimal point
            else if (e.key === '.') {
                this.inputDecimal();
            }
            // Operations
            else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
                this.setOperation(e.key);
            }
            // Equals
            else if (e.key === '=' || e.key === 'Enter') {
                this.equals();
            }
            // Clear
            else if (e.key === 'Escape' || e.key.toLowerCase() === 'c') {
                this.clear();
            }
            // Backspace
            else if (e.key === 'Backspace') {
                this.backspace();
            }
        });
    }

    // Update display elements
    updateDisplay() {
        this.mainDisplayEl.textContent = this.display;
        
        if (this.previousValue !== null && this.operation) {
            const opSymbol = this.operation === '*' ? '×' : this.operation === '/' ? '÷' : this.operation;
            this.calculationDisplayEl.textContent = `${this.previousValue} ${opSymbol}`;
        } else {
            this.calculationDisplayEl.textContent = '';
        }
    }

    // Handle backspace
    backspace() {
        if (this.error) {
            this.clear();
            return;
        }
        if (this.display.length > 1) {
            this.display = this.display.slice(0, -1);
        } else {
            this.display = '0';
        }
        this.updateDisplay();
    }

    // Handle number input
    inputNumber(num) {
        if (this.error) {
            this.clear();
        }

        // Input parsing: prevent multiple leading zeros
        if (this.display === '0' && num === '0') return;

        if (this.startNewNumber) {
            this.display = num;
            this.startNewNumber = false;
        } else {
            // Limit display length to prevent overflow
            if (this.display.length < 12) {
                this.display = this.display === '0' ? num : this.display + num;
            }
        }
        this.updateDisplay();
    }

    // Handle decimal point
    inputDecimal() {
        if (this.error) {
            this.clear();
        }

        if (this.startNewNumber) {
            this.display = '0.';
            this.startNewNumber = false;
        } else if (!this.display.includes('.')) {
            this.display = this.display + '.';
        }
        this.updateDisplay();
    }

    // Set operation
    setOperation(op) {
        if (this.error) {
            this.clear();
            return;
        }

        // Input parsing: validate current display value
        const currentValue = parseFloat(this.display);
        if (isNaN(currentValue)) {
            this.showError();
            return;
        }

        if (this.previousValue === null) {
            this.previousValue = currentValue;
        } else if (this.operation) {
            const result = this.calculate(this.previousValue, currentValue, this.operation);
            if (result === null) return; // Error occurred
            this.display = String(result);
            this.previousValue = result;
        }

        this.operation = op;
        this.startNewNumber = true;
        this.updateDisplay();
    }

    // Perform calculation
    calculate(prev, current, op) {
        let result;

        switch (op) {
            case '+':
                result = prev + current;
                break;
            case '-':
                result = prev - current;
                break;
            case '*':
                result = prev * current;
                break;
            case '/':
                // Error handling: division by zero
                if (current === 0) {
                    this.showError();
                    return null;
                }
                result = prev / current;
                break;
            default:
                return current;
        }

        // Handle overflow and precision
        if (!isFinite(result)) {
            this.showError();
            return null;
        }

        // Round to prevent floating point errors
        return Math.round(result * 100000000) / 100000000;
    }

    // Handle equals button
    equals() {
        if (this.error) {
            this.clear();
            return;
        }

        if (this.operation && this.previousValue !== null) {
            // Input parsing: validate current display value
            const currentValue = parseFloat(this.display);
            if (isNaN(currentValue)) {
                this.showError();
                return;
            }

            const result = this.calculate(this.previousValue, currentValue, this.operation);
            if (result !== null) {
                this.display = String(result);
                this.previousValue = null;
                this.operation = null;
                this.startNewNumber = true;
                this.updateDisplay();
            }
        }
    }

    // Clear calculator
    clear() {
        this.display = '0';
        this.previousValue = null;
        this.operation = null;
        this.startNewNumber = false;
        this.error = false;
        this.updateDisplay();
    }

    // Toggle sign
    toggleSign() {
        if (this.error) {
            this.clear();
            return;
        }
        const value = parseFloat(this.display);
        if (!isNaN(value)) {
            this.display = String(value * -1);
            this.updateDisplay();
        }
    }

    // Calculate percentage
    percentage() {
        if (this.error) {
            this.clear();
            return;
        }
        const value = parseFloat(this.display);
        if (!isNaN(value)) {
            this.display = String(value / 100);
            this.updateDisplay();
        }
    }

    // Show error
    showError() {
        this.error = true;
        this.display = 'Error';
        this.previousValue = null;
        this.operation = null;
        this.startNewNumber = false;
        this.updateDisplay();
    }
}

// Initialize calculator when DOM is loaded
let calculator;
document.addEventListener('DOMContentLoaded', () => {
    calculator = new Calculator();
});
