import { getLocalStorage } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";

const services = new ExternalServices();

function formDataToJSON(formElement) {
  // convert the form data to a JSON object
  const formData = new FormData(formElement);
  const convertedJSON = {};
  formData.forEach((value, key) => {
    convertedJSON[key] = value;
  });
  return convertedJSON;
}

function packageItems(items) {
  const simplifiedItems = items.map((item) => {
    return {
      id: item.Id,
      price: item.FinalPrice,
      name: item.Name,
      quantity: item.quantity,
    };
  });
  return simplifiedItems;
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
    const summaryElement = document.querySelector(
      this.outputSelector + " #cartTotal"
    );
    let itemNumElement = document.querySelector(
      this.outputSelector + " #num-items"
    );

    // Sum the quantities
    const totalItems = this.list.reduce((sum, item) => sum + item.quantity, 0);
    itemNumElement.textContent = totalItems;

    // Calculate total price
    const totalAmount = this.list.reduce((sum, item) => sum + item.FinalPrice * item.quantity, 0);
    summaryElement.textContent = `$${totalAmount.toFixed(2)}`;
    
    // calculate the total of all the items in the cart
    const amounts = this.list.map((item) => item.FinalPrice);
    this.itemTotal = amounts.reduce((sum, item) => sum + item);
    summaryElement.innerText = `$${this.itemTotal.toFixed(2)}`;;
  }

  calculateOrderTotal() {
    // calculate the shipping and tax amounts. Then use them to along with the cart total to figure out the order total
    this.tax = (this.itemTotal * .06);
    this.shipping = 10 + (this.list.length - 1) * 2;
    this.orderTotal = (
      parseFloat(this.itemTotal) +
      parseFloat(this.tax) +
      parseFloat(this.shipping)
    )
    // display the totals.
    this.displayOrderTotals();
  }

  displayOrderTotals() {
    // once the totals are all calculated display them in the order summary page
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

  const order = {
    orderDate: new Date().toISOString(),
    orderTotal: this.orderTotal,
    tax: this.tax,
    items: packageItems(this.list),
      fname: formData.fname,
      lname: formData.lname,
    address: {
      street:formData.street,
      city: formData.city,
      state: formData.state,
      zip: formData.zip,
    },
      cardNumber: formData.cardNumber,
      expiration: formData.expiration,
      securityCode: formData.securitycode
    };
    console.log("FORM DATA:", formData);
    console.log("ORDER SENT:", JSON.stringify(order, null, 2));


  try {
    const response = await services.checkout(order);
    console.log("Order success:", response);

    // Clear the cart
    localStorage.removeItem(this.key);

    // Redirect to success page
    window.location.href = "./success.html";
  } catch (err) {
    console.log(err);
  }
}
}