import { setLocalStorage, getLocalStorage } from "./utils.mjs";

export class ProductDetails{
  constructor(productId, dataSource) {
    this.productId = productId;
    this.dataSource = dataSource;
    this.product ={}
  }
  async init() {
    this.product = await this.dataSource.findProductById(this.productId);
    this.renderProductDetails(this.product);
    
    document.getElementById("addToCart").addEventListener("click",
      this.addProductToCart.bind(this, this.product));

  }
  renderProductDetails(product) {
     // Update page elements dynamically
    document.querySelector("#productImage").src = product.Image;
    document.querySelector("#productImage").alt = product.NameWithoutBrand;
    document.querySelector("#productName").textContent = product.NameWithoutBrand;
    document.querySelector("#productBrand").textContent = product.Brand.Name;
    document.querySelector("#productPrice").textContent = `$${product.FinalPrice}`;
    document.querySelector("#productColor").textContent = product.Colors[0].ColorName;
    document.querySelector("#productDescription").innerHTML = product.DescriptionHtmlSimple;
    
  }
  addProductToCart(product) {
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
}
