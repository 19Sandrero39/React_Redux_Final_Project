import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../redux/slices/authSlice';
import './AuthPage.css';

const authSignals = ['VIN-guided picks', '24h dispatch', 'OEM focus'];
const authStats = [
    { value: '10+', label: 'лет в специализации Passat B4' },
    { value: '5K', label: 'клиентов, вернувшихся за расходниками' },
    { value: '24/7', label: 'подсказки по совместимости и подбору' },
];

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((previous) => ({ ...previous, [name]: value }));
        if (successMsg) setSuccessMsg('');
    };

    const switchMode = (nextIsLogin) => {
        if (nextIsLogin === isLogin) return;
        setIsLogin(nextIsLogin);
        setFormData({ username: '', email: '', password: '' });
        setShowPassword(false);
        setSuccessMsg('');
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!isLogin) {
            setSuccessMsg('Регистрация завершена. Теперь можно войти в личный кабинет.');
            setIsLogin(true);
            setShowPassword(false);
            setFormData({ username: formData.username, email: '', password: '' });
            return;
        }

        const role = formData.username.toLowerCase() === 'admin' ? 'admin' : 'user';
        dispatch(login({ ...formData, role }));
        navigate('/');
    };

    return (
        <div className="auth-page">
            <div className="auth-page__shape auth-page__shape--amber" aria-hidden="true" />
            <div className="auth-page__shape auth-page__shape--blue" aria-hidden="true" />

            <div className="auth-layout">
                <section className="auth-showcase">
                    <p className="auth-showcase__kicker">Garage Access</p>
                    <h1 className="auth-showcase__title">Вход и регистрация теперь выглядят как часть одного премиального магазина.</h1>
                    <p className="auth-showcase__copy">
                        Вместо стандартной формы здесь полноценная точка входа в бренд: мягкое стекло, уверенная
                        типографика и акценты, которые продолжают визуальный язык главной страницы.
                    </p>

                    <div className="auth-showcase__signals">
                        {authSignals.map((signal) => (
                            <span key={signal} className="auth-showcase__signal">
                                {signal}
                            </span>
                        ))}
                    </div>

                    <div className="auth-showcase__stats">
                        {authStats.map((stat) => (
                            <article key={stat.label} className="auth-showcase__stat">
                                <strong>{stat.value}</strong>
                                <span>{stat.label}</span>
                            </article>
                        ))}
                    </div>
                </section>

                <section className="auth-panel">
                    <p className="auth-panel__eyebrow">{isLogin ? 'Sign In' : 'Register'}</p>
                    <h2 className="auth-panel__title">
                        {isLogin ? 'Добро пожаловать обратно' : 'Создайте новый аккаунт'}
                    </h2>
                    <p className="auth-panel__copy">
                        {isLogin
                            ? 'Войдите, чтобы быстро перейти к каталогу, корзине и сохраненному рабочему потоку.'
                            : 'Оформите доступ, чтобы собирать заказы быстрее и управлять своими подборками.'}
                    </p>

                    <div className="auth-mode-switch" role="tablist" aria-label="Режим авторизации">
                        <button
                            type="button"
                            className={`auth-mode-switch__button${isLogin ? ' is-active' : ''}`}
                            onClick={() => switchMode(true)}
                            aria-pressed={isLogin}
                        >
                            Вход
                        </button>
                        <button
                            type="button"
                            className={`auth-mode-switch__button${!isLogin ? ' is-active' : ''}`}
                            onClick={() => switchMode(false)}
                            aria-pressed={!isLogin}
                        >
                            Регистрация
                        </button>
                    </div>

                    {successMsg && <div className="auth-flash">{successMsg}</div>}

                    <form onSubmit={handleSubmit} className="auth-form">
                        <label className="auth-field">
                            <span className="auth-field__label">Имя пользователя</span>
                            <div className="auth-field__group">
                                <span className="auth-field__icon">AP</span>
                                <input
                                    type="text"
                                    name="username"
                                    placeholder="Например, admin или passat.driver"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                    autoComplete="username"
                                />
                            </div>
                        </label>

                        {!isLogin && (
                            <label className="auth-field">
                                <span className="auth-field__label">Email</span>
                                <div className="auth-field__group">
                                    <span className="auth-field__icon">@</span>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="mail@example.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        autoComplete="email"
                                    />
                                </div>
                            </label>
                        )}

                        <label className="auth-field">
                            <span className="auth-field__label">Пароль</span>
                            <div className="auth-field__group">
                                <span className="auth-field__icon">**</span>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    placeholder={isLogin ? 'Введите пароль' : 'Создайте пароль'}
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    autoComplete={isLogin ? 'current-password' : 'new-password'}
                                />
                                <button
                                    type="button"
                                    className="auth-field__toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label="Показать или скрыть пароль"
                                >
                                    {showPassword ? 'Скрыть' : 'Показать'}
                                </button>
                            </div>
                        </label>

                        <button type="submit" className="auth-submit-button">
                            {isLogin ? 'Войти в кабинет' : 'Создать аккаунт'}
                        </button>
                    </form>

                    <div className="auth-panel__footer">
                        <p>{isLogin ? 'Нужен новый аккаунт?' : 'Уже есть аккаунт?'}</p>
                        <button
                            type="button"
                            className="auth-panel__link"
                            onClick={() => switchMode(!isLogin)}
                        >
                            {isLogin ? 'Перейти к регистрации' : 'Вернуться ко входу'}
                        </button>
                    </div>

                    <div className="auth-admin-hint">
                        Для входа в админ-панель используйте имя пользователя <strong>admin</strong>. Пароль может быть
                        любым в рамках демо-режима.
                    </div>
                </section>
            </div>
        </div>
    );
};

export default AuthPage;
