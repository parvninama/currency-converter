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

// ============================
// Populate currency dropdowns
// ============================
for (let select of dropdowns) {
  for (let currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;

    // Set default selections
    if (select.name == "From" && currCode == "USD") {
      newOption.selected = "selected";
    } else if (select.name == "To" && currCode == "INR") {
      newOption.selected = "selected";
    }

    select.append(newOption);
  }

  // Update flag when currency changes
  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

// ============================
// Form Submit Handler
// ============================
form.addEventListener("submit", function (e) {
  e.preventDefault(); // Prevent default page reload
  submitButton.disabled = true; // Temporarily disable button to avoid multiple clicks

  // Fetch exchange rate and re-enable the button after completion
  updateExchangeRate().finally(() => {
    submitButton.disabled = false;
  });
});

// ============================
// Function: Update Country Flag
// ============================
const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode]; // Get country code from mapping
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
};

// ============================
// Theme Toggle Handler
// ============================
themeButton.addEventListener("click", () => {
  body.classList.toggle("dark-theme"); // Toggle theme class
  const icon = themeButton.querySelector("i");
  icon.classList.toggle("fa-moon"); // Change icon
  icon.classList.toggle("fa-sun");
});

// ============================
// Currency Swap Handler
// ============================
exchangeButton.addEventListener("click", (evt) => {
  evt.preventDefault();

  // Swap the selected currencies
  let temp = fromCurr.value;
  fromCurr.value = toCurr.value;
  toCurr.value = temp;

  // Update flags after swapping
  updateFlag(fromCurr);
  updateFlag(toCurr);

  // Focus the submit button
  submitButton.focus();
});

// ============================
// Submit Button Click Handler
// ============================
submitButton.addEventListener("click", async (evt) => {
  evt.preventDefault(); // Prevent default form submission
  updateExchangeRate(); // Trigger exchange rate update
});

// ============================
// Function: Fetch and Display Exchange Rate
// ============================
const updateExchangeRate = async () => {
  const amount = document.querySelector("input");
  const msg = document.querySelector(".msg");
  const amountValue = Number(amount.value);

  // Input validation
  if (isNaN(amountValue) || amountValue < 1) {
    msg.innerText = "Please enter a valid amount ";
    msg.classList.remove("hide", "success");
    msg.classList.add("error");
    submitButton.style.marginTop = "0";
    return;
  }

  // Construct API URL using selected "From" currency
  const URL = `${BASE_URL}/${fromCurr.value.toLowerCase()}.json`;

  try {
    // Fetch exchange data from API
    const response = await fetch(URL);
    const data = await response.json();

    // Extract conversion rate and calculate converted amount
    const rate = data[fromCurr.value.toLowerCase()][toCurr.value.toLowerCase()];
    const finalAmount = (rate * amountValue).toFixed(2);

    // Show success message
    msg.classList.remove("hide", "error", "success");
    msg.classList.add("success");
    msg.innerText = `${amountValue} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
    submitButton.style.marginTop = "0";
  } catch (error) {
    // Handle fetch or API error
    msg.innerText = "Error fetching exchange rate. Please try again.";
    submitButton.style.marginTop = "0";
    msg.classList.remove("hide", "success");
    msg.classList.add("error");
  }
};