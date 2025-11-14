import { getParam } from './utils.mjs';
import ProductData from './ProductData.mjs';
// import your render helper(s) if you have them, e.g.
// import { renderProductDetails } from './productDetails.mjs';

const dataSource = new ProductData('tents');

async function initProductPage() {
  try {
    // 1. Get the product id from the URL
    const productId = getParam('product');

    // 2. Fetch that specific product’s data
    const product = await dataSource.findProductById(productId);

    // 3. Render the data into the page
    // Replace this with whatever you’re doing now:
    // renderProductDetails(product);
    // OR directly manipulate the DOM here.

    console.log('Loaded product:', product); // temporary sanity check
  } catch (err) {
    console.error('Error loading product page:', err);
  }
}

// Run it
initProductPage();
