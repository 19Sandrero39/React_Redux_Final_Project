import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { removeFromCart, incrementQuantity, decrementQuantity, clearCart } from '../redux/slices/partsSlice';
import './CartPage.css';

const CartPage = () => {
    const dispatch = useDispatch();
    const { cart, items } = useSelector((state) => state.parts);
    const [removingId, setRemovingId] = useState(null);

    // Рекомендации: 3 товара, которых нет в корзине
    const cartIds = new Set(cart.map(i => i.id));
    const recommendations = items
        .filter(item => !cartIds.has(item.id))
        .slice(0, 3);

    const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const freeShippingThreshold = 100;
    const remainingForFree = Math.max(0, freeShippingThreshold - totalPrice);
    const progressPercent = Math.min(100, (totalPrice / freeShippingThreshold) * 100);

    const handleRemove = (id) => {
        setRemovingId(id);
        setTimeout(() => {
            dispatch(removeFromCart(id));
            setRemovingId(null);
        }, 200);
    };

    if (cart.length === 0) {
        return (
            <div className="cart-container">
                <div className="empty-cart">
                    <p>🛒 В корзине пока пусто.</p>
                    <Link to="/catalog" className="back-link">Вернуться в каталог</Link>
                    {recommendations.length > 0 && (
                        <div className="recommendations-empty">
                            <h3>Возможно, вас заинтересует:</h3>
                            <div className="rec-grid">
                                {recommendations.map(rec => (
                                    <div key={rec.id} className="rec-card">
                                        <img src={rec.imageUrl || '/images/placeholder.jpg'} alt={rec.name} />
                                        <p>{rec.name}</p>
                                        <Link to="/catalog" className="rec-link">В каталог</Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="cart-container">
            <h1>Ваша корзина 🛍️</h1>

            {/* Прогресс‑бар бесплатной доставки */}
            {totalPrice < freeShippingThreshold && (
                <div className="free-shipping">
                    <div className="shipping-text">
                        🚚 Добавьте товаров ещё на <strong>{remainingForFree.toFixed(2)} $</strong> для бесплатной доставки
                    </div>
                    <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
                    </div>
                </div>
            )}
            {totalPrice >= freeShippingThreshold && (
                <div className="free-shipping success">
                    🎉 Бесплатная доставка уже применена! 🎉
                </div>
            )}

            <div className="table-wrapper">
                <table className="cart-table">
                    <thead>
                        <tr>
                            <th>Товар</th>
                            <th>Цена</th>
                            <th>Количество</th>
                            <th>Сумма</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {cart.map((item) => (
                            <tr key={item.id} className={removingId === item.id ? 'removing' : ''}>
                                <td data-label="Товар" className="product-cell">
                                    <img src={item.imageUrl || '/images/placeholder.jpg'} alt={item.name} className="cart-image" />
                                    <div className="product-info">
                                        <span className="product-name">{item.name}</span>
                                        <span className="product-article">Арт. {item.article || '—'}</span>
                                    </div>
                                </td>
                                <td data-label="Цена">{item.price} $</td>
                                <td data-label="Количество">
                                    <div className="quantity-controls">
                                        <button
                                            className="qty-btn"
                                            onClick={() => dispatch(decrementQuantity(item.id))}
                                            aria-label="Уменьшить"
                                        >–</button>
                                        <span className="quantity">{item.quantity}</span>
                                        <button
                                            className="qty-btn"
                                            onClick={() => dispatch(incrementQuantity(item.id))}
                                            aria-label="Увеличить"
                                        >+</button>
                                    </div>
                                </td>
                                <td data-label="Сумма" className="item-total">
                                    {(item.price * item.quantity).toFixed(2)} $
                                </td>
                                <td data-label="">
                                    <button
                                        className="remove-btn"
                                        onClick={() => handleRemove(item.id)}
                                        aria-label={`Удалить ${item.name}`}
                                    >
                                        ✕
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="cart-summary">
                <div className="summary-block">
                    <h3>Итого: {totalPrice.toFixed(2)} $</h3>
                    <button className="clear-cart-btn" onClick={() => dispatch(clearCart())}>
                        Очистить корзину
                    </button>
                </div>
                <button className="checkout-btn" onClick={() => {
                    alert('Заказ успешно оформлен! Спасибо за покупку.');
                    dispatch(clearCart());
                }}>
                    Оформить заказ →
                </button>
            </div>

            {/* Блок рекомендаций (если есть) */}
            {recommendations.length > 0 && (
                <div className="recommendations">
                    <h3>🔥 Вам также может понравиться</h3>
                    <div className="rec-grid">
                        {recommendations.map(rec => (
                            <div key={rec.id} className="rec-card">
                                <img src={rec.imageUrl || '/images/placeholder.jpg'} alt={rec.name} />
                                <p>{rec.name}</p>
                                <span className="rec-price">{rec.price} $</span>
                                <Link to="/catalog" className="rec-link">Перейти в каталог</Link>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartPage;