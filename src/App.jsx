import { Provider } from 'react-redux';
import { store } from './store/store.js';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { MainPage } from './pages/Main/MainPage.jsx';
import { ShopPage } from './pages/Shop/ShopPage.jsx';
import { MainShop } from './pages/MainShop/MainShop.jsx';
import { Card } from './pages/Card/ProductCard.jsx';
import { CartPage } from './pages/Cart/CartPage.jsx';

const router = createBrowserRouter([
  { path: '/', element: <MainPage /> },
  { path: '/shop', element: <MainShop /> },
  { path: '/Card/:id', element: <Card /> },
  { path: '/cart', element: <CartPage /> },
]);


function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
}

export default App;
