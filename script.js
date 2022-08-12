const sectionItem = document.querySelector('.items');
const cartItems = document.querySelector('.cart__items');
const emptyBtn = document.querySelector('.empty-cart');

const createProductImageElement = (imageSource) => {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
};

const createCustomElement = (element, className, innerText) => {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
};

const createProductItemElement = ({ sku, name, image }) => {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
};

const getSkuFromProductItem = (item) => item.querySelector('span.item__sku').innerText;

const cartItemClickListener = (event) => {
  event.target.remove();
};

const createCartItemElement = ({ sku, name, salePrice }) => {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
};

const showProducts = async () => {
  const { results } = await fetchProducts('computador');
  results.forEach(({ id: sku, title: name, thumbnail: image }) =>
    sectionItem.appendChild(createProductItemElement({ sku, name, image })));
};

const addCart = async () => {
  const btnsAddCart = document.querySelectorAll('.item__add');
  btnsAddCart.forEach((element) => element
    .addEventListener('click', async (event) => {
      const { id: sku, title: name, price: salePrice } = await fetchItem(getSkuFromProductItem(event
        .target.parentElement));
      cartItems.appendChild(createCartItemElement({ sku, name, salePrice }));
      saveCartItems(cartItems.innerHTML);
    }));
};

const emptyCart = async () => emptyBtn.addEventListener('click', () => {
  const cartSection = document.querySelectorAll('.cart__item');
  cartSection.forEach((list) => list.remove());
  localStorage.removeItem('cartItems');
});

const calls = async () => {
  await showProducts();
  await addCart();
  emptyCart();
};
calls();

window.onload = () => {
  cartItems.innerHTML = getSavedCartItems();
  const cartItem = document.querySelectorAll('.cart__item');
  cartItem.forEach((list) => list.addEventListener('click', cartItemClickListener)); 
};
