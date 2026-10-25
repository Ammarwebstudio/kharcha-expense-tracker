const MAX_AMOUNT = 99999999;
// Form
const expenseForm = document.getElementById("expense-form");
const expenseNameInput = document.getElementById("expense-name");
const expenseAmountInput = document.getElementById("expense-amount");
const expenseCategoryInput = document.getElementById("expense-category");

// List / Render related
const expenseList = document.getElementById("expense-list");
const emptyState = document.getElementById("empty-state");
const noResults = document.getElementById("no-results-state");

// Summary
const totalExpensesEl = document.getElementById("total-amount");
const transactionCountEl = document.getElementById("transaction-count");

// Search And Filter
const searchInput = document.getElementById("search-input");
const filterCategory = document.querySelector("#filter-category");
const clearFilterBtn = document.querySelector("#clear-filters");

// Edit Modal Related
const editModal = document.querySelector("#edit-modal");
const closeModalBtn = document.querySelector("#close-modal-btn");
const editForm = document.getElementById("edit-form");
const editNameInput = document.getElementById("edit-name");
const editAmountInput = document.getElementById("edit-amount");
const editCategoryInput = document.getElementById("edit-category");
const cancelModalBtn = document.querySelector("#cancel-modal-btn");

//Ledger Bar
const resultCount = document.querySelector("#results-count");

// History
const historyBtn = document.querySelector("#history-btn");
const historyModal = document.querySelector("#history-modal");
const historyCloseBtn = document.querySelector("[data-history-close]");
const delHistoryList = document.querySelector("#deleted-history-list");
const historyEmptyState = document.querySelector("#history-empty");
const clearHistoryBtn = document.querySelector("#clear-history-btn");

// Clear All
const confirmModal = document.querySelector("#confirm-modal");
const clearAllBtn = document.getElementById("clear-all-btn");
const confirmText = document.getElementById("confirm-text");
const confirmCancelBtn = document.getElementById("confirm-cancel-btn");
const confirmOkBtn = document.getElementById("confirm-ok-btn");

// Theme Toggle
const themeToggleBtn = document.querySelector("#theme-toggle");

// Event Listeners
expenseForm.addEventListener("submit", addExpense);
expenseList.addEventListener("click", handleExpenseAction);
editForm.addEventListener("submit", updateExpense);
expenseNameInput.addEventListener("input", clearError);
expenseAmountInput.addEventListener("input", clearError);
expenseCategoryInput.addEventListener("change", clearError);
editNameInput.addEventListener("input", clearEditError);
editAmountInput.addEventListener("input", clearEditError);
confirmCancelBtn.addEventListener("click", closeModals);

// Data
let expenses = [];

// Deleted Expenses For History
let deletedExpenses = [];

function generateId() {
  if (expenses.length > 0) {
    const maxId = Math.max(...expenses.map((expense) => expense.id));

    return maxId + 1;
  } else {
    return 1;
  }
}

// Handle Expense Action
function handleExpenseAction(event) {
  const btn = event.target.closest(".icon-btn");
  if (!btn) {
    return;
  }

  if (btn.dataset.action === "edit") {
    editExpense(event);
  } else if (btn.dataset.action === "delete") {
    delExpense(event);
  }
}

// Clear error
function clearError() {
  if (expenseNameInput.value.trim() !== "") {
    const nameError =
      expenseNameInput.parentElement.querySelector(".field__error");

    if (nameError) {
      nameError.hidden = true;
      expenseNameInput.parentElement.classList.remove("has-error");
    }
  }

  if (Number(expenseAmountInput.value) > 0) {
    const amountError =
      expenseAmountInput.parentElement.parentElement.querySelector(
        ".field__error",
      );

    if (amountError) {
      amountError.hidden = true;
      expenseAmountInput.parentElement.parentElement.classList.remove(
        "has-error",
      );
    }
  }

  if (expenseCategoryInput.value !== "") {
    const categoryError =
      expenseCategoryInput.parentElement.querySelector(".field__error");

    if (categoryError) {
      categoryError.hidden = true;
      expenseCategoryInput.parentElement.classList.remove("has-error");
    }
  }
}

// Add Expense
function addExpense(event) {
  event.preventDefault();

  const expenseName = expenseNameInput.value.trim();
  const expenseAmount = Number(expenseAmountInput.value);
  const expenseCategory = expenseCategoryInput.value;
  const id = generateId();

  if (
    expenseName === "" ||
    expenseAmount <= 0 ||
    expenseAmount > MAX_AMOUNT ||
    expenseCategory === ""
  ) {
    if (expenseName === "") {
      const nameError =
        expenseNameInput.parentElement.querySelector(".field__error");
      if (nameError) {
        nameError.removeAttribute("hidden");
        expenseNameInput.parentElement.classList.add("has-error");
      }
    }

    if (expenseAmount <= 0 || expenseAmount > MAX_AMOUNT) {
      const amountError =
        expenseAmountInput.parentElement.parentElement.querySelector(
          ".field__error",
        );

      if (amountError) {
        amountError.removeAttribute("hidden");
        expenseAmountInput.parentElement.parentElement.classList.add(
          "has-error",
        );
      }
    }

    if (expenseCategory === "") {
      const catError =
        expenseCategoryInput.parentElement.querySelector(".field__error");
      if (catError) {
        catError.removeAttribute("hidden");
        expenseCategoryInput.parentElement.classList.add("has-error");
      }
    }
    return;
  } else {
    let expense = {
      id: id,
      title: expenseName,
      amount: expenseAmount,
      category: expenseCategory,
    };

    expenses.push(expense);
    saveData(expenses);

    const hasActiveFilters =
      searchInput.value.trim() !== "" || filterCategory.value !== "all";

    if (hasActiveFilters) {
      applyFilters();
    } else {
      renderExpense(expense);
    }
    expenseForm.reset();
  }
}

// Update Summary
function updateSummary(array) {
  const totalExpenseAmount = array.reduce((total, expense) => {
    return total + expense.amount;
  }, 0);

  totalExpensesEl.textContent = totalExpenseAmount.toLocaleString("en-PK");
  transactionCountEl.textContent = expenses.length;
  resultCount.textContent = `${expenses.length} entries`;
}

// Animate Total Expenses on initial page load
function animateTotalAmount(endValue, duration = 1000) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    totalExpensesEl.textContent = endValue.toLocaleString("en-PK");
    return;
  }

  const startValue = 0;
  let startTime = null;

  totalExpensesEl.textContent = "0";

  function updateNumber(currentTime) {
    if (startTime === null) {
      startTime = currentTime;
    }

    const elapsedTime = currentTime - startTime;

    // Animation progress from 0 to 1
    const progress = Math.min(elapsedTime / duration, 1);

    // Easing for a smooth start and end
    const easedProgress = 1 - Math.pow(1 - progress, 3);

    const currentValue = startValue + (endValue - startValue) * easedProgress;

    totalExpensesEl.textContent =
      Math.round(currentValue).toLocaleString("en-PK");

    if (progress < 1) {
      requestAnimationFrame(updateNumber);
    } else {
      totalExpensesEl.textContent = endValue.toLocaleString("en-PK");
    }
  }

  requestAnimationFrame(updateNumber);
}

// Update Empty State
function updateEmptyState() {
  document.getElementById("ledger-foot").hidden = expenses.length === 0;
  if (expenses.length === 0) {
    emptyState.hidden = false;
  } else {
    emptyState.hidden = true;
  }
}

// Render Expense
function renderExpense(expense) {
  expenseList.insertAdjacentHTML(
    "beforeend",
    `
           <li
              class="expense"
              data-id="${expense.id}"
              data-category="${expense.category}"
              style="--i: 0"
            >
              <span class="expense__icon" aria-hidden="true">${categoryEmoji[expense.category]}</span>
              <h3 class="expense__name"></h3>
              <span class="chip">${expense.category}</span>
              <p class="expense__amount">
                <span class="currency">Rs</span>${expense.amount.toLocaleString("en-PK")}
              </p>
              <div class="expense__actions">
                <button
                  class="icon-btn"
                  type="button"
                  data-action="edit"
                  title="Edit"
                  aria-label="Edit expense"
                >
                  <svg class="i" aria-hidden="true"><use href="#i-edit" /></svg>
                </button>
                <button
                  class="icon-btn icon-btn--delete"
                  type="button"
                  data-action="delete"
                  title="Delete"
                  aria-label="Delete expense"
                >
                  <svg class="i" aria-hidden="true">
                    <use href="#i-trash" />
                  </svg>
                </button>
              </div>
            </li>
`,
  );
  expenseList.lastElementChild.querySelector(".expense__name").textContent =
    expense.title;
  updateSummary(expenses);
  updateEmptyState();
  noResults.hidden = true;
  updateSpendingCategoryUI(calculateCategoryTotals());
}

// Render All Expense
const categoryEmoji = {
  food: "🍔",
  transport: "🚗",
  shopping: "🛍️",
  bills: "💡",
  health: "💊",
  entertainment: "🎬",
  education: "📚",
  other: "📦",
};
expenses = loadSaveData();
function renderAllExpenses(array) {
  expenseList.innerHTML = "";

  array.forEach((expense) => {
    expenseList.innerHTML += `
    <li
              class="expense"
              data-id="${expense.id}"
              data-category="${expense.category}"
              style="--i: 0"
            >
              <span class="expense__icon" aria-hidden="true">${categoryEmoji[expense.category]}</span>
              <h3 class="expense__name"></h3>
              <span class="chip">${expense.category}</span>
              <p class="expense__amount">
                <span class="currency">Rs</span>${expense.amount.toLocaleString("en-PK")}
              </p>
              <div class="expense__actions">
                <button
                  class="icon-btn"
                  type="button"
                  data-action="edit"
                  title="Edit"
                  aria-label="Edit expense"
                >
                  <svg class="i" aria-hidden="true"><use href="#i-edit" /></svg>
                </button>
                <button
                  class="icon-btn icon-btn--delete"
                  type="button"
                  data-action="delete"
                  title="Delete"
                  aria-label="Delete expense"
                >
                  <svg class="i" aria-hidden="true">
                    <use href="#i-trash" />
                  </svg>
                </button>
              </div>
            </li>
    `;
    expenseList.lastElementChild.querySelector(".expense__name").textContent =
      expense.title;
  });

  updateSummary(expenses);
  updateEmptyState();
  updateSpendingCategoryUI(calculateCategoryTotals());
}
renderAllExpenses(expenses);
const initialTotal = expenses.reduce((total, expense) => {
  return total + expense.amount;
}, 0);

animateTotalAmount(initialTotal);

// Delete Expense
function delExpense(event) {
  const clickedExpense = event.target.closest(".expense");
  const clickedExpenseId = Number(clickedExpense.dataset.id);
  clickedExpense.classList.add("is-removing");
  let targetExpense = expenses.find(
    (expense) => expense.id === clickedExpenseId,
  );
  if (targetExpense) {
    deletedExpenses.push({
      ...targetExpense,
      deletedOn: new Date().toLocaleDateString(),
    });
  }
  updateHistoryEmptyState();
  saveHistoryData(deletedExpenses);

  clickedExpense.addEventListener("animationend", function () {
    expenses = expenses.filter((expense) => {
      return expense.id !== clickedExpenseId;
    });

    clickedExpense.remove();

    updateSummary(expenses);
    updateEmptyState();

    noResults.hidden = expenseList.children.length > 0 || expenses.length === 0;

    renderDeletedExpenses();
    updateSpendingCategoryUI(calculateCategoryTotals());
    saveData(expenses);
  });
}
// editing expense id
let editingExpenseId = null;

// Edit Expense
function editExpense(event) {
  editModal.classList.add("is-open");
  editNameInput.focus();
  const nameError = editNameInput.parentElement.querySelector(".field__error");
  if (nameError) {
    nameError.hidden = true;
    editNameInput.parentElement.classList.remove("has-error");
  }
  const amountError =
    editAmountInput.parentElement.parentElement.querySelector(".field__error");
  if (amountError) {
    amountError.hidden = true;
    editAmountInput.parentElement.parentElement.classList.remove("has-error");
  }

  const clickedExpense = event.target.closest(".expense");
  editingExpenseId = Number(clickedExpense.dataset.id);

  const expenseToEdit = expenses.find((expense) => {
    return expense.id === editingExpenseId;
  });

  editNameInput.value = expenseToEdit.title;
  editAmountInput.value = expenseToEdit.amount;
  editCategoryInput.value = expenseToEdit.category;
}

// Edit Error
function clearEditError() {
  if (editNameInput.value.trim() !== "") {
    const nameError =
      editNameInput.parentElement.querySelector(".field__error");
    if (nameError) {
      nameError.hidden = true;
      editNameInput.parentElement.classList.remove("has-error");
    }
  }

  if (Number(editAmountInput.value) > 0) {
    const amountError =
      editAmountInput.parentElement.parentElement.querySelector(
        ".field__error",
      );
    if (amountError) {
      amountError.hidden = true;
      editAmountInput.parentElement.parentElement.classList.remove("has-error");
    }
  }
}

// Modal close handlers
function closeModals() {
  confirmModal.classList.remove("is-open");
  editModal.classList.remove("is-open");
  historyModal.classList.remove("is-open");
}
document
  .querySelectorAll(".modal__backdrop")
  .forEach((b) => b.addEventListener("click", closeModals));
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModals();
});
closeModalBtn.addEventListener("click", closeModals);
cancelModalBtn.addEventListener("click", closeModals);

// Update Expense
function updateExpense(event) {
  event.preventDefault();

  const updatedName = editNameInput.value.trim();
  const updatedAmount = Number(editAmountInput.value);
  const updatedCategory = editCategoryInput.value;
  if (updatedName === "" || updatedAmount <= 0 || updatedAmount > MAX_AMOUNT) {
    if (updatedName === "") {
      const nameError =
        editNameInput.parentElement.querySelector(".field__error");
      if (nameError) {
        nameError.removeAttribute("hidden");
        editNameInput.parentElement.classList.add("has-error");
      }
    }

    if (updatedAmount <= 0 || updatedAmount > MAX_AMOUNT) {
      const amountError =
        editAmountInput.parentElement.parentElement.querySelector(
          ".field__error",
        );

      if (amountError) {
        amountError.removeAttribute("hidden");
        editAmountInput.parentElement.parentElement.classList.add("has-error");
      }
    }
    return;
  } else {
    const expenseToUpdate = expenses.find((expense) => {
      return expense.id === editingExpenseId;
    });

    expenseToUpdate.title = updatedName;
    expenseToUpdate.amount = Number(updatedAmount);
    expenseToUpdate.category = updatedCategory;

    editModal.classList.remove("is-open");

    const expenseElement = expenseList.querySelector(
      `[data-id="${editingExpenseId}"]`,
    );
    const expenseIcon = expenseElement.querySelector(".expense__icon");

    expenseIcon.textContent = categoryEmoji[updatedCategory];
    expenseElement.querySelector("h3").textContent = updatedName;
    expenseElement.querySelector(".chip").textContent = updatedCategory;
    expenseElement.dataset.category = updatedCategory;
    expenseElement.querySelector(".expense__amount").innerHTML = `
  <span class="currency">Rs</span>${updatedAmount.toLocaleString("en-PK")}
     `;

    updateSummary(expenses);
    updateSpendingCategoryUI(calculateCategoryTotals());
    saveData(expenses);
  }
}

// Filter expense through search and category
function applyFilters() {
  const searchTerm = searchInput.value.trim().toLowerCase();
  const categoryValue = filterCategory.value;

  const filteredExpenses = expenses.filter((expense) => {
    const matchesSearch = expense.title.toLowerCase().includes(searchTerm);
    const matchesCategory =
      categoryValue === "all" || expense.category === categoryValue;

    return matchesSearch && matchesCategory;
  });

  renderAllExpenses(filteredExpenses);
  noResults.hidden = filteredExpenses.length > 0 || expenses.length === 0;
}

searchInput.addEventListener("input", applyFilters);
filterCategory.addEventListener("change", applyFilters);

// Clear Filter Button

clearFilterBtn.addEventListener("click", () => {
  filterCategory.value = "all";
  searchInput.value = "";
  noResults.hidden = true;
  applyFilters();
});

// Spending By Category
function calculateCategoryTotals() {
  const categoryTotal = expenses.reduce((total, expense) => {
    if (total[expense.category] === undefined) {
      total[expense.category] = 0;
    }
    total[expense.category] += expense.amount;
    return total;
  }, {});
  return categoryTotal;
}

function updateSpendingCategoryUI(calculateCategoryTotals) {
  const categoryListLi = document.querySelectorAll(".breakdown__item");
  const grandTotal = Object.values(calculateCategoryTotals).reduce(
    (total, num) => total + num,
    0,
  );

  categoryListLi.forEach((li) => {
    const categoryName = li.dataset.category;
    const categoryTotal = calculateCategoryTotals[categoryName] || 0;
    const percentage =
      categoryTotal > 0 ? Math.round((categoryTotal / grandTotal) * 100) : 0;

    const amountSpan = li.querySelector(".breakdown__amount");
    const pctSpan = li.querySelector(".breakdown__pct");
    const barFill = li.querySelector(".bar__fill");

    if (amountSpan) {
      amountSpan.innerHTML = `<span class="currency">Rs</span>${categoryTotal.toLocaleString("en-PK")}`;
    }

    if (pctSpan) {
      pctSpan.innerText = `${percentage}%`;
    }

    if (barFill) {
      barFill.style.setProperty("--pct", `${percentage}%`);
    }
  });
}
updateSpendingCategoryUI(calculateCategoryTotals());

// Local Storage

function saveData(expensesArray) {
  localStorage.setItem("myExpenses", JSON.stringify(expensesArray));
}

function loadSaveData() {
  const data = localStorage.getItem("myExpenses");
  const saved = data ? JSON.parse(data) : [];
  return saved.filter(
    (e) => Number.isFinite(e.amount) && e.amount > 0 && e.amount <= MAX_AMOUNT,
  );
}

// History

historyBtn.addEventListener("click", () => {
  historyModal.classList.add("is-open");
  historyCloseBtn.focus();
});

historyCloseBtn.addEventListener("click", () => {
  historyModal.classList.remove("is-open");
});

// History Empty State
function updateHistoryEmptyState() {
  if (deletedExpenses.length === 0) {
    historyEmptyState.hidden = false;
  } else {
    historyEmptyState.hidden = true;
  }
}

// Rendering Deleted Expenses
deletedExpenses = loadHistorySavedData();
updateHistoryEmptyState();
function renderDeletedExpenses() {
  delHistoryList.innerHTML = "";

  deletedExpenses.forEach((expense) => {
    delHistoryList.innerHTML += `<li class="history-item">
              <div class="history-item__title"></div>
              <div class="history-item__details">
                <span>Rs ${expense.amount.toLocaleString("en-PK")}</span>
                <span>${expense.category}</span>
                <span>${expense.deletedOn}</span>
              </div>
            </li>`;
    delHistoryList.lastElementChild.querySelector(
      ".history-item__title",
    ).textContent = expense.title;
  });
}
renderDeletedExpenses();

// Clear History

clearHistoryBtn.addEventListener("click", async () => {
  const historyItems = delHistoryList.querySelectorAll(".history-item");

  if (historyItems.length === 0) {
    updateHistoryEmptyState();
    return;
  }

  clearHistoryBtn.disabled = true;

  const animations = Array.from(historyItems).map((item, index) => {
    item.style.animationDelay = `${index * 45}ms`;
    item.classList.add("history-item--clearing");

    return new Promise((resolve) => {
      item.addEventListener("animationend", resolve, { once: true });
    });
  });

  await Promise.all(animations);

  deletedExpenses = [];
  delHistoryList.innerHTML = "";

  updateHistoryEmptyState();
  saveHistoryData(deletedExpenses);

  clearHistoryBtn.disabled = false;
});

// Local storage for history

function saveHistoryData(deletedExpensesArray) {
  localStorage.setItem("deletedexpenses", JSON.stringify(deletedExpensesArray));
}

function loadHistorySavedData() {
  const data = localStorage.getItem("deletedexpenses");
  return data ? JSON.parse(data) : [];
}

// Dark Mode

function applyTheme(isDark) {
  document.documentElement.setAttribute(
    "data-theme",
    isDark ? "dark" : "light",
  );

  themeToggleBtn.textContent = isDark ? "☀️ Light mode" : "🌙 Dark mode";

  themeToggleBtn.setAttribute("aria-pressed", isDark);
}

themeToggleBtn.addEventListener("click", () => {
  const isDark = document.documentElement.getAttribute("data-theme") !== "dark";

  applyTheme(isDark);
  localStorage.setItem("kharchaTheme", isDark ? "dark" : "light");
});

const savedTheme = localStorage.getItem("kharchaTheme");
if (savedTheme) {
  applyTheme(savedTheme === "dark");
}

// Clear All Expenses

clearAllBtn.addEventListener("click", () => {
  const n = expenses.length;
  confirmText.textContent = `This moves all ${n} ${n === 1 ? "expense" : "expenses"} to History, where you can remove them for good.`;
  confirmModal.classList.add("is-open");
  confirmCancelBtn.focus();
});

confirmOkBtn.addEventListener("click", () => {
  const today = new Date().toLocaleDateString();
  deletedExpenses.push(...expenses.map((e) => ({ ...e, deletedOn: today })));
  expenses = [];
  saveData(expenses);
  saveHistoryData(deletedExpenses);
  searchInput.value = "";
  filterCategory.value = "all";
  renderAllExpenses(expenses);
  noResults.hidden = true;
  renderDeletedExpenses();
  updateHistoryEmptyState();
  closeModals();
});
