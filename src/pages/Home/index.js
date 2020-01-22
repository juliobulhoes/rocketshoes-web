import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MdAddShoppingCart } from 'react-icons/md';
import { formatPrice } from '../../util/format';
import api from '../../services/api';

import * as CartActions from '../../store/modules/cart/actions';

import { ProductList, LoadingContainer, LoadingSvg } from './sytles';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const amountInCart = useSelector(state =>
    state.cart.products.reduce((amount, product) => {
      amount[product.id] = product.amount;

      return amount;
    }, {})
  );

  const addingProducts = useSelector(state => state.cart.addingProducts);

  const dispatch = useDispatch();

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      const response = await api.get('products');

      const data = response.data.map(product => ({
        ...product,
        priceFormatted: formatPrice(product.price),
      }));

      setProducts(data);
      setLoading(false);
    }
    loadProducts();
  }, []);

  function handleAddProduct(id) {
    dispatch(CartActions.addToCartRequest(id));
  }

  if (loading) {
    return (
      <LoadingContainer>
        Carregando a lista de produtos
        <LoadingSvg size={60} color="#fff" />
      </LoadingContainer>
    );
  }

  return (
    <ProductList>
      {products.map(product => (
        <li key={product.id}>
          <img src={product.image} alt={product.title} />
          <strong>{product.title}</strong>
          <span>{product.priceFormatted}</span>

          <button
            type="button"
            onClick={() => handleAddProduct(product.id)}
            disabled={addingProducts.includes(product.id)}
          >
            <div>
              {addingProducts.includes(product.id) ? (
                <LoadingSvg size={16} color="#fff" />
              ) : (
                <MdAddShoppingCart size={16} color="#fff" />
              )}
              {amountInCart[product.id] || 0}
            </div>

            <span>ADICIONAR AO CARRINHO</span>
          </button>
        </li>
      ))}
    </ProductList>
  );
}
