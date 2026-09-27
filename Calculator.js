// Calculator with simple client-side auth (localStorage)

// --- Auth helpers (localStorage-backed) ---
function loadUsers() {
  const raw = localStorage.getItem('calc_users');
  return raw ? JSON.parse(raw) : {};
}
function saveUsers(users) {
  localStorage.setItem('calc_users', JSON.stringify(users));
}
function setCurrentUser(username) {
  localStorage.setItem('calc_current', username);
}
function getCurrentUser() {
  return localStorage.getItem('calc_current');
}
function clearCurrentUser() {
  localStorage.removeItem('calc_current');
}

// --- Calculator state ---
let display = null;
let currentInput = "";
let previousInput = "";
let operator = null;
let shouldResetDisplay = false;

// --- Calculator UI wiring (scoped to avoid auth controls) ---
function attachCalculatorHandlers() {
  const calcButtons = document.querySelectorAll('.calculator .buttons button');
  calcButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const value = button.dataset.value;
      const action = button.dataset.action;

      if (action === 'clear') {
        clearCalculator();
      } else if (action === 'delete') {
        deleteLastCharacter();
      } else if (action === 'calculate') {
        calculateResult();
      } else if (!isNaN(value) || value === '.') {
        enterNumber(value);
      } else if (['+', '-', '*', '/'].includes(value)) {
        chooseOperator(value);
      } else if (value === '%') {
        calculatePercentage();
      }
    });
  });
}

function enterNumber(number) {
  if (shouldResetDisplay) {
    currentInput = "";
    shouldResetDisplay = false;
  }

  if (number === "." && currentInput.includes(".")) return;
  if (currentInput === "0" && number !== ".") currentInput = "";

  currentInput += number;
  updateDisplay();
}

function chooseOperator(selectedOperator) {
  if (currentInput === "") return;
  if (previousInput !== "") calculateResult();
  previousInput = currentInput;
  operator = selectedOperator;
  shouldResetDisplay = true;
}

function calculateResult() {
  if (previousInput === "" || currentInput === "" || operator === null) return;

  const firstNumber = Number(previousInput);
  const secondNumber = Number(currentInput);
  let result;

  switch (operator) {
    case "+":
      result = firstNumber + secondNumber;
      break;
    case "-":
      result = firstNumber - secondNumber;
      break;
    case "*":
      result = firstNumber * secondNumber;
      break;
    case "/":
      if (secondNumber === 0) {
        display.value = "Cannot divide by 0";
        resetValues();
        return;
      }
      result = firstNumber / secondNumber;
      break;
    default:
      return;
  }

  currentInput = String(result);
  previousInput = "";
  operator = null;
  shouldResetDisplay = true;
  updateDisplay();
}

function calculatePercentage() {
  if (currentInput === "") return;
  currentInput = String(Number(currentInput) / 100);
  updateDisplay();
}

function deleteLastCharacter() {
  if (currentInput === "") return;
  currentInput = currentInput.slice(0, -1);
  updateDisplay();
}

function clearCalculator() {
  resetValues();
  display.value = "0";
}

function resetValues() {
  currentInput = "";
  previousInput = "";
  operator = null;
  shouldResetDisplay = false;
}

function updateDisplay() {
  if (!display) return;
  display.value = currentInput || "0";
}

// --- Auth UI helpers ---
function showCalculatorForUser(username) {
  document.getElementById('auth-container').style.display = 'none';
  document.getElementById('calculator-container').style.display = '';
  document.getElementById('currentUser').textContent = username;
}
function showAuth() {
  document.getElementById('auth-container').style.display = '';
  document.getElementById('calculator-container').style.display = 'none';
}

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
  display = document.getElementById('display');
  attachCalculatorHandlers();

  // Login form wiring
  const loginForm = document.getElementById('loginForm');
  const loginMessage = document.getElementById('authMessage');
  const openSignup = document.getElementById('openSignup');

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const u = document.getElementById('loginUsername').value.trim();
    const p = document.getElementById('loginPassword').value;
    const users = loadUsers();
    if (!users[u] || users[u].password !== p) {
      loginMessage.textContent = 'Invalid username or password';
      return;
    }
    setCurrentUser(u);
    loginMessage.textContent = '';
    showCalculatorForUser(u);
  });

  openSignup.addEventListener('click', () => {
    window.open('signup.html', 'signup', 'width=420,height=420');
  });

  // Logout
  const logoutBtn = document.getElementById('logoutBtn');
  logoutBtn.addEventListener('click', () => {
    clearCurrentUser();
    resetValues();
    updateDisplay();
    showAuth();
  });

  // Auto-show based on stored session
  const existing = getCurrentUser();
  if (existing) showCalculatorForUser(existing);
  else showAuth();
});

