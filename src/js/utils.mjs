// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}
// or a more concise version if you are into that sort of thing:
// export const qs = (selector, parent = document) => parent.querySelector(selector);

// ************* MIRROR FUNCTIONS ************
// RETRIEVE FROM LOCAL STORAGE
export function getLocalStorage(key) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
}

// SAVING DATA TO LOCAL STORAGE: SAVES KEY-VALUE PAIRS
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener("click", callback);
}

export function getParam(param)
{
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const product = urlParams.get(param)
  return product
}

export function renderListWithTemplate(templateFn, parentElement, list, position = "afterbegin", clear = false) {
  const htmlStrings = list.map(templateFn)
  if (clear) {
    parentElement.innerHTML = "";
  }
  parentElement.insertAdjacentHTML(position, htmlStrings.join(''));
}

export function  renderWithTemplate(template, parentElement, data = null, callback = null) {
  parentElement.innerHTML = template;
  if (callback) {
    callback(data);
  }
}

async function loadTemplate(path){
  const res = await fetch(path);
  const template = await res.text();
  return template;
}

export async function loadHeaderFooter() {
  const headerTemplate = await loadTemplate("../partials/header.html");
  const headerElement = document.querySelector("#main-header");
  const footerTemplate = await loadTemplate("../partials/footer.html");
  const footerElement = document.querySelector("#main-footer");
  renderWithTemplate(headerTemplate, headerElement);
  renderWithTemplate(footerTemplate, footerElement);
}
// ************* ALERT MESSAGE *************
export function alertMessage(message, scroll = true) {
  // Remove any existing alert
  const existing = document.querySelector(".custom-alert");
  if (existing) existing.remove();

  // Create alert container
  const alertDiv = document.createElement("div");
  alertDiv.className = "custom-alert";
  alertDiv.innerText = message;

  // Style the alert (simple styling, can customize)
  alertDiv.style.position = "fixed";
  alertDiv.style.top = "20px";
  alertDiv.style.left = "50%";
  alertDiv.style.transform = "translateX(-50%)";
  alertDiv.style.backgroundColor = "#f44336"; // red
  alertDiv.style.color = "#fff";
  alertDiv.style.padding = "12px 20px";
  alertDiv.style.borderRadius = "8px";
  alertDiv.style.boxShadow = "0 2px 6px rgba(0,0,0,0.3)";
  alertDiv.style.zIndex = 1000;

  document.body.appendChild(alertDiv);

  // Optionally scroll to top
  if (scroll) window.scrollTo({ top: 0, behavior: "smooth" });

  // Remove alert after 4 seconds
  setTimeout(() => alertDiv.remove(), 4000);
}

// ************* VALIDATE CREDIT CARD *************
export function isValidCardNumber(raw) {
  const s = raw.replace(/\D/g, ""); // remove non-digits
  if (s.length < 13 || s.length > 19) return false;

  let sum = 0;
  let doubleDigit = false;
  for (let i = s.length - 1; i >= 0; i--) {
    let digit = parseInt(s[i], 10);
    if (doubleDigit) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    doubleDigit = !doubleDigit;
  }
  return sum % 10 === 0;
}

// ************* VALIDATE CHECKOUT FORM *************
export function validateCheckoutForm(formData) {
  const errors = {};

  // Required fields
  ["fname", "lname", "street", "city", "state", "zip", "cardNumber", "expiration", "securityCode"].forEach(field => {
    if (!formData[field] || formData[field].trim() === "") {
      errors[field] = "This field is required.";
    }
  });

  // Card number
  if (formData.cardNumber && !isValidCardNumber(formData.cardNumber)) {
    errors.cardNumber = "Invalid card number.";
  }

  // Expiration date (MM/YY or MM/YYYY)
  if (formData.expiration) {
    const [month, year] = formData.expiration.split("/").map(s => parseInt(s, 10));
    if (!month || !year || month < 1 || month > 12) {
      errors.expiration = "Invalid expiration date.";
    } else {
      const fullYear = year < 100 ? 2000 + year : year;
      const now = new Date();
      const expDate = new Date(fullYear, month - 1, 1);
      if (expDate < new Date(now.getFullYear(), now.getMonth(), 1)) {
        errors.expiration = "Card has expired.";
      }
    }
  }

  // Security code / CVV
  if (formData.securityCode && !/^\d{3,4}$/.test(formData.securityCode)) {
    errors.securityCode = "Invalid security code.";
  }

  // Optional: ZIP code (5 digits)
  if (formData.zip && !/^\d{5}$/.test(formData.zip)) {
    errors.zip = "Invalid ZIP code.";
  }

  return errors; // Empty object = form valid
}
