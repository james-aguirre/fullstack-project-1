import './CartPage.css';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import AppContext from '../components/AppContext';
import { useContext } from 'react';
import { fetchCartItems } from '../lib/api';
import { useEffect, useState } from 'react';
import Loading from './LoadingPage';
import { removeAllItems, removeItem } from '../lib/api';

export default function CartPage() {
  const { user } = useContext(AppContext);
  const [cart, setCart] = useState();
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState();
  const [isRemoved, setIsRemoved] = useState(false);
  const cartId = user.customerId;
  let total = 0;
  let items = 0;

  useEffect(() => {
    async function loadCart(cartId) {
      try {
        const cart = await fetchCartItems(cartId);
        if (!cart) return setCart(null);
        setCart(cart);
      } catch (e) {
        setError(e);
      } finally {
        setIsLoading(false);
      }
    }
    setIsLoading(true);
    loadCart(cartId);
  }, [cartId]);
  if (isLoading) return <Loading />;
  if (error) {
    return <div>`Error Loading Cart: ${error.message}`</div>;
  }
  if (!cart) return null;
  // loops through the cart array to calculate the customers subtotal && quantity of items
  cart.map((e) => {
    total += e.price * e.quantity;
    items += 1 * e.quantity;
    return total && items;
  });
  async function handleRemoveAllItems(cartId) {
    try {
      await removeAllItems(cartId);
      setCart(await fetchCartItems(cartId));
      setIsRemoved(true);
    } catch (e) {
      setError(e);
    }
  }
  async function handleRemoveItem(cartId, productId) {
    try {
      await removeItem(cartId, productId);
      setCart(await fetchCartItems(cartId));
      setIsRemoved(true);
    } catch (e) {
      setError(e);
    }
  }
  return (
    <Container className="body" fluid>
      <Container className="cart-container" fluid>
        <Col className="cart-header">
          <h3 className="cart-h3">My Cart</h3>
          {cart[0] && (
            <p className="action" onClick={handleRemoveAllItems}>
              Remove all
            </p>
          )}
        </Col>
        {cart?.map((product) => {
          return (
            <Col className="cart-items" key={product.productId}>
              <CartItem product={product} />
              <Col className="prices">
                <Col className="amount">${product.price}</Col>
                {!isRemoved && (
                  <Col
                    className="remove"
                    onClick={() =>
                      handleRemoveItem(user.customerId, product.productId)
                    }>
                    Remove
                  </Col>
                )}
              </Col>
            </Col>
          );
        })}
        <div className="hr">
          <div className="checkout">
            <div className="total">
              <div>
                <div className="Subtotal">Sub-Total</div>
                <div className="items">{items} items</div>
              </div>
              <div className="total-amount">${total.toFixed(2)}</div>
            </div>
            <Button className="button">Checkout</Button>
          </div>
        </div>
      </Container>
    </Container>
  );
}

function CartItem({ product }) {
  const { productName, quantity, imageUrl } = product;
  return (
    <>
      <Image className="img-preview" src={imageUrl} thumbnail />
      <Col className="product-name">
        <h3>{productName}</h3>
      </Col>
      <Col>
        <h4>{quantity}</h4>
      </Col>
    </>
  );
}
