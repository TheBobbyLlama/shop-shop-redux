import React, { useEffect } from "react";
import { connect } from 'react-redux';
import { useLazyQuery } from '@apollo/react-hooks';
import { toggleCart, addMultipleToCart } from "../../utils/actions";
import Auth from '../../utils/auth';
import { idbPromise } from "../../utils/helpers";
import { QUERY_CHECKOUT } from '../../utils/queries';
import { loadStripe } from '@stripe/stripe-js';
import CartItem from '../CartItem';
import './style.css';

const stripePromise = loadStripe('pk_test_TYooMQauvdEDq54NiTphI7jx');

const mapStateToProps = state => {
	return {
	  cart: state.cart,
	  cartOpen: state.cartOpen
	}
}

const Cart = ({ cart, cartOpen, dispatch }) => {
	const [getCheckout, { data }] = useLazyQuery(QUERY_CHECKOUT);

	useEffect(() => {
		async function getCart() {
		  const tmpCart = await idbPromise('cart', 'get');
		  dispatch(addMultipleToCart([...tmpCart]));
		};
	  
		if (!cart.length) {
		  getCart();
		}
	}, [cart.length, dispatch]);

	useEffect(() => {
		if (data) {
			stripePromise.then((res) => {
				res.redirectToCheckout({ sessionId: data.checkout.session });
			});
		}
	}, [data]);

	function toggleCartDisplay() {
		dispatch(toggleCart());
	}

	function calculateTotal() {
		let sum = 0;
		cart.forEach(item => {
			sum += item.price * item.purchaseQuantity;
		});
		return sum.toFixed(2);
	}

	function submitCheckout() {
		const productIds = [];
	  
		cart.forEach((item) => {
			for (let i = 0; i < item.purchaseQuantity; i++) {
				productIds.push(item._id);
			}
		});

		getCheckout({
			variables: { products: productIds }
		});
	}

	if (!cartOpen) {
		return (
			<div className="cart-closed" onClick={toggleCartDisplay}>
				<span
				role="img"
				aria-label="cart">🛒</span>
			</div>
		);
	}

	return (
		<div className="cart">
			<div className="close" onClick={toggleCartDisplay}>[close]</div>
			<h2>Shopping Cart</h2>
			{cart.length ? (
				<div>
				{cart.map(item => (
					<CartItem key={item._id} item={item} />
				))}
				<div className="flex-row space-between">
					<strong>Total: ${calculateTotal()}</strong>
					{
					Auth.loggedIn() ?
						<button onClick={submitCheckout}>
							Checkout
						</button>
						:
						<span>(log in to check out)</span>
					}
				</div>
				</div>
			) : (
				<h3>
				<span role="img" aria-label="shocked">
					😱
				</span>
				You haven't added anything to your cart yet!
				</h3>
			)}
			</div>
	);
};

export default connect(mapStateToProps)(Cart); // Container/component in one.