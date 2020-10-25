import React, { useEffect, useState } from "react";
import { connect } from 'react-redux';
import { idbPromise } from "../utils/helpers";
import { Link, useParams } from "react-router-dom";
import { useQuery } from '@apollo/react-hooks';

import Cart from '../components/Cart';

import {
  removeFromCart,
  updateCartQuantity,
  addToCart,
  updateProducts,
} from '../utils/actions';

import { QUERY_PRODUCTS } from "../utils/queries";
import spinner from '../assets/spinner.gif';

const mapStateToProps = state => {
  return {
    products: state.products,
    cart: state.cart
  }
}

function Detail({ products, cart, dispatch }) {
  const { id } = useParams();

  const [currentProduct, setCurrentProduct] = useState({})

  const { loading, data } = useQuery(QUERY_PRODUCTS);

  console.log(products, cart);

  useEffect(() => {
    // already in global store
    if (products.length) {
      setCurrentProduct(products.find(product => product._id === id));
    } 
    // retrieved from server
    else if (data) {
      dispatch(updateProducts(data.products));
  
      data.products.forEach((product) => {
        idbPromise('products', 'put', product);
      });
    }
    // get cache from idb
    else if (!loading) {
      idbPromise('products', 'get').then((indexedProducts) => {
        dispatch(updateProducts(indexedProducts));
      });
    }
  }, [products, data, loading, id, dispatch]);

  const addToClientCart = () => {
    const itemInCart = cart.find((cartItem) => cartItem._id === id)
  
    if (itemInCart) {
      dispatch(updateCartQuantity({ _id: id, purchaseQuantity: parseInt(itemInCart.purchaseQuantity) + 1 }));
      // if we're updating quantity, use existing item data and increment purchaseQuantity value by one
      idbPromise('cart', 'put', {
        ...itemInCart,
        purchaseQuantity: parseInt(itemInCart.purchaseQuantity) + 1
      });
    } else {
      dispatch(addToCart({ ...currentProduct, purchaseQuantity: 1 }));
      // if product isn't in the cart yet, add it to the current shopping cart in IndexedDB
      idbPromise('cart', 'put', { ...currentProduct, purchaseQuantity: 1 });
    }
  }

  const removeFromClientCart = () => {
    dispatch(removeFromCart(currentProduct._id));

    // upon removal from cart, delete the item from IndexedDB using the `currentProduct._id` to locate what to remove
    idbPromise('cart', 'delete', { ...currentProduct });
  };

  return (
    <>
      {currentProduct ? (
        <div className="container my-1">
          <Link to="/">
            ← Back to Products
          </Link>

          <h2>{currentProduct.name}</h2>

          <p>
            {currentProduct.description}
          </p>

          <p>
            <strong>Price:</strong>
            ${currentProduct.price}
            {" "}
            <button onClick={addToClientCart}>
              Add to Cart
            </button>
            <button 
              disabled={!cart.find(p => p._id === currentProduct._id)} 
              onClick={removeFromClientCart}
            >
              Remove from Cart
            </button>
          </p>

          <img
            src={`/images/${currentProduct.image}`}
            alt={currentProduct.name}
          />
          <Cart />
        </div>
      ) : null}
      {
        loading ? <img src={spinner} alt="loading" /> : null
      }
    </>
  );
};

export default connect(mapStateToProps)(Detail); // Container/component in one.
