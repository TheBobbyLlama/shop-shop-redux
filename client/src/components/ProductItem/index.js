import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { idbPromise, pluralize } from '../../utils/helpers'

import { addToCart, updateCartQuantity } from '../../utils/actions';

const mapStateToProps = state => {
	return {
	  cart: state.cart,
	}
}

function ProductItem({ image, name, _id, price,quantity, cart, dispatch }) {
  const addToClientCart = () => {
    const itemInCart = cart.find((cartItem) => cartItem._id === _id)
    if (itemInCart) {
      dispatch(updateCartQuantity({ _id: _id, purchaseQuantity: parseInt(itemInCart.purchaseQuantity) + 1 }));
      idbPromise('cart', 'put', {
        ...itemInCart,
        purchaseQuantity: parseInt(itemInCart.purchaseQuantity) + 1
      });
    } else {
      let product = { image, name, _id, price, quantity, purchaseQuantity: 1 };
      dispatch(addToCart(product));
      idbPromise('cart', 'put', product);
    }
  }

  return (
    <div className="card px-1 py-1">
      <Link to={`/products/${_id}`}>
        <img
          alt={name}
          src={`/images/${image}`}
        />
        <p>{name}</p>
      </Link>
      <div>
        <div>{quantity} {pluralize("item", quantity)} in stock</div>
        <span>${price}</span>
      </div>
      <button onClick={addToClientCart}>Add to cart</button>
    </div>
  );
}

export default connect(mapStateToProps)(ProductItem); // Container/component in one.
