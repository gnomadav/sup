import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart, fetchProd } from '../../store/shopSlice';
import './ProductCard.css';

export const Card = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { products, status } = useSelector((state) => state.shop);
    const [selectedSize, setSelectedSize] = useState('');

    // Загружаем товары из API, а не из mockProducts
    useEffect(() => {
        if (status === "idle") {
            dispatch(fetchProd());
        }
    }, [status, dispatch]);

    // Показываем загрузку пока товары не загрузились
    if (status === "loading") {
        return (
            <div className="card-page">
                <div className="loading-container">
                    <h2>Loading...</h2>
                </div>
            </div>
        );
    }

    const product = products.find(p => p.id === parseInt(id));

    if (!product) {
        return (
            <div className="card-page">
                <div className="not-found-container">
                    <h2>Product not found</h2>
                    <button className="back-button" onClick={() => navigate('/shop')}>
                        Back to Shop
                    </button>
                </div>
            </div>
        );
    }

    const AddToCart = () => {
        if (!selectedSize) {
            alert('Please select a size');
            return;
        }
        
        console.log('Adding to cart:', { ...product, size: selectedSize });
        dispatch(addToCart({ ...product, size: selectedSize }));
        
        const goToCart = window.confirm('Item added to cart! Go to cart?');
        if (goToCart) {
            navigate('/cart');
        }
    };

    return(
        <div className="card-page">
            <button className="back-button" onClick={() => navigate('/shop')}>
                ← Back to Shop
            </button>
            
            <div className="product-detail">
                <div className="product-image-container">
                    <img src={product.picture} alt={product.name} className="product-main-image" />
                </div>
                
                <div className="product-info">
                    <h1 className="product-title">{product.name}</h1>
                    <p className="product-price">${product.price}</p>
                    <p className="product-category">{product.category}</p>
                    
                    <div className="product-section">
                        <h3>Description</h3>
                        <p className="product-description">{product.description}</p>
                    </div>

                    <div className="product-section">
                        <h3>Color</h3>
                        <p className="product-color">{product.color}</p>
                    </div>

                    <div className="product-section">
                        <h3>Select Size</h3>
                        <div className="size-selector">
                            {product.sizes.map(size => (
                                <button
                                    key={size}
                                    className={`size-button ${selectedSize === size ? 'selected' : ''}`}
                                    onClick={() => setSelectedSize(size)}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button className="add-to-cart-btn" onClick={AddToCart}>
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    )
}