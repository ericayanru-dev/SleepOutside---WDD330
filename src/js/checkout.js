import { loadHeaderFooter } from "./utils.mjs";
import CheckoutProcess  from "./CheckoutProcess.mjs";

loadHeaderFooter();

const order = new CheckoutProcess("so-cart", ".checkout-summary");
order.init();


// Add event listeners to fire calculateOrderTotal when the user changes the zip code
document.querySelector('#checkoutSubmit').addEventListener('click', (e) => {
  e.preventDefault();
  // access the checkout form
  const myForm = document.forms["checkout"];
  // check if the form is valid (returns true/false)
  const chk_status = myForm.checkValidity();
  // show browser validation messages
  myForm.reportValidity();
  // if valid, proceed with checkout
  if (chk_status) {
    order.checkout();
  }
});