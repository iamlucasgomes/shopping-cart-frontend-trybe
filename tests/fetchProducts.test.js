require('../mocks/fetchSimulator');
const { fetchProducts } = require('../helpers/fetchProducts');
const computadorSearch = require('../mocks/search');

describe('1 - Teste a função fetchProducts', () => {
  it('Test if fetchProducts is a function', () =>{
    expect(typeof fetchProducts).toBe('function');
  })
  it('Execute a função fetchProducts com o argumento computador e teste se fetch foi chamada;', async () => {
    await fetchProducts('computador')
    expect(fetch).toHaveBeenCalledTimes(1);
  })
  it('Teste se, ao chamar a função fetchProducts com o argumento computador, a função fetch utiliza o endpoint https://api.mercadolibre.com/sites/MLB/search?q=computador;', async () => {
    await fetchProducts('computador');
    const endpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
    expect(fetch).toHaveBeenCalledWith(endpoint);
  })
  it('Teste se o retorno da função fetchProducts com o argumento computador é uma estrutura de dados igual ao objeto computadorSearch, que já está importado no arquivo.,', async () => {
   const fetchProducts = await fetchProducts('computador')
   expect(fetchProducts).toEqual(computadorSearch)
  })
  it('Teste se, ao chamar a função fetchProducts sem argumento, retorna um erro com a mensagem: You must provide an url.', async () => {
    const paramVoid = await fetchProducts()
    expect(paramVoid).toThrowError(new Error('You must provide an url'));
  })

});
