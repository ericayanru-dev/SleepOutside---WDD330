import { setLocalStorage, getLocalStorage, getParam } from "./utils.mjs";
import ProductData from "./ProductData.mjs";
import { ProductDetails } from "./ProductDetails.mjs";

const dataSource = new ProductData("tents");
const productId = getParam("product")
// 3. Create the ProductDetails object with both
const product = new ProductDetails(productId, dataSource);
product.init();
dataSource.findProductById(productId).then(console.log);



// add to cart button event handler
async function addToCartHandler(e) {
  const product = await dataSource.findProductById(e.target.dataset.id);
  addProductToCart(product);
}

// add listener to Add to Cart button
