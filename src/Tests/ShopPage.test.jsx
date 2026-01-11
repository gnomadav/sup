import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import shopReducer from '../store/shopSlice';
import { ShopPage } from '../pages/Shop/ShopPage';

vi.mock('../store/LondonTime', () => ({
    LondonTime: () => <div>Mocked LondonTime</div>,
}));

const createTestStore = (initialState = {}) => {
    return configureStore({
        reducer: {
            shop: shopReducer,
        },
        preloadedState: {
            shop: {
                products: [],
                cart: [],
                selectedProduct: null,
                status: 'idle',
                ...initialState,
            },
        },
    });
};

const renderWithProviders = (component, { initialState = {} } = {}) => {
    const store = createTestStore(initialState);
    
    return {
        store,
        ...render(
            <Provider store={store}>
                <BrowserRouter>
                    {component}
                </BrowserRouter>
            </Provider>
        ),
    };
};

describe('ShopPage', () => {
    beforeEach(() => {
        sessionStorage.clear();
    });

    it('должен показывать загрузку когда статус loading', () => {
        renderWithProviders(<ShopPage />, {
            initialState: { status: 'loading' },
        });
        
        expect(screen.getByText('Loading products...')).toBeInTheDocument();
    });

    it('должен показывать сообщение когда товаров нет', () => {
        renderWithProviders(<ShopPage />, {
            initialState: { status: 'succeeded', products: [] },
        });
        
        expect(screen.getByText('No products found')).toBeInTheDocument();
    });

    it('должен отображать товары после загрузки', () => {
        const products = [
            { id: 1, name: 'Product 1', price: 100, picture: 'test.jpg' },
            { id: 2, name: 'Product 2', price: 200, picture: 'test2.jpg' },
        ];
        
        renderWithProviders(<ShopPage />, {
            initialState: { status: 'succeeded', products },
        });
        
        expect(screen.getByText('Product 1')).toBeInTheDocument();
        expect(screen.getByText('Product 2')).toBeInTheDocument();
    });

    it('должен отображать правильные цены', () => {
        const products = [
            { id: 1, name: 'Product 1', price: 100, picture: 'test.jpg' },
        ];
        
        renderWithProviders(<ShopPage />, {
            initialState: { status: 'succeeded', products },
        });
        
        expect(screen.getByText('$100')).toBeInTheDocument();
    });

    it('должен показывать пагинацию когда товаров больше 9', () => {
        const products = Array.from({ length: 15 }, (_, i) => ({
            id: i + 1,
            name: `Product ${i + 1}`,
            price: 100,
            picture: 'test.jpg',
        }));
        
        renderWithProviders(<ShopPage />, {
            initialState: { status: 'succeeded', products },
        });
        
        expect(screen.getByText('← Prev')).toBeInTheDocument();
        expect(screen.getByText('Next →')).toBeInTheDocument();
    });

    it('должен отображать правильный номер страницы', () => {
        const products = Array.from({ length: 15 }, (_, i) => ({
            id: i + 1,
            name: `Product ${i + 1}`,
            price: 100,
            picture: 'test.jpg',
        }));
        
        renderWithProviders(<ShopPage />, {
            initialState: { status: 'succeeded', products },
        });
        
        expect(screen.getByText(/Shop - Page 1 of 2/)).toBeInTheDocument();
    });

    it('кнопка Prev должна быть disabled на первой странице', () => {
        const products = Array.from({ length: 15 }, (_, i) => ({
            id: i + 1,
            name: `Product ${i + 1}`,
            price: 100,
            picture: 'test.jpg',
        }));
        
        renderWithProviders(<ShopPage />, {
            initialState: { status: 'succeeded', products },
        });
        
        const prevButton = screen.getByText('← Prev');
        expect(prevButton).toBeDisabled();
    });

    it('должен сохранять номер страницы в sessionStorage', async () => {
        const products = Array.from({ length: 15 }, (_, i) => ({
            id: i + 1,
            name: `Product ${i + 1}`,
            price: 100,
            picture: 'test.jpg',
        }));
        
        renderWithProviders(<ShopPage />, {
            initialState: { status: 'succeeded', products },
        });
        
        const nextButton = screen.getByText('Next →');
        fireEvent.click(nextButton);
        
        await waitFor(() => {
            expect(sessionStorage.getItem('shopCurrentPage')).toBe('2');
        });
    });

    it('должен восстанавливать номер страницы из sessionStorage', () => {
        sessionStorage.setItem('shopCurrentPage', '2');
        
        const products = Array.from({ length: 15 }, (_, i) => ({
            id: i + 1,
            name: `Product ${i + 1}`,
            price: 100,
            picture: 'test.jpg',
        }));
        
        renderWithProviders(<ShopPage />, {
            initialState: { status: 'succeeded', products },
        });
        
        expect(screen.getByText(/Shop - Page 2 of 2/)).toBeInTheDocument();
    });
});