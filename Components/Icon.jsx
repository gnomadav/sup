import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './Icon.css';

export const CartIcon = () => {
    const navigate = useNavigate();
    const { cart } = useSelector((state) => state.shop);
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    const handleClick = () => {
        navigate('/cart');
    };

    return (
        <div className="cart-icon" onClick={handleClick}>
            <svg 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="black" 
                xmlns="https://www.svgrepo.com/show/80543/shopping-cart-outline.svg"
            >
                <path 
                    d="M9 2L7.17 4H3C1.9 4 1 4.9 1 6V18C1 19.1 1.9 20 3 20H21C22.1 20 23 19.1 23 18V6C23 4.9 22.1 4 21 4H16.83L15 2H9ZM3 6H21V18H3V6ZM12 8C9.79 8 8 9.79 8 12C8 14.21 9.79 16 12 16C14.21 16 16 14.21 16 12C16 9.79 14.21 8 12 8Z" 
                />
            </svg>
            {totalItems > 0 && (
                <span className="cart-badge">{totalItems}</span>
            )}
        </div>
    );
};