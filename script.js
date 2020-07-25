const localStorageName = 'listsData';

/*
  template: [{
    id: 1544234234234,
    inputId: 'input-1544234234234',
    name: 'Молоко',
  }]
*/

let listsData = {
  shopping: [],
  template: [],
};

let isEditMode = false;

const DOMNodes = {
  templateList: document.querySelector('.template ul'),
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
    deleteListItem(productData);
  });

  return newProduct;
}

// создание и добавление разметки всего списка
function createList() {
  DOMNodes.templateList.innerHTML = '';
  const productListData = listsData.template;
  const listLayout = productListData.map((productData) => createTemplateProduct(productData));
  DOMNodes.templateList.append(...listLayout);
}

function addProduct(name) {
  const id = new Date().getTime().toString();
  const newProductData = {
    name: name,
    id: id,
    inputId: 'input-' + id,
  };

  listsData.template.push(newProductData);
  localStorage.setItem(localStorageName, JSON.stringify(listsData));

  createList();
  setEditModeListItems(isEditMode);
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
      checkbox.classList.add('disabled');
      removeButton.classList.remove('hidden');
    } else {
      checkbox.classList.remove('disabled');
      removeButton.classList.add('hidden');
    }
  });
}

function deleteListItem(productToDelete) {
  const index = listsData.template.findIndex((product) => {
    if (productToDelete.id === product.id) return true;
  });

  listsData.template.splice(index, 1);
  localStorage.setItem(localStorageName, JSON.stringify(listsData));

  createList();
  setEditModeListItems(isEditMode);
}

function init() {
  const dataFromLocalStorage = localStorage.getItem(localStorageName);
  if (dataFromLocalStorage) {
    listsData = JSON.parse(dataFromLocalStorage);
  }

  createList();

  DOMNodes.plusButton.addEventListener('click', plusButtonHandler);
  DOMNodes.plusInput.addEventListener('input', plusInputHandler);
  DOMNodes.editModeButton.addEventListener('click', toggleEditMode);
}

init();