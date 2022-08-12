const saveCartItems = (value) => localStorage.setItem('cartItems', value);

if (typeof module !== 'undefined') {
  module.exports = saveCartItems;
}
