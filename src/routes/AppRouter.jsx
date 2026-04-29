import { Routes, Route } from 'react-router-dom';
import CatalogPage from '../pages/CatalogPage';
import HomePage from '../pages/HomePage'; // Создадим позже
import AdminPage from '../pages/AdminPage'; // Создадим позже
import CartPage from '../pages/CartPage';   // Создадим позже

const AppRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/catalog" element={<CatalogPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/cart" element={<CartPage />} />
        </Routes>
    );
};

export default AppRouter;