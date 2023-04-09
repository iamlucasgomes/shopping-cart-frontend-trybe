const sectionItem = document.querySelector('.items');
const cartItems = document.querySelector('.cart__items');
const emptyBtn = document.querySelector('.empty-cart');
const totalPrice = document.querySelector('.total-price');
const preloader = document.querySelector('.loading');
let initialPrice = 0;

const removeLoader = () => {
  preloader.remove();
};

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
  
  const addToCartButton = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  addToCartButton.addEventListener('click', async (event) => {
    const { id: sku, title: name, price: salePrice, thumbnail: image } = await fetchItem(
      getSkuFromProductItem(event.target.parentElement)
    );
    addToCart({sku, name, salePrice, image});
  });
  section.appendChild(addToCartButton);

  return section;
};

const getSkuFromProductItem = (item) => item.querySelector('span.item__sku').innerText;

const cartItemClickListener = (event) => {
  if (event.target.classList.contains('remove__item')) {
    const cartItem = event.target.parentNode;
    const priceElement = cartItem.querySelector('.price');
    const price = parseFloat(priceElement.innerText);
    removeFromCart(cartItem);
  }
};

const createCartItemElement = ({ sku, name, salePrice, image }) => {
  const cartItem = document.createElement('li');
  cartItem.className = 'cart__item';
  cartItem.innerHTML = `<img class='img_item_cart' src="${image}"><div class='descriptionItem'>${name}<p>
  <span class='price'>${salePrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span></div>`;
  
  const removeBtn = createCustomElement('button', 'remove__item', 'X');
  removeBtn.addEventListener('click', () => {
    removeFromCart(cartItem);
  });
  cartItem.appendChild(removeBtn);
  cartItem.addEventListener('click', cartItemClickListener);
  return cartItem;
};

const showProducts = async () => {
  const { results } = await fetchProducts('games');
  results.forEach(({ id: sku, title: name, thumbnail: image }) =>
    sectionItem.appendChild(createProductItemElement({ sku, name, image })));
};

const addToCart = ({ sku, name, salePrice, image }) => {
  cartItems.appendChild(createCartItemElement({ sku, name, salePrice, image }));
  const price = parseInt(cartItems.querySelector('.price').innerText.replace(/\D/g, '')) / 100;
  initialPrice = initialPrice + price;
  totalPrice.innerHTML = `Subtotal: <span class='price'>${initialPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>`;
  saveCartItems(cartItems.innerHTML);
  saveTotalPrice(totalPrice.innerHTML);
};

const removeFromCart = (cartItem) => {
  initialPrice = Array.from(cartItems.children).reduce((total, item) => {
    if (item !== cartItem) {
      const itemPriceInCents = parseInt(item.querySelector('.price').innerText.replace(/\D/g, ''));
      return total + itemPriceInCents;
    }
    return total;
  }, 0);
  const newTotalPrice = (initialPrice / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL'});
  totalPrice.innerHTML = `Subtotal: <span class='price'>${newTotalPrice}</span>`;
  cartItem.remove();
  saveCartItems(cartItems.innerHTML);
  saveTotalPrice(totalPrice.innerHTML);
}

const emptyCart = async () => emptyBtn.addEventListener('click', () => {
  const cartSection = document.querySelectorAll('.cart__item');
  cartSection.forEach((list) => list.remove());
  localStorage.removeItem('cartItems');
  initialPrice = 0; 
  totalPrice.innerHTML = `Subtotal: <span class='price'>${initialPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>`;
  localStorage.removeItem('totalPrice');
});

const calls = async () => {
  await showProducts();
  emptyCart();
};
calls();
window.onload = () => {
  cartItems.innerHTML = getSavedCartItems();
  totalPrice.innerHTML = getTotalPrice();
  const cartItem = document.querySelectorAll('.cart__item');
  cartItem.forEach((list) => list.addEventListener('click', cartItemClickListener));
  removeLoader();
};
