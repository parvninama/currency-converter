// Base URL of the currency API
const BASE_URL = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies";

// Select necessary DOM elements
const body = document.body;
const form = document.querySelector("form");
const dropdowns = document.querySelectorAll(".dropdown select");
const submitButton = document.querySelector(".submit-button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const exchangeButton = document.querySelector(".exchange-button");
const themeButton = document.querySelector(".theme-button");

// Populate currency dropdowns
for (let select of dropdowns) {
  for (let currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;

    if (select.name == "From" && currCode == "USD") {
      newOption.selected = "selected";
    } else if (select.name == "To" && currCode == "INR") {
      newOption.selected = "selected";
    }

    select.append(newOption);
  }

  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

// Form Submit Handler
form.addEventListener("submit", function (e) {
  e.preventDefault();
  submitButton.disabled = true; 
  updateExchangeRate().finally(() => {
    submitButton.disabled = false;
  });
});

// Function: Update Country Flag
const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
};

// Theme Toggle Handler
themeButton.addEventListener("click", () => {
  body.classList.toggle("dark-theme");
  const icon = themeButton.querySelector("i");
  icon.classList.toggle("fa-moon");
  icon.classList.toggle("fa-sun");
});

// Currency Swap Handler
exchangeButton.addEventListener("click", (evt) => {
  evt.preventDefault();

  let temp = fromCurr.value;
  fromCurr.value = toCurr.value;
  toCurr.value = temp;

  updateFlag(fromCurr);
  updateFlag(toCurr);

  submitButton.focus();
});

// Submit Button Click Handler

submitButton.addEventListener("click", async (evt) => {
  evt.preventDefault();
  updateExchangeRate(); 
});

// Function: Fetch and Display Exchange Rate

const updateExchangeRate = async () => {
  const amountInput = document.querySelector(".input");
  const output = document.querySelector(".output");

  const amountValue = Number(amountInput.value);

  if (isNaN(amountValue) || amountValue < 1) {
    output.value = 0;
    return;
  }

  const URL = `${BASE_URL}/${fromCurr.value.toLowerCase()}.json`;

  try {
    const response = await fetch(URL);
    const data = await response.json();

    const rate =
    data[fromCurr.value.toLowerCase()][toCurr.value.toLowerCase()];
    const finalAmount = (rate * amountValue).toFixed(2);

    // Update readonly input
    output.value = finalAmount;
  } catch (error) {
    output.value = 0;
  }
};