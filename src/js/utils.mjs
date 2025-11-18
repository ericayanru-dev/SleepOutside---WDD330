// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}
// or a more concise version if you are into that sort of thing:
// export const qs = (selector, parent = document) => parent.querySelector(selector);

// ************* MIRROR FUNCTIONS ************
// RETRIEVE FROM LOCAL STORAGE
export function getLocalStorage(key) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
}

// SAVING DATA TO LOCAL STORAGE: SAVES KEY-VALUE PAIRS
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener("click", callback);
}

export function getParam(param)
{
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const product = urlParams.get(param)
  return product
}

export function renderListWithTemplate(templateFn, parentElement, list, position = "afterbegin", clear = false) {
  const htmlStrings = list.map(templateFn)
  if (clear) {
    parentElement.innerHTML = "";
  }
  parentElement.insertAdjacentHTML(position, htmlStrings.join(''));
}

export function  renderWithTemplate(template, parentElement, data = null, callback = null) {
  parentElement.innerHTML = template;
  if (callback) {
    callback(data);
  }
}

async function loadTemplate(path){
  const res = await fetch(path);
  const template = await res.text();
  return template;
}

export async function loadHeaderFooter() {
  const headerTemplate = await loadTemplate("../partials/header.html");
  const headerElement = document.querySelector("#main-header");
  const footerTemplate = await loadTemplate("../partials/footer.html");
  const footerElement = document.querySelector("#main-footer");
  renderWithTemplate(headerTemplate, headerElement);
  renderWithTemplate(footerTemplate, footerElement);
}