import { getLocalStorage, alertMessage, isValidCardNumber, validateCheckoutForm } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";

const services = new ExternalServices();

// Convert form data to JSON object
function formDataToJSON(formElement) {
  const formData = new FormData(formElement);
  const convertedJSON = {};
  formData.forEach((value, key) => {
    convertedJSON[key] = value;
  });
  return convertedJSON;
}

// Simplify items for sending to server
function packageItems(items) {
  return items.map(item => ({
    id: item.Id,
    price: item.FinalPrice,
    name: item.Name,
    quantity: item.quantity
  }));
}

export default class CheckoutProcess {
  constructor(key, outputSelector) {
    this.key = key;
    this.outputSelector = outputSelector;
    this.list = [];
    this.itemTotal = 0;
    this.shipping = 0;
    this.tax = 0;
    this.orderTotal = 0;
  }

  init() {
    this.list = getLocalStorage(this.key);
    this.calculateItemSummary();
    this.calculateOrderTotal();
  }

  calculateItemSummary() {
    const summaryElement = document.querySelector(`${this.outputSelector} #cartTotal`);
    const itemNumElement = document.querySelector(`${this.outputSelector} #num-items`);

    const totalItems = this.list.reduce((sum, item) => sum + item.quantity, 0);
    itemNumElement.textContent = totalItems;

    this.itemTotal = this.list.reduce((sum, item) => sum + item.FinalPrice * item.quantity, 0);
    summaryElement.textContent = `$${this.itemTotal.toFixed(2)}`;
  }

  calculateOrderTotal() {
    this.tax = this.itemTotal * 0.06;
    this.shipping = 10 + (this.list.length - 1) * 2;
    this.orderTotal = this.itemTotal + this.tax + this.shipping;
    this.displayOrderTotals();
  }

  displayOrderTotals() {
    const tax = document.querySelector(`${this.outputSelector} #tax`);
    const shipping = document.querySelector(`${this.outputSelector} #shipping`);
    const orderTotal = document.querySelector(`${this.outputSelector} #orderTotal`);

    tax.innerText = `$${this.tax.toFixed(2)}`;
    shipping.innerText = `$${this.shipping.toFixed(2)}`;
    orderTotal.innerText = `$${this.orderTotal.toFixed(2)}`;
  }

  async checkout() {
    const formElement = document.forms["checkout"];
    const formData = formDataToJSON(formElement);

    // 1️⃣ Client-side validation
    

    // Build order object
    const order = {
      orderDate: new Date().toISOString(),
      orderTotal: this.orderTotal,
      tax: this.tax,
      items: packageItems(this.list),
      fname: formData.fname,
      lname: formData.lname,
      street: formData.street,
      city: formData.city,
      state: formData.state,
      zip: formData.zip,
      cardNumber: formData.cardNumber.replace(/\D/g, ""), // remove spaces/dashes
      expiration: formData.expiration,
      securityCode: formData.securityCode
    };

    console.log("FORM DATA:", formData);
    console.log("ORDER SENT:", JSON.stringify(order, null, 2));
    const errors = validateCheckoutForm(formData);
    // 1️⃣ Client-side validation
    
    if (Object.keys(errors).length > 0) {
      for (let field in errors) {
        alertMessage(errors[field], true);
      }
      return; // stop checkout if errors
    }

    // 2️⃣ Send to backend and handle errors
    try {
      const response = await services.checkout(order);
      console.log("Order success:", response);

      // HAPPY PATH 🎉
      localStorage.removeItem(this.key);   // clear cart
      window.location.href = "./success.html";  // redirect
    } catch (err) {
      console.log(err);

      const errors = err.message;
      for (let field in errors) {
        alertMessage(errors[field], true);
      }
    }
  }
}