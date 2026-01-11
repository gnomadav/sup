// ShopPage.jsx
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { LondonTime } from '../../store/LondonTime';
import { fetchProd } from '../../store/shopSlice';
import './ShopPage.css';

export const ShopPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { products, status } = useSelector((state) => state.shop);
    
    const [currentPage, setCurrentPage] = useState(() => {
        const savedPage = sessionStorage.getItem('shopCurrentPage');
        return savedPage ? parseInt(savedPage) : 1;
    });

    console.log("Status:", status);
    console.log("Products:", products);
    console.log("Is Array?", Array.isArray(products));

    const itemsPerPage = 9;

    useEffect(() => {
        if (status === "idle") {
            dispatch(fetchProd());
        }
    }, [status, dispatch]);

    // Показываем загрузку ИЛИ если products не массив
    if (status === "loading") {
        return (
            <div className="shop-page">
                <div className="london-time">
                    <LondonTime />
                </div>
                <div className="loading-container">
                    <h2>Loading products...</h2>
                </div>
            </div>
        );
    }

    // Проверка на пустой массив
    if (products.length === 0) {
        return (
            <div className="shop-page">
                <div className="london-time">
                    <LondonTime />
                </div>
                <div className="loading-container">
                    <h2>No products found</h2>
                </div>
            </div>
        );
    }
    
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentProducts = products.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(products.length / itemsPerPage);

    const ProductClick = (productId) => {
        sessionStorage.setItem('shopCurrentPage', currentPage.toString());
        navigate(`/Card/${productId}`);
    }

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        sessionStorage.setItem('shopCurrentPage', pageNumber.toString());
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            const newPage = currentPage - 1;
            setCurrentPage(newPage);
            sessionStorage.setItem('shopCurrentPage', newPage.toString());
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            const newPage = currentPage + 1;
            setCurrentPage(newPage);
            sessionStorage.setItem('shopCurrentPage', newPage.toString());
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const getPageNumbers = () => {
        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
            pages.push(i);
        }
        return pages;
    };

    return(
        <div className="shop-page">
            <div className="london-time">
                <LondonTime />
            </div>
            
            <h1>Shop - Page {currentPage} of {totalPages}</h1>
            
            <div className="products">
                {currentProducts.map(product => (
                    <div 
                        key={product.id} 
                        className="product-card"
                        onClick={() => ProductClick(product.id)}
                    >
                        <img src={product.picture} alt={product.name} />
                        <h3>{product.name}</h3>
                        <p>${product.price}</p>
                    </div>
                ))}
            </div>

            {totalPages > 1 && (
                <div className="pagination">
                    <button 
                        onClick={handlePrevPage}
                        disabled={currentPage === 1}
                        className="pagination-btn"
                    >
                        ← Prev
                    </button>

                    {getPageNumbers().map(number => (
                        <button
                            key={number}
                            onClick={() => handlePageChange(number)}
                            className={`pagination-btn ${currentPage === number ? 'active' : ''}`}
                        >
                            {number}
                        </button>
                    ))}

                    <button 
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                        className="pagination-btn"
                    >
                        Next →
                    </button>
                </div>
            )}
        </div>
    )
}