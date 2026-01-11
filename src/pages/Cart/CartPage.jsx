// CartPage.jsx
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { removeFromCart, updateQuantity, clearCart } from '../../store/shopSlice';
import './CartPage.css';

export const CartPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { cart } = useSelector((state) => state.shop);
    const [removingItems, setRemovingItems] = useState([]);

    const handleRemove = (id, index) => {
        // Добавляем индекс в список удаляемых для анимации
        setRemovingItems(prev => [...prev, index]);
        
        // Удаляем из Redux после анимации
        setTimeout(() => {
            dispatch(removeFromCart(id));
            setRemovingItems(prev => prev.filter(i => i !== index));
        }, 600); // Увеличена длительность анимации для плавности
    };

    const handleQuantityChange = (index, newQuantity) => {
        dispatch(updateQuantity({ index, quantity: newQuantity }));
    };

    const calculateTotal = () => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
    };

    const handleCheckout = () => {
        alert('Proceeding to checkout...');
        // Здесь будет логика оформления заказа
    };

    const handleClearCart = () => {
        if (window.confirm('Are you sure you want to clear the cart?')) {
            dispatch(clearCart());
        }
    };

    console.log(cart);
    
    if (cart.length === 0) {
        return (
            <div className="cart-page">
                <div className="empty-cart">
                    <h1>Your Cart is Empty</h1>
                    <p>Add some items to get started</p>
                    <button className="continue-shopping" onClick={() => navigate('/shop')}>
                        Continue Shopping
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page">
            <div className="cart-header">
                <h1>Shopping Cart</h1>
                <button className="clear-cart-btn" onClick={handleClearCart}>
                    Clear Cart
                </button>
            </div>

            <div className="cart-content">
                <div className="cart-items">
                    {cart.map((item, index) => (
                        <div 
                            key={index} 
                            className={`cart-item ${removingItems.includes(index) ? 'removing' : ''}`}
                        >
                            <div className="item-image">
                                <img src={item.picture} alt={item.name} />
                            </div>

                            <div className="item-details">
                                <h3>{item.name}</h3>
                                <p className="item-category">{item.category}</p>
                                <p className="item-size">Size: {item.size}</p>
                                <p className="item-color">Color: {item.color}</p>
                            </div>

                            <div className="item-quantity">
                                <button 
                                    onClick={() => handleQuantityChange(index, item.quantity - 1)}
                                    disabled={item.quantity <= 1}
                                >
                                    -
                                </button>
                                <span>{item.quantity}</span>
                                <button onClick={() => handleQuantityChange(index, item.quantity + 1)}>
                                    +
                                </button>
                            </div>

                            <div className="item-price">
                                <p className="price">${item.price}</p>
                                <p className="subtotal">${(item.price * item.quantity).toFixed(2)}</p>
                            </div>

                            <button 
                                className="remove-btn" 
                                onClick={() => handleRemove(item.id, index)}
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>

                <div className="cart-summary">
                    <h2>Order Summary</h2>
                    
                    <div className="summary-row">
                        <span>Subtotal:</span>
                        <span>${calculateTotal()}</span>
                    </div>
                    
                    <div className="summary-row">
                        <span>Shipping:</span>
                        <span>Free</span>
                    </div>
                    
                    <div className="summary-row total">
                        <span>Total:</span>
                        <span>${calculateTotal()}</span>
                    </div>

                    <button className="checkout-btn" onClick={handleCheckout}>
                        Proceed to Checkout
                    </button>

                    <button className="continue-shopping" onClick={() => navigate('/shop')}>
                        Continue Shopping
                    </button>
                </div>
            </div>
        </div>
    );
};