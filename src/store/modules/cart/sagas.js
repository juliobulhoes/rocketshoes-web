import { call, put, all, takeLatest, select } from 'redux-saga/effects';
import { css } from 'glamor';
import { toast } from 'react-toastify';

import api from '../../../services/api';
import history from '../../../services/history';
import { formatPrice } from '../../../util/format';

import {
  addToCartSuccess,
  updateAmountSuccess,
  updateAmountFailure,
} from './actions';

const ToastStyle = {
  className: css({
    background: '#7159c1',
  }),
  bodyClassName: css({
    fontSize: '18px',
    color: '#eee',
  }),
  progressClassName: css({
    background: '#eee',
  }),
  closeButton: false,
};

function* addToCart({ id }) {
  const productExists = yield select(state =>
    state.cart.products.find(p => p.id === id)
  );

  const stock = yield call(api.get, `/stock/${id}`);

  const stockAmount = stock.data.amount;
  const currentAmount = productExists ? productExists.amount : 0;

  const amount = currentAmount + 1;

  if (amount > stockAmount) {
    toast('Quantidade solicitada fora de estoque', ToastStyle);
    yield put(updateAmountFailure(id));
    return;
  }

  if (productExists) {
    yield put(updateAmountSuccess(id, amount));
  } else {
    const response = yield call(api.get, `/products/${id}`);

    const data = {
      ...response.data,
      amount: 1,
      priceFormatted: formatPrice(response.data.price),
    };

    yield put(addToCartSuccess(data));
    history.push('/cart');
  }
}

function* updateAmount({ id, amount }) {
  if (amount <= 0) return;

  const stock = yield call(api.get, `/stock/${id}`);
  const stockAmount = stock.data.amount;

  if (amount > stockAmount) {
    toast('Quantidade solicitada fora de estoque', ToastStyle);
    return;
  }

  yield put(updateAmountSuccess(id, amount));
}

export default all([
  takeLatest('@cart/ADD_REQUEST', addToCart),
  takeLatest('@cart/UPDATE_AMOUNT_REQUEST', updateAmount),
]);
