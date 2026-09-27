# Copilot instructions for this repository

This project is a very small static browser calculator. The architecture is intentionally simple: HTML defines the UI, CSS handles visual styling, and JavaScript owns all calculator state and behavior.

## Project structure
- `Calculator.html`: calculator layout and button markup. Buttons use `data-value` for digits/operators and `data-action` for actions like `clear`, `delete`, and `calculate`.
- `Calculator.js`: the source of truth for runtime behavior. State is kept in plain variables: `currentInput`, `previousInput`, `operator`, and `shouldResetDisplay`.
- `Calculator.css`: all visual styling for the calculator shell, display, button groups, and color variants (`.operator`, `.clear`, `.equals`, `.zero`).

## Key patterns
- The app is DOM-driven, not framework-driven. Event listeners are attached directly to each button in `Calculator.js` with `document.querySelectorAll("button")`.
- Input handling is centralized in `enterNumber()`, `chooseOperator()`, `calculateResult()`, `calculatePercentage()`, and `deleteLastCharacter()`.
- The display is updated through `updateDisplay()`, which keeps the UI consistent with the internal state.
- Keep decimal handling logic as a single-dot check: `if (number === "." && currentInput.includes(".")) return;`.
- Division by zero is handled explicitly by setting the display to `"Cannot divide by 0"` and resetting the calculator state.

## Workflow
- There is no build toolchain, package manager, or automated test suite in this repo.
- For local preview, either open `Calculator.html` directly in a browser or serve the folder with a simple static server such as `python3 -m http.server` from the repo root.
- When changing calculator behavior, prefer updating `Calculator.js` first; update `Calculator.html` only for adding or modifying button metadata or structure, and `Calculator.css` only for styling.
- Keep validation simple: use the browser to verify button behavior and display updates after edits.

## Important repo-specific gotcha
- The HTML currently references `style.css` and `script.js`, but the actual files in the workspace are `Calculator.css` and `Calculator.js`. If you rename or move files, keep the script/style references aligned to avoid broken UI logic.
- Avoid introducing frameworks, modules, or build complexity unless the task explicitly requires it.
