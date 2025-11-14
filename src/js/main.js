// main.js
import ProductData from './ProductData.mjs';
import ProductList from './ProductList.mjs';

// Create a data source for tents
const dataSource = new ProductData('tents');

// Grab the element where the products should be listed
// Adjust selector to match your index.html
const listElement = document.querySelector('.product-list'); // or '#product-list'

// Create the ProductList and load it
const productList = new ProductList('tents', dataSource, listElement);
productList.init();

