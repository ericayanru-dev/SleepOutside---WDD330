import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";
import { loadHeaderFooter } from "./utils.mjs";

const dataSource = new ProductData("tents");
const listElement = document.querySelector("#product-list")

//tents is the path to the json file
// dataSource is the content of the json file in and array
// 
const productList = new ProductList("tents", dataSource, listElement);

productList.init();

loadHeaderFooter();