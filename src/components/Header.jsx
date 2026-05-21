import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import './Header.css';

const Header = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { cart } = useSelector((state) => state.parts);
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const cartCount = cart.reduce((accumulator, item) => accumulator + item.quantity, 0);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/auth');
    };

    const navLinkClass = ({ isActive }) => `nav-link${isActive ? ' is-active' : ''}`;
    const cartLinkClass = ({ isActive }) => `nav-link cart-link${isActive ? ' is-active' : ''}`;

    return (
        <header className="header">
            <div className="header-container">
                <NavLink to="/" className="logo" aria-label="AutoParts B4 home">
                    <span className="logo-mark">AP</span>
                    <span className="logo-copy">
                        <strong>AutoParts B4</strong>
                        <small>Passat specialist garage</small>
                    </span>
                </NavLink>

                <nav className="nav">
                    {isAuthenticated ? (
                        <>
                            <NavLink to="/" className={navLinkClass}>
                                Главная
                            </NavLink>
                            <NavLink to="/catalog" className={navLinkClass}>
                                Каталог
                            </NavLink>
                            {user?.role === 'admin' && (
                                <NavLink to="/admin" className={navLinkClass}>
                                    Админка
                                </NavLink>
                            )}
                            <NavLink to="/cart" className={cartLinkClass}>
                                Корзина
                                {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
                            </NavLink>
                            <button onClick={handleLogout} className="logout-btn">
                                Выйти
                            </button>
                        </>
                    ) : (
                        <NavLink to="/auth" className={navLinkClass}>
                            Войти
                        </NavLink>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Header;
