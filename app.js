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
    if (name === "") {
      displayMessage("Nazwa nie może być pusta!", true);
      return false;
    } else if (/\d/.test(name) && !/[a-zA-Z]\d*/.test(name)) {
      displayMessage("Cyfry mogą występować w nazwie tylko po literze!", true);
      return false;
    } else if (isNaN(value) || value <= 0) {
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
    availableAmount.innerText = (totalIncomeValue - totalExpenseValue).toFixed(
      2
    );

    if (availableAmount.innerText < 0) {
      displayMessage(`Jesteś na minusie!`, true);
    } else if (availableAmount.innerText > 0) {
      displayMessage(`Jesteś na plusie!`, false);
    } else {
      displayMessage("", false);
    }
  }

  incomeForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const incomeNameInput = document.getElementById("income-name");
    const incomeValueInput = document.getElementById("income-value");

    if (!isEditing && validateInput(incomeNameInput, incomeValueInput)) {
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
    const expenseNameInput = document.getElementById("expense-name");
    const expenseValueInput = document.getElementById("expense-value");

    if (!isEditing && validateInput(expenseNameInput, expenseValueInput)) {
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
      const itemName = li.childNodes[0].nodeValue.trim().slice(0, -1);
      const itemValue = isIncomeList
        ? li.querySelector(".income-value").innerText
        : li.querySelector(".expense-value").innerText;

      li.dataset.originalName = itemName;
      li.dataset.originalValue = itemValue;

      li.innerHTML = `<label for="edit-name">Nazwa:</label>
                    <input type="text" id="edit-name" value="${itemName}" class="edit-name" />
                    <label for="edit-value">Kwota:</label>
                    <input type="number" id="edit-value" value="${itemValue}" class="edit-value" />
                    <button class="save">Zapisz</button>
                    <button class="cancel">Anuluj</button>`;
    } else if (event.target.classList.contains("save")) {
      const li = event.target.parentElement;
      const newNameInput = li.querySelector(".edit-name");
      const newValueInput = li.querySelector(".edit-value");

      if (validateInput(newNameInput, newValueInput)) {
        const newValue = parseFloat(newValueInput.value);
        li.innerHTML = `${newNameInput.value}: <span class="${
          isIncomeList ? "income-value" : "expense-value"
        }">${newValue.toFixed(2)}</span>
                        <button class="edit">Edytuj</button>
                        <button class="delete">Usuń</button>`;
        updateSummary();
        isEditing = false;
      }
    } else if (event.target.classList.contains("cancel")) {
      isEditing = false;
      const li = event.target.parentElement;

      li.innerHTML = `${li.dataset.originalName}: <span class="${
        isIncomeList ? "income-value" : "expense-value"
      }">${parseFloat(li.dataset.originalValue).toFixed(2)}</span>
                      <button class="edit">Edytuj</button>
                      <button class="delete">Usuń</button>`;
    }
  });
});
