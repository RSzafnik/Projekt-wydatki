document.addEventListener("DOMContentLoaded", function () {
  const incomeForm = document.getElementById("income-form");
  const expenseForm = document.getElementById("expense-form");
  const incomeList = document.getElementById("income-list");
  const expenseList = document.getElementById("expense-list");
  const availableAmount = document.getElementById("available-amount");
  const totalIncome = document.getElementById("total-income");
  const totalExpense = document.getElementById("total-expense");
  const messageContainer = document.getElementById("message-container");
  let isEditing = false;

  function displayMessage(message, isError = false) {
    messageContainer.innerText = message;
    messageContainer.style.color = isError ? "red" : "green";
  }

  function validateInput(nameInput, valueInput) {
    const name = nameInput.value.trim();
    const value = parseFloat(valueInput.value.trim());
    if (name === "" || /\d/.test(name)) {
      displayMessage("Wprowadź poprawną nazwę!", true);
      return false;
    } else if (isNaN(value) || value < 0.01) {
      displayMessage("Wprowadź poprawną kwotę!", true);
      return false;
    }
    return true;
  }

  function updateSummary() {
    let totalIncomeValue = 0;
    Array.from(incomeList.children).forEach((li) => {
      const valueSpan = li.querySelector(".income-value");
      if (valueSpan) {
        totalIncomeValue += parseFloat(valueSpan.innerText);
      }
    });

    let totalExpenseValue = 0;
    Array.from(expenseList.children).forEach((li) => {
      const valueSpan = li.querySelector(".expense-value");
      if (valueSpan) {
        totalExpenseValue += parseFloat(valueSpan.innerText);
      }
    });

    totalIncome.innerText = totalIncomeValue.toFixed(2);
    totalExpense.innerText = totalExpenseValue.toFixed(2);
    const calculatedAvailableAmount = totalIncomeValue - totalExpenseValue;
    availableAmount.innerText = calculatedAvailableAmount.toFixed(2);

    if (calculatedAvailableAmount < 0) {
      displayMessage(`Jesteś na minusie!`, true);
    } else if (calculatedAvailableAmount > 0) {
      displayMessage(`Jesteś na plusie!`, false);
    } else {
      displayMessage("", false);
    }
  }

  incomeForm.addEventListener("submit", function (event) {
    event.preventDefault();
    if (isEditing) {
      displayMessage("Zakończ edycję przed dodaniem kolejnego elementu", true);
      return;
    }
    const incomeNameInput = document.getElementById("income-name");
    const incomeValueInput = document.getElementById("income-value");
    if (!incomeNameInput.value.trim() || !incomeValueInput.value.trim()) {
      displayMessage("Proszę wypełnić wszystkie pola!", true);
    } else if (validateInput(incomeNameInput, incomeValueInput)) {
      const li = document.createElement("li");
      li.innerHTML = `${
        incomeNameInput.value
      }: <span class="income-value">${parseFloat(
        incomeValueInput.value
      ).toFixed(2)}</span>
                      <button class="edit">Edytuj</button>
                      <button class="delete">Usuń</button>`;
      incomeList.appendChild(li);
      incomeForm.reset();
      updateSummary();
    }
  });

  expenseForm.addEventListener("submit", function (event) {
    event.preventDefault();
    if (isEditing) {
      displayMessage("Zakończ edycję przed dodaniem kolejnego elementu", true);
      return;
    }
    const expenseNameInput = document.getElementById("expense-name");
    const expenseValueInput = document.getElementById("expense-value");
    if (!expenseNameInput.value.trim() || !expenseValueInput.value.trim()) {
      displayMessage("Proszę wypełnić wszystkie pola!", true);
    } else if (validateInput(expenseNameInput, expenseValueInput)) {
      const li = document.createElement("li");
      li.innerHTML = `${
        expenseNameInput.value
      }: <span class="expense-value">${parseFloat(
        expenseValueInput.value
      ).toFixed(2)}</span>
                      <button class="edit">Edytuj</button>
                      <button class="delete">Usuń</button>`;
      expenseList.appendChild(li);
      expenseForm.reset();
      updateSummary();
    }
  });

  document.addEventListener("click", function (event) {
    if (!event.target.closest("ol")) return;
    const isIncomeList = event.target.closest("ol").id === "income-list";
    const isExpenseList = event.target.closest("ol").id === "expense-list";

    if (event.target.classList.contains("delete")) {
      event.target.parentElement.remove();
      updateSummary();
    } else if (event.target.classList.contains("edit")) {
      isEditing = true;
      const li = event.target.parentElement;
      const itemName =
        isIncomeList || isExpenseList
          ? li.childNodes[0].nodeValue.trim().slice(0, -1)
          : "";
      const itemValue = li.querySelector(
        isIncomeList ? ".income-value" : ".expense-value"
      ).innerText;

      li.innerHTML = `<label for="edit-name">Nazwa:</label>
                      <input type="text" id="edit-name" value="${itemName}" class="edit-name" />
                      <label for="edit-value">Kwota:</label>
                      <input type="number" id="edit-value" value="${itemValue}" class="edit-value" />
                      <button class="save">Zapisz</button>
                      <button class="cancel">Anuluj</button>`;
    } else if (event.target.classList.contains("save")) {
      isEditing = false;
      const li = event.target.parentElement;
      const newName = li.querySelector(".edit-name").value;
      const newValue = parseFloat(li.querySelector(".edit-value").value);

      if (!isNaN(newValue) && newValue >= 0) {
        li.innerHTML = `${newName}: <span class="${
          isIncomeList ? "income-value" : "expense-value"
        }">${newValue.toFixed(2)}</span>
                        <button class="edit">Edytuj</button>
                        <button class="delete">Usuń</button>`;
        updateSummary();
      } else {
        displayMessage("Wprowadź poprawną kwotę!", true);
      }
    } else if (event.target.classList.contains("cancel")) {
      isEditing = false;
      const li = event.target.parentElement;
      const originalName = li.querySelector(".edit-name").getAttribute("value");
      const originalValue = li
        .querySelector(".edit-value")
        .getAttribute("value");

      li.innerHTML = `${originalName}: <span class="${
        isIncomeList ? "income-value" : "expense-value"
      }">${originalValue}</span>
                      <button class="edit">Edytuj</button>
                      <button class="delete">Usuń</button>`;
    }
  });
});
