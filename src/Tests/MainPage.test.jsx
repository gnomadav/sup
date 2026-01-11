import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { MainPage } from '../pages/Main/MainPage';

vi.mock('../store/LondonTime', () => ({
    LondonTime: () => <div>Mocked LondonTime</div>,
}));

const renderWithRouter = (component) => {
    return render(
        <BrowserRouter>
            {component}
        </BrowserRouter>
    );
};

describe('MainPage', () => {
    it('должен отображать компонент LondonTime', () => {
        renderWithRouter(<MainPage />);
        
        expect(screen.getByText('Mocked LondonTime')).toBeInTheDocument();
    });

    it('должен отображать меню с правильными пунктами', () => {
        renderWithRouter(<MainPage />);
        
        expect(screen.getByText('news')).toBeInTheDocument();
        expect(screen.getByText('fall/winter 2025 preview')).toBeInTheDocument();
        expect(screen.getByText('fall/winter 2025 lookbook')).toBeInTheDocument();
        expect(screen.getByText('shop')).toBeInTheDocument();
        expect(screen.getByText('random')).toBeInTheDocument();
        expect(screen.getByText('about')).toBeInTheDocument();
        expect(screen.getByText('stores')).toBeInTheDocument();
        expect(screen.getByText('contact')).toBeInTheDocument();
        expect(screen.getByText('mail listing')).toBeInTheDocument();
    });

    it('должен отображать социальные иконки', () => {
        renderWithRouter(<MainPage />);
        
        const images = screen.getAllByRole('img');
        expect(images.length).toBeGreaterThanOrEqual(5);
    });

    it('должен иметь alt текст для социальных иконок', () => {
        renderWithRouter(<MainPage />);
        
        expect(screen.getByAltText('App Store')).toBeInTheDocument();
        expect(screen.getByAltText('Facebook')).toBeInTheDocument();
        expect(screen.getByAltText('Instagram')).toBeInTheDocument();
        expect(screen.getByAltText('Spotify')).toBeInTheDocument();
        expect(screen.getByAltText('Weibo')).toBeInTheDocument();
    });

    it('должен иметь правильные размеры для иконок', () => {
        renderWithRouter(<MainPage />);
        
        const appStoreIcon = screen.getByAltText('App Store');
        expect(appStoreIcon).toHaveAttribute('width', '24');
        expect(appStoreIcon).toHaveAttribute('height', '24');
    });

    it('должен иметь класс main-page', () => {
        const { container } = renderWithRouter(<MainPage />);
        
        expect(container.querySelector('.main-page')).toBeInTheDocument();
    });

    it('должен иметь класс main-menu для меню', () => {
        const { container } = renderWithRouter(<MainPage />);
        
        expect(container.querySelector('.main-menu')).toBeInTheDocument();
    });

    it('должен иметь класс social-icons для иконок', () => {
        const { container } = renderWithRouter(<MainPage />);
        
        expect(container.querySelector('.social-icons')).toBeInTheDocument();
    });
});