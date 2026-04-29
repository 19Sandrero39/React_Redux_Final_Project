import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchParts } from '../redux/slices/partsSlice';
import './HomePage.css';

const HomePage = () => {
    const dispatch = useDispatch();
    const { items } = useSelector((state) => state.parts);
    const popularParts = items.slice(0, 4); // первые 4 товара

    useEffect(() => {
        if (items.length === 0) {
            dispatch(fetchParts());
        }
    }, [dispatch, items.length]);

    return (
        <div className="home-container">
            {/* Hero‑секция */}
            <section className="hero-section">
                <h1 className="hero-title">AutoParts Store</h1>
                <p className="hero-description">
                    Оригинальные запчасти для <strong>Volkswagen Passat B4</strong> с гарантией подлинности.<br />
                    Доставка за 24 часа, консультации экспертов, лучшие цены на рынке.
                </p>
                <Link to="/catalog" className="cta-button">Перейти в каталог →</Link>
            </section>

            {/* Популярные товары */}
            {items.length > 0 && (
                <section className="popular-section">
                    <h2 className="section-title">🔥 Популярные запчасти</h2>
                    <div className="popular-grid">
                        {popularParts.map((part) => (
                            <div key={part.id} className="popular-card">
                                <img
                                    src={part.imageUrl || '/images/placeholder.jpg'}
                                    alt={part.name}
                                    className="popular-image"
                                    onError={(e) => (e.target.src = '/images/placeholder.jpg')}
                                />
                                <h4>{part.name}</h4>
                                <p className="popular-price">{part.price} $</p>
                                <Link to="/catalog" className="popular-link">Подробнее</Link>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Расширенные преимущества (4 карточки) */}
            <section className="features-grid">
                <div className="feature-card">
                    <div className="feature-icon">🔧</div>
                    <h3>Оригинальное качество</h3>
                    <p>Только сертифицированные детали с гарантией совместимости и долговечности.</p>
                </div>
                <div className="feature-card">
                    <div className="feature-icon">🚚</div>
                    <h3>Быстрая доставка</h3>
                    <p>Отправка в день заказа по всей стране. Отслеживание на каждом этапе.</p>
                </div>
                <div className="feature-card">
                    <div className="feature-icon">⚙️</div>
                    <h3>Экспертиза Passat B4</h3>
                    <p>Более 10 лет специализации на этой модели. Подбор по VIN и консультации.</p>
                </div>
                <div className="feature-card">
                    <div className="feature-icon">🛡️</div>
                    <h3>Гарантия 12 месяцев</h3>
                    <p>Возврат и обмен без вопросов, если деталь не подошла или оказалась бракованной.</p>
                </div>
            </section>

            {/* Блок статистики */}
            <section className="stats-section">
                <div className="stat-item">
                    <span className="stat-number">10+</span>
                    <span className="stat-label">лет на рынке</span>
                </div>
                <div className="stat-item">
                    <span className="stat-number">5000+</span>
                    <span className="stat-label">довольных клиентов</span>
                </div>
                <div className="stat-item">
                    <span className="stat-number">24/7</span>
                    <span className="stat-label">поддержка</span>
                </div>
                <div className="stat-item">
                    <span className="stat-number">100%</span>
                    <span className="stat-label">оригинал</span>
                </div>
            </section>

            {/* Отзывы клиентов */}
            <section className="reviews-section">
                <h2 className="section-title">💬 Отзывы наших клиентов</h2>
                <div className="reviews-grid">
                    <div className="review-card">
                        <p>“Заказывал тормозные колодки – пришли на следующий день. Всё подошло идеально, машина как новая!”</p>
                        <div className="review-author">– Михаил, Passat B4 1.9 TDI</div>
                    </div>
                    <div className="review-card">
                        <p>“Огромное спасибо за консультацию! Помогли подобрать ремень ГРМ, доставили быстро. Буду заказывать ещё.”</p>
                        <div className="review-author">– Елена, Passat B4 2.0</div>
                    </div>
                    <div className="review-card">
                        <p>“Уже не первый раз покупаю здесь. Всегда в наличии нужные детали, цены ниже, чем в других магазинах.”</p>
                        <div className="review-author">– Андрей, Passat B4</div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;