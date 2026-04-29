import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import './Header.css';

const Header = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { cart } = useSelector((state) => state.parts);
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/auth');
    };

    return (
        <header className="header">
            <div className="header-container">
                <NavLink to="/" className="logo">AutoParts B4</NavLink>
                <nav className="nav">
                    {isAuthenticated ? (
                        <>
                            <NavLink to="/" className="nav-link">Главная</NavLink>
                            <NavLink to="/catalog" className="nav-link">Каталог</NavLink>
                            {user?.role === 'admin' && <NavLink to="/admin" className="nav-link">Админка</NavLink>}
                            <NavLink to="/cart" className="nav-link cart-link">
                                Корзина
                                {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
                            </NavLink>
                            <button onClick={handleLogout} className="logout-btn">Выйти</button>
                        </>
                    ) : (
                        <NavLink to="/auth" className="nav-link">Войти</NavLink>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Header;