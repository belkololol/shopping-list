function createShoppingProduct(productData) {
    const newProduct = document.createElement('li');
    newProduct.id = productData.id;

    newProduct.innerHTML = `
      ${productData.name}  <span class="ready">&#x2718</span> 
    `;

    return newProduct;
}

function createShoppingList() {
    DOMNodes.shoppingList.innerHTML = '';
    const productListData = listsData.shopping;
    const listLayout = productListData.map((productData) => createShoppingProduct(productData));
    DOMNodes.shoppingList.append(...listLayout);
}
