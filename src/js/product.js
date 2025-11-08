import { setLocalStorage, getLocalStorage } from "./utils.mjs";
import ProductData from "./ProductData.mjs";

const dataSource = new ProductData("tents");

function addProductToCart(product) {
  const cart = getLocalStorage("so-cart");
  const existing = cart.find(item => item.Id === product.Id);

  if (existing) {
    // If found, increase quantity
    existing.quantity += 1;
  } else {
    // If not found, add new product with quantity 1
    product.quantity = 1;
    cart.push(product);
  }
  setLocalStorage("so-cart", cart);
}


// add to cart button event handler
async function addToCartHandler(e) {
  const product = await dataSource.findProductById(e.target.dataset.id);
  addProductToCart(product);
}

// add listener to Add to Cart button
document
  .getElementById("addToCart")
  .addEventListener("click", addToCartHandler);
