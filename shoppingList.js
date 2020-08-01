function createShoppingProduct(productData) {
    const newProduct = document.createElement('li');
    newProduct.id = productData.id;

    newProduct.innerHTML = `
      ${productData.name}  <img src="image/deleteshopping.png" class="ready">
    `;

    newProduct.querySelector('.ready').addEventListener('click', (e) => {
        deleteShoppingListItem(productData);
    });

    return newProduct;
}

function createShoppingList() {
    DOMNodes.shoppingList.innerHTML = '';
    const activeTemplateListLayout = listsData.template
        .filter((productData) => productData.isActive)
        .map((productData) => createShoppingProduct(productData));
    const shoppingListLayout = listsData.shopping.map((productData) => createShoppingProduct(productData));
    DOMNodes.shoppingList.append(...activeTemplateListLayout, ...shoppingListLayout);
}

function deleteShoppingListItem(productToDelete) {
    const index = listsData.shopping.findIndex((product) => {
        if (productToDelete.id === product.id) return true;
    });

    listsData.shopping.splice(index, 1);
    localStorage.setItem(localStorageName, JSON.stringify(listsData));

    createShoppingList();

    const isTemplate = Boolean(productToDelete.inputId);
    if (isTemplate) {
        productToDelete.isActive = false;
        localStorage.setItem(localStorageName, JSON.stringify(listsData));
        createShoppingList();
        createTemplateList();
    }
}