import { getLocalStorage, loadHeaderFooter } from "./utils.mjs";
import ShoppingCart from "./ShoppingCart.mjs";

loadHeaderFooter();

document.addEventListener("DOMContentLoaded", () => {
  const cartListElement = document.querySelector("#cart-list");
  const cart = new ShoppingCart("so-cart", cartListElement);
  cart.renderList();
  renderCartContents();
});

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart") || [];
  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  const productListEl = document.querySelector(".product-list");

  if (productListEl) {
    productListEl.innerHTML = htmlItems.join("");
  }

  let total = 0;
  if (cartItems.length > 0) {
    cartItems.forEach(item => {
      total += item.FinalPrice * (item.quantity || 1);
    });

    const totalEl = document.querySelector("#total");
    if (totalEl) {
      totalEl.textContent = total.toFixed(2);
    }

    const hideEl = document.querySelector("#hide");
    if (hideEl) hideEl.classList.add("show");
  }
}

function cartItemTemplate(item) {
  return `<li class="cart-card divider">
    <a href="#" class="cart-card__image">
      <img src="${item.Images.PrimaryMedium}" alt="${item.Name}" />
    </a>
    <a href="#">
      <h2 class="card__name">${item.Name}</h2>
    </a>
    <p class="cart-card__color">${item.Colors[0].ColorName}</p>
    <p class="cart-card__quantity">qty: ${item.quantity}</p>
    <p class="cart-card__price">$${item.FinalPrice}</p>
  </li>`;
}
