const localStorageName = 'listsData';

/*
  template: [{
    id: 1544234234234,
    inputId: 'input-1544234234234',
    name: 'Молоко',
  }],
  shopping: [{
    id: 1544234234234,
    name: 'Молоко',
  }]
*/

const listNames = {
  template: 'template',
  shopping: 'shopping',
};

let listsData = {
  shopping: [],
  template: [],
  activeList: listNames.template,
  manual: {
    [listNames.template]: 'Добавляйте продукты в шаблон (+), отмечайте, когда что-то закончилось (&#9633) и оно попадет в "список покупок".',
    [listNames.shopping]: 'Составляйте список покупок (+) или используйте шаблон. Чтобы вычеркнуть товар из списка, нажмите X.',
  },

};

let isEditMode = false;

const DOMNodes = {
  editWrapper: document.querySelector('.edit'),
  manual: document.querySelector('.manual'),
  templateTabButton: document.querySelector('.tab-button.template'),
  shoppingTabButton: document.querySelector('.tab-button.shopping'),
  templateList: document.querySelector('.template-list'),
  shoppingList: document.querySelector('.shopping-list'),
  plusButton: document.querySelector('.plus'),
  plusButtonWrapper: document.querySelector('.add-button-wrapper'),
  plusInput: document.querySelector('.new-product'),
  editModeButton: document.querySelector('.edit-button'),
};

// создание разметки элемента списка (DOM узла правильнее)
function createTemplateProduct(productData) {
  const newProduct = document.createElement('li');
  newProduct.id = productData.id;

  newProduct.innerHTML = `
    <input type="checkbox" class="check-add" id="${productData.inputId}">
    <label for="${productData.inputId}">
      ${productData.name} 
      <img src="image/delete2.png" class="remove-button hidden"> 
    </label>
  `;

  newProduct.querySelector('.remove-button').addEventListener('click', (e) => {
    e.preventDefault();
    deleteTemplateListItem(productData);
  });

  return newProduct;
}

// создание и добавление разметки всего списка
function createTemplateList() {
  DOMNodes.templateList.innerHTML = '';
  const productListData = listsData.template;
  const listLayout = productListData.map((productData) => createTemplateProduct(productData));
  DOMNodes.templateList.append(...listLayout);

  // то же самое, что и const listLayout = productListData.map((productData) => createTemplateProduct(productData));
  // const listLayout = [];
  // for (let i = 0; i < productListData.length; i++) {
  //   const productData = productListData[i];
  //   listLayout.push(createTemplateProduct(productData));
  // }
}

function addProduct(name) {
  const isTemplateList = listsData.activeList === listNames.template;

  const id = new Date().getTime().toString();
  const newProductData = {
    name: name,
    id: id,
  };

  if (isTemplateList) {
    newProductData.inputId = 'input-' + id;
    setEditModeListItems(isEditMode);
  }

  listsData[listsData.activeList].push(newProductData);
  localStorage.setItem(localStorageName, JSON.stringify(listsData));

  if (isTemplateList) {
    createTemplateList();
  } else {
    createShoppingList();
  }
}

function plusButtonHandler(e) {
  const button = e.currentTarget;
  const isClose = button.classList.contains('close');
  const isShowWrapper = DOMNodes.plusButtonWrapper.classList.contains('show');

  // если кнопка крестик, то при нажатии становится плюсиком и инпут скрывается
  if (isClose) {
    DOMNodes.plusButtonWrapper.classList.remove('show');
    button.classList.remove('close');
    // если что введено, то берется значение и добавляется элемент списка
  } else if (isShowWrapper) {
    const value = DOMNodes.plusInput.value;
    addProduct(value);

    DOMNodes.plusInput.value = '';
    DOMNodes.plusButtonWrapper.classList.add('show');
    button.classList.add('close');
  } else {
    DOMNodes.plusButtonWrapper.classList.add('show');
    button.classList.add('close');
  }
}

// обработчик событий на ввод в инпут
function plusInputHandler(e) {
  const value = e.currentTarget.value;

  if (value.length === 0) {
    DOMNodes.plusButton.classList.add('close');
  } else {
    DOMNodes.plusButton.classList.remove('close');
  }
}

function toggleEditMode(e) {
  const button = e.currentTarget;
  button.classList.toggle('finish');
  isEditMode = !isEditMode;

  setEditModeListItems(isEditMode);
}

function setEditModeListItems(isEditMode) {
  DOMNodes.templateList.childNodes.forEach((li) => {
    const checkbox = li.querySelector('.check-add');
    const removeButton = li.querySelector('.remove-button');

    if (isEditMode) {
      checkbox.setAttribute('disabled', true);
      removeButton.classList.remove('hidden');
      setTimeout(() => {
        removeButton.classList.add('animate');
      }, 100)
    } else {
      checkbox.removeAttribute('disabled');
      removeButton.classList.add('hidden');
      setTimeout(() => {
        removeButton.classList.add('animate');
      }, 100)
    }

  });
}

function deleteTemplateListItem(productToDelete) {
  const index = listsData.template.findIndex((product) => {
    if (productToDelete.id === product.id) return true;
  });

  listsData.template.splice(index, 1);
  localStorage.setItem(localStorageName, JSON.stringify(listsData));

  createTemplateList();
  setEditModeListItems(isEditMode);
}

function init() {
  const dataFromLocalStorage = localStorage.getItem(localStorageName);
  if (dataFromLocalStorage) {
    listsData = JSON.parse(dataFromLocalStorage);
  }

  setActiveList(listsData.activeList);
  setManual(listsData.activeList);
  setEdit(listsData.activeList);
  createTemplateList();
  createShoppingList();

  DOMNodes.templateTabButton.addEventListener('click', tabTemplateHandler);
  DOMNodes.shoppingTabButton.addEventListener('click', tabShoppingHandler);
  DOMNodes.plusButton.addEventListener('click', plusButtonHandler);
  DOMNodes.plusInput.addEventListener('input', plusInputHandler);
  DOMNodes.editModeButton.addEventListener('click', toggleEditMode);
}

function setEdit(activeList) {
  if (activeList === listNames.template) {
    DOMNodes.editWrapper.classList.remove('hidden');
  } else {
    DOMNodes.editWrapper.classList.add('hidden');
  }
}

function setActiveList(activeList) {
  if (activeList === listNames.template) {
    DOMNodes.templateTabButton.classList.add('active');
    DOMNodes.templateList.classList.remove('hidden');
    DOMNodes.shoppingList.classList.add('hidden');
  } else {
    DOMNodes.shoppingTabButton.classList.add('active');
    DOMNodes.templateList.classList.add('hidden');
    DOMNodes.shoppingList.classList.remove('hidden');
  }
}

function tabTemplateHandler() {
  DOMNodes.templateTabButton.classList.add('active');
  DOMNodes.shoppingTabButton.classList.remove('active');
  listsData.activeList = listNames.template;
  localStorage.setItem(localStorageName, JSON.stringify(listsData));
  setEdit(listNames.template);
  setManual(listNames.template);
  setList(listNames.template);
}

function tabShoppingHandler() {
  DOMNodes.shoppingTabButton.classList.add('active');
  DOMNodes.templateTabButton.classList.remove('active');
  listsData.activeList = listNames.shopping;
  localStorage.setItem(localStorageName, JSON.stringify(listsData));
  setEdit(listNames.shopping);
  setManual(listNames.shopping);
  setList(listNames.shopping);
}

function setManual(activeList) {
  const text = listsData.manual[activeList];
  DOMNodes.manual.innerHTML = text;
}

function setList(activeList) {
  if (activeList === listNames.template) {
    DOMNodes.templateList.classList.remove('hidden');
    DOMNodes.shoppingList.classList.add('hidden');
  } else {
    DOMNodes.templateList.classList.add('hidden');
    DOMNodes.shoppingList.classList.remove('hidden');
  }
}

init();
