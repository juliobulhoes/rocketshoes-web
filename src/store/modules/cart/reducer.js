import produce from 'immer';

export default function cart(
  state = { products: [], addingProducts: [] },
  action
) {
  switch (action.type) {
    case '@cart/ADD_REQUEST':
      return produce(state, draft => {
        draft.addingProducts.push(action.id);
      });

    case '@cart/ADD_SUCCESS':
      return produce(state, draft => {
        const { product } = action;
        draft.products.push(product);

        const addingIndex = draft.addingProducts.indexOf(product.id);

        if (addingIndex >= 0) {
          draft.addingProducts.splice(addingIndex, 1);
        }
      });

    case '@cart/REMOVE':
      return produce(state, draft => {
        const productIndex = draft.products.findIndex(p => p.id === action.id);

        if (productIndex >= 0) {
          draft.products.splice(productIndex, 1);
        }
      });

    case '@cart/UPDATE_AMOUNT_SUCCESS': {
      return produce(state, draft => {
        const productIndex = draft.products.findIndex(p => p.id === action.id);

        if (productIndex >= 0) {
          draft.products[productIndex].amount = Number(action.amount);
        }

        const addingIndex = draft.addingProducts.indexOf(action.id);

        if (addingIndex >= 0) {
          draft.addingProducts.splice(addingIndex, 1);
        }
      });
    }

    case '@cart/UPDATE_AMOUNT_FAILURE': {
      return produce(state, draft => {
        const addingIndex = draft.addingProducts.indexOf(action.id);

        if (addingIndex >= 0) {
          draft.addingProducts.splice(addingIndex, 1);
        }
      });
    }

    default:
      return state;
  }
}
