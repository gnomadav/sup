import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import shopReducer from '../store/shopSlice';
import { CartPage } from '../pages/Cart/CartPage';

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

describe('CartPage', () => {
    const mockCartItem = {
        id: 1,
        name: 'Test Product',
        price: 100,
        picture: 'test.jpg',
        category: 'T-Shirts',
        color: 'Red',
        size: 'M',
        quantity: 2,
    };

    it('должен показывать сообщение когда корзина пустая', () => {
        renderWithProviders(<CartPage />);
        
        expect(screen.getByText('Your Cart is Empty')).toBeInTheDocument();
        expect(screen.getByText('Add some items to get started')).toBeInTheDocument();
    });

    it('должен отображать товары в корзине', () => {
        renderWithProviders(<CartPage />, {
            initialState: { cart: [mockCartItem] },
        });
        
        expect(screen.getByText('Test Product')).toBeInTheDocument();
        expect(screen.getByText('T-Shirts')).toBeInTheDocument();
        expect(screen.getByText('Size: M')).toBeInTheDocument();
        expect(screen.getByText('Color: Red')).toBeInTheDocument();
    });

    it('должен правильно рассчитывать сумму', () => {
        renderWithProviders(<CartPage />, {
            initialState: { cart: [mockCartItem] },
        });
        
        expect(screen.getAllByText('$200.00')[0]).toBeInTheDocument();
    });

    it('должен увеличивать количество товара', async () => {
        const { store } = renderWithProviders(<CartPage />, {
            initialState: { cart: [mockCartItem] },
        });
        
        const plusButton = screen.getByText('+');
        fireEvent.click(plusButton);
        
        await waitFor(() => {
            const state = store.getState();
            expect(state.shop.cart[0].quantity).toBe(3);
        });
    });

    it('должен уменьшать количество товара', async () => {
        const { store } = renderWithProviders(<CartPage />, {
            initialState: { cart: [mockCartItem] },
        });
        
        const minusButton = screen.getByText('-');
        fireEvent.click(minusButton);
        
        await waitFor(() => {
            const state = store.getState();
            expect(state.shop.cart[0].quantity).toBe(1);
        });
    });

    it('кнопка минус должна быть disabled когда quantity = 1', () => {
        const item = { ...mockCartItem, quantity: 1 };
        
        renderWithProviders(<CartPage />, {
            initialState: { cart: [item] },
        });
        
        const minusButton = screen.getByText('-');
        expect(minusButton).toBeDisabled();
    });

    it('должен удалять товар из корзины', async () => {
        const { store } = renderWithProviders(<CartPage />, {
            initialState: { cart: [mockCartItem] },
        });
        
        const removeButton = screen.getByText('✕');
        fireEvent.click(removeButton);
        
        await waitFor(() => {
            const state = store.getState();
            expect(state.shop.cart).toHaveLength(0);
        }, { timeout: 1000 });
    });

    it('должен показывать подтверждение при очистке корзины', () => {
        const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);
        
        renderWithProviders(<CartPage />, {
            initialState: { cart: [mockCartItem] },
        });
        
        const clearButton = screen.getByText('Clear Cart');
        fireEvent.click(clearButton);
        
        expect(confirmSpy).toHaveBeenCalledWith('Are you sure you want to clear the cart?');
        confirmSpy.mockRestore();
    });

    it('должен очищать корзину при подтверждении', async () => {
        const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
        
        const { store } = renderWithProviders(<CartPage />, {
            initialState: { cart: [mockCartItem] },
        });
        
        const clearButton = screen.getByText('Clear Cart');
        fireEvent.click(clearButton);
        
        await waitFor(() => {
            const state = store.getState();
            expect(state.shop.cart).toHaveLength(0);
        });
        
        confirmSpy.mockRestore();
    });

    it('должен показывать кнопку Continue Shopping', () => {
        renderWithProviders(<CartPage />);
        
        expect(screen.getByText('Continue Shopping')).toBeInTheDocument();
    });

    it('должен отображать Free shipping', () => {
        renderWithProviders(<CartPage />, {
            initialState: { cart: [mockCartItem] },
        });
        
        expect(screen.getByText('Free')).toBeInTheDocument();
    });

    it('должен показывать кнопку Proceed to Checkout', () => {
        renderWithProviders(<CartPage />, {
            initialState: { cart: [mockCartItem] },
        });
        
        expect(screen.getByText('Proceed to Checkout')).toBeInTheDocument();
    });

    it('должен правильно считать общую сумму для нескольких товаров', () => {
        const cart = [
            { ...mockCartItem, id: 1, price: 100, quantity: 2 },
            { ...mockCartItem, id: 2, price: 50, quantity: 3 },
        ];
        
        renderWithProviders(<CartPage />, {
            initialState: { cart },
        });
        
        const totalElements = screen.getAllByText('$350.00');
        expect(totalElements.length).toBeGreaterThan(0);
    });
});