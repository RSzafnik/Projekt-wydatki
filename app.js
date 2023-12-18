document.addEventListener("DOMContentLoaded", function () {
  const addButton = document.querySelector("#add-income");
  const incomeList = document.querySelector("#income-list");
  // kwota "available amount będzie się zmieniała - suma zysków i wydatków"
  let availableAmount = document.querySelector("#available-amount");
  let totalIncome = document.querySelector("#total-income");

  //   tutaj jest funkcja do aktualizacji kwoty przychodów  - łapiemy wszystkie elementy z tworzonej listy, aby widzieć sumę przychodów
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

    totalIncome.innerText = totalIncomeValue;
    totalExpense.innerText = totalExpenseValue;
    availableAmount.innerText = totalIncomeValue - totalExpenseValue;

    // tutaj sprawdzimy czy aktualny bilans jest ujemny

    if (availableAmount.innerText == 0) {
      alert("Bilans wynosi zero.");
    }

    // tutaj sprawdzimy, czy bilans jest mniejszy niż 0
    if (availableAmount.innerText < 0) {
      alert(
        `Bilans jest ujemny. Jesteś na minusie ${Math.abs(
          availableAmount.innerText
        )} złotych. Znajdź dodatkowe przychody`
      );
    }
  }

  addButton.addEventListener("click", function () {
    const incomeName = document.querySelector("#income-name").value;
    const incomeValue = document.querySelector("#income-value").value;

    if (!isNaN(incomeValue) && incomeValue >= 0) {
      const li = document.createElement("li");

      li.innerHTML = `${incomeName}: <span class="income-value">${incomeValue}</span>                          
                                      <button class="edit">Edytuj</button>
                                      <button class="delete">Usuń</button>`;
      incomeList.appendChild(li);
      document.querySelector("#income-name").value = "";
      document.querySelector("#income-value").value = "";
      updateSummary();
    } else {
      alert("Wpisz inną kwotę!!!");
    }
  });

  incomeList.addEventListener("click", function (event) {
    if (event.target.classList.contains("delete")) {
      event.target.parentElement.remove();
      updateSummary();
    } else if (event.target.classList.contains("edit")) {
      const li = event.target.parentElement;
      const incomeName = li.childNodes[0].nodeValue.trim().slice(0, -1);
      const incomeValue = li.querySelector(".income-value").innerText;

      li.innerHTML = `Nazwa: <input type="text" value="${incomeName}" class = "edit-name">
                                      Kwota: <input type = "number" value="${incomeValue}" class ="edit-value">
                                      <button class="save"> Zapisz</button>`;
    } else if (event.target.classList.contains("save")) {
      const li = event.target.parentElement;
      const newName = li.querySelector(".edit-name").value;
      const newValue = parseFloat(li.querySelector(".edit-value").value);

      if (!isNaN(newValue) && newValue >= 0) {
        li.innerHTML = `${newName}:     <span class="income-value">${newValue}</span> 
                                        <button class="edit">Edytuj</button>
                                        <button class="delete">Usuń</button>`;
        updateSummary();
      } else {
        alert("Proszę wprowadzić prawidłową kwotę!");
      }
    }
  });

  // tutaj będą wydatki

  const addButton2 = document.querySelector("#add-expense");
  const expenseList = document.querySelector("#expense-list");
  let totalExpense = document.querySelector("#total-expense");

  //   tutaj wpisujemy co chcemy aby stało się po wciśnięciu przycisku "dodaj"
  addButton2.addEventListener("click", function () {
    // console.log("guzik kliknięty!");
    const expenseName = document.querySelector("#expense-name").value;
    const expenseValue = document.querySelector("#expense-value").value;
    // console.log(expenseName, expenseValue);

    // tutaj sprawdzamy co się stanie po wpisaniu danych "nazwy" i "kwoty"
    if (!isNaN(expenseValue) && expenseValue >= 0) {
      const li = document.createElement("li");
      li.innerHTML = `${expenseName}: <span class="expense-value">${expenseValue}</span>
                                          <button class ="edit">Edytuj</button>
                                          <button class ="delete">Usuń</button>`;

      expenseList.appendChild(li);
      //   tutaj będą resetowały się dane w polac "nazwa wydatku" i "kwota" po wcisnięciu przycisku "dodaj"
      document.querySelector("#expense-name").value = "";
      document.querySelector("#expense-value").value = "";
      updateSummary();
    } else {
      alert("Wprowadź inną kwotę!");
    }
  });

  expenseList.addEventListener("click", function (event) {
    if (event.target.classList.contains("delete")) {
      event.target.parentElement.remove();
      updateSummary();
    } else if (event.target.classList.contains("edit")) {
      const li = event.target.parentElement;
      // tutaj tworzymy kolejną tablicę
      const expenseName = li.childNodes[0].nodeValue.trim().slice(0, -1);
      const expenseValue = li.querySelector(".expense-value").innerText;
      // console.log(expenseValue);

      li.innerHTML = `Nazwa: <input type ="text" value="${expenseName}" class="edit-name">
                            Kwota: <input type ="number" value="${expenseValue}" class="edit-value">
                            <button class = "save">Zapisz</button>`;
    } else if (event.target.classList.contains("save")) {
      const li = event.target.parentElement;
      const newName = li.querySelector(".edit-name").value;
      const newValue = parseFloat(li.querySelector(".edit-value").value);

      if (!isNaN(newValue) && newValue >= 0) {
        li.innerHTML = `${newName}: <span class="expense-value">${newValue}</span>
                                          <button class ="edit">Edytuj</button>
                                          <button class ="delete">Usuń</button>`;
        updateSummary();
      } else {
        alert("Wprowadź inną kwotę!!!");
      }
    }
  });
});
