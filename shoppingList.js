function createShoppingProduct(productData) {
    const newProduct = document.createElement('li');
    newProduct.id = productData.id;

    newProduct.innerHTML = `
      ${productData.name}  <span class="ready">&#x2718</span> 
    `;

    newProduct.querySelector('.ready').addEventListener('click', (e) => {
        deleteShoppingListItem(productData);
    });

    return newProduct;
}

function createShoppingList() {
    DOMNodes.shoppingList.innerHTML = '';
    const productListData = listsData.shopping;
    const listLayout = productListData.map((productData) => createShoppingProduct(productData));
    DOMNodes.shoppingList.append(...listLayout);
}

function deleteShoppingListItem(productToDelete) {
    const index = listsData.shopping.findIndex((product) => {
        if (productToDelete.id === product.id) return true;
    });

    listsData.shopping.splice(index, 1);
    localStorage.setItem(localStorageName, JSON.stringify(listsData));

    createShoppingList();
}