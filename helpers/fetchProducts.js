const fetchProducts = async (QUERY) => {
  try {
    const endpoint = `https://api.mercadolibre.com/sites/MLB/search?q=${QUERY}`;
    const response = await fetch(endpoint);
    const data = await response.json();
    return data;
  } catch (error) {
    if (!QUERY) {
      return new Error('You must provide an url');
    }
    return error.message;
  }
};

if (typeof module !== 'undefined') {
  module.exports = {
    fetchProducts,
  };
}
