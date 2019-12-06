import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { MdAddShoppingCart } from 'react-icons/md';
import { formatPrice } from '../../util/format';
import api from '../../services/api';

import * as CartActions from '../../store/modules/cart/actions';

import { ProductList, LoadingContainer, LoadingSvg } from './sytles';

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      products: [],
      loading: false,
    };
  }

  async componentDidMount() {
    this.setState({ loading: true });
    const response = await api.get('products');

    const data = response.data.map(product => ({
      ...product,
      priceFormatted: formatPrice(product.price),
    }));

    this.setState({ products: data, loading: false });
  }

  handleAddProduct = id => {
    const { addToCartRequest } = this.props;

    addToCartRequest(id);
  };

  render() {
    const { products, loading } = this.state;
    const { amountInCart, addingProducts } = this.props;

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
              onClick={() => this.handleAddProduct(product.id)}
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
}

const mapStateToProps = state => ({
  amountInCart: state.cart.products.reduce((amount, product) => {
    amount[product.id] = product.amount;

    return amount;
  }, {}),
  addingProducts: state.cart.addingProducts,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(CartActions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Home);
