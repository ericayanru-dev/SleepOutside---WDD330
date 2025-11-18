import { getLocalStorage } from "./utils.mjs";
import ShoppingCart from "./ShoppingCart.mjs";


const cartListElement = document.querySelector("#cart-list");
const cart = new ShoppingCart("so-cart", cartListElement);
cart.renderList();

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart");
  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  document.querySelector(".product-list").innerHTML = htmlItems.join("");
  let total = 0;
  
  if (cartItems && cartItems.length > 0) {
     cartItems.forEach(element => {
       let price = element.FinalPrice;
       total += price
     });
    document.querySelector("#total").innerHTML = total
    document.querySelector("#hide").classList.toggle("show", true)
  }
}

function cartItemTemplate(item) {
  const newItem = `<li class="cart-card divider">
  <a href="#" class="cart-card__image">
    <img
      src="${item.Image}"
      alt="${item.Name}"
    />
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors[0].ColorName}</p>
  <p class="cart-card__quantity">qty: 1</p>
  <p class="cart-card__price">$${item.FinalPrice}</p>
</li>`;

  return newItem;
}

renderCartContents();
