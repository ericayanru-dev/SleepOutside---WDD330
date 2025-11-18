export function cartItemTemplate(item) {
  return `<li class="cart-card">
    <img src="${item.Images}" alt="Image of ${item.Name}">
    <h2>${item.Name}</h2>
    <p>$${item.FinalPrice}</p>
  </li>`;
}


export default class ShoppingCart {
  constructor(key, listElement) {
    this.key = key;
    this.listElement = listElement;
  }

  loadCart() {
    return JSON.parse(localStorage.getItem(this.key)) || [];
  }

  renderList() {
    const items = this.loadCart();
    const htmlStrings = items.map(item => cartItemTemplate(item));
    this.listElement.insertAdjacentHTML("afterbegin", htmlStrings.join(""));
  }
}
