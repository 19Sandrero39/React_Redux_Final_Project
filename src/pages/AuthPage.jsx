import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../redux/slices/authSlice';
import './AuthPage.css';

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (successMsg) setSuccessMsg('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!isLogin) {
            // Эмуляция успешной регистрации
            setSuccessMsg('✅ Регистрация прошла успешно! Теперь войдите.');
            setIsLogin(true);
            setFormData({ username: formData.username, email: '', password: '' });
            return;
        }
        const role = formData.username.toLowerCase() === 'admin' ? 'admin' : 'user';
        dispatch(login({ ...formData, role }));
        navigate('/');
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
        setFormData({ username: '', email: '', password: '' });
        setSuccessMsg('');
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1>{isLogin ? 'Добро пожаловать' : 'Создать аккаунт'}</h1>

                {successMsg && <div className="success-message">{successMsg}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="input-group">
                        <span className="input-icon">👤</span>
                        <input
                            type="text"
                            name="username"
                            placeholder="Имя пользователя"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            autoComplete="username"
                        />
                    </div>

                    {!isLogin && (
                        <div className="input-group">
                            <span className="input-icon">📧</span>
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                autoComplete="email"
                            />
                        </div>
                    )}

                    <div className="input-group">
                        <span className="input-icon">🔒</span>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            placeholder="Пароль"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            autoComplete={isLogin ? 'current-password' : 'new-password'}
                        />
                        <button
                            type="button"
                            className="password-toggle"
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label="Показать/скрыть пароль"
                        >
                            {showPassword ? '🙈' : '👁️'}
                        </button>
                    </div>

                    <button type="submit" className="submit-btn">
                        {isLogin ? 'Войти' : 'Зарегистрироваться'}
                    </button>
                </form>

                <p className="toggle-link" onClick={toggleMode}>
                    {isLogin ? 'Нет аккаунта? Зарегистрироваться' : 'Есть аккаунт? Войти'}
                </p>

            </div>
        </div>
    );
};

export default AuthPage;