import { setLocalStorage } from './utils.mjs'; // if you use it
export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }

  async init() {
    // 1) fetch the product data by ID (await the promise)
    this.product = await this.dataSource.findProductById(this.productId);

    // 2) render details to the page
    this.renderProductDetails();

    // 3) wire up Add to Cart
    document
      .getElementById('addToCart')
      .addEventListener('click', this.addProductToCart.bind(this));
  }

  addProductToCart() {
    // move your existing add-to-cart logic from product.js here
    // example: setLocalStorage('so-cart', updatedCartArray)
  }

  renderProductDetails() {
    // Use the structure from product_pages/index.html as a guide:
    // - inject name, price, image, description, and ensure there's an #addToCart button
    // Example (pseudo):
    // document.querySelector('.product-name').textContent = this.product.Name;
    // document.querySelector('.product-price').textContent = `$${this.product.FinalPrice}`;
    // document.querySelector('img.product-image').src = this.product.Image;
  }
}
