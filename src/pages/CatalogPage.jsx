import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchParts, addToCart } from '../redux/slices/partsSlice';
import './CatalogPage.css';

const CatalogPage = () => {
    const dispatch = useDispatch();
    const { items, loading, error } = useSelector((state) => state.parts);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('Все');

    useEffect(() => {
        dispatch(fetchParts());
    }, [dispatch]);

    const categories = ['Все', ...new Set(items.map((part) => part.category).filter(Boolean))];
    const filteredParts = items.filter((part) => {
        const matchesSearch = part.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = activeCategory === 'Все' || part.category === activeCategory;
        return matchesSearch && matchesCategory;
    });
    const availableCount = items.filter((part) => part.stock > 0).length;
    const lowStockCount = items.filter((part) => part.stock > 0 && part.stock < 10).length;
    const inventoryCount = items.reduce((total, part) => total + part.stock, 0);

    return (
        <div className="catalog-page">
            <section className="catalog-hero">
                <div className="catalog-hero__copy">
                    <p className="catalog-hero__kicker">Curated Inventory</p>
                    <h1 className="catalog-hero__title">Каталог теперь чувствуется как дизайнерская витрина деталей, а не просто сетка товаров.</h1>
                    <p className="catalog-hero__text">
                        Ищите по названию, переключайтесь между категориями и сразу считывайте, где много запаса, а где
                        пора брать деталь без промедления.
                    </p>
                </div>

                <div className="catalog-hero__stats">
                    <article className="catalog-stat">
                        <strong>{items.length}</strong>
                        <span>позиций в каталоге</span>
                    </article>
                    <article className="catalog-stat">
                        <strong>{availableCount}</strong>
                        <span>доступны к заказу</span>
                    </article>
                    <article className="catalog-stat">
                        <strong>{inventoryCount}+</strong>
                        <span>единиц на складе</span>
                    </article>
                    <article className="catalog-stat">
                        <strong>{lowStockCount}</strong>
                        <span>требуют быстрого решения</span>
                    </article>
                </div>
            </section>

            <section className="catalog-toolbar">
                <label className="catalog-search" aria-label="Поиск запчастей">
                    <span className="catalog-search__icon">AP</span>
                    <input
                        type="text"
                        placeholder="Поиск по названию, например тормозные колодки..."
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)}
                        className="catalog-search__input"
                    />
                </label>

                <div className="catalog-toolbar__summary">
                    <strong>{filteredParts.length}</strong>
                    <span>
                        {activeCategory === 'Все'
                            ? 'результатов в общем каталоге'
                            : `результатов в категории "${activeCategory}"`}
                    </span>
                </div>
            </section>

            <div className="catalog-filters" role="tablist" aria-label="Фильтр по категориям">
                {categories.map((category) => (
                    <button
                        key={category}
                        type="button"
                        className={`catalog-filter${activeCategory === category ? ' is-active' : ''}`}
                        onClick={() => setActiveCategory(category)}
                        aria-pressed={activeCategory === category}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="catalog-status">
                    <h2>Загружаем полки каталога...</h2>
                    <p>Подтягиваем актуальные детали и остатки, чтобы витрина отрисовалась полностью.</p>
                </div>
            ) : error ? (
                <div className="catalog-status catalog-status--error">
                    <h2>Каталог временно недоступен</h2>
                    <p>{error}</p>
                </div>
            ) : filteredParts.length === 0 ? (
                <div className="catalog-status">
                    <h2>Ничего не найдено</h2>
                    <p>Попробуйте другое название или вернитесь к общей категории.</p>
                </div>
            ) : (
                <div className="catalog-grid">
                    {filteredParts.map((part, index) => (
                        <article key={part.id} className={`catalog-card catalog-card--${(index % 4) + 1}`}>
                            <div className="catalog-card__badge-row">
                                {part.price >= 50 && <span className="catalog-badge catalog-badge--hot">Хит</span>}
                                {part.stock > 0 && part.stock < 5 && (
                                    <span className="catalog-badge catalog-badge--alert">Мало: {part.stock}</span>
                                )}
                                {part.stock === 0 && <span className="catalog-badge catalog-badge--sold">Нет в наличии</span>}
                            </div>

                            <div className="catalog-card__media">
                                <img
                                    src={part.imageUrl || '/images/placeholder.jpg'}
                                    alt={part.name}
                                    className="catalog-card__image"
                                    onError={(event) => {
                                        event.target.src = '/images/placeholder.jpg';
                                    }}
                                />
                                <span className="catalog-card__price">${part.price}</span>
                            </div>

                            <div className="catalog-card__body">
                                <div className="catalog-card__meta">
                                    <span>{part.category || 'Разное'}</span>
                                    <span>Арт. {part.article || '—'}</span>
                                </div>
                                <h3 className="catalog-card__title">{part.name}</h3>
                                <p className="catalog-card__description">{part.description}</p>

                                <div className="catalog-card__compatibility">
                                    {(part.compatibleModels || ['Универсальный']).slice(0, 3).map((model) => (
                                        <span key={model} className="catalog-card__tag">
                                            {model}
                                        </span>
                                    ))}
                                </div>

                                <div className="catalog-card__stock">
                                    <div className="catalog-card__stock-bar">
                                        <span
                                            className="catalog-card__stock-fill"
                                            style={{ width: `${Math.min(100, (part.stock / 20) * 100)}%` }}
                                        />
                                    </div>
                                    <p className="catalog-card__stock-label">
                                        {part.stock > 0 ? `В наличии: ${part.stock} шт.` : 'Ожидается пополнение'}
                                    </p>
                                </div>

                                <button
                                    className={`catalog-card__button${part.stock < 5 && part.stock > 0 ? ' is-low' : ''}`}
                                    onClick={() => dispatch(addToCart(part))}
                                    disabled={part.stock === 0}
                                    aria-label={`Добавить ${part.name} в корзину`}
                                >
                                    {part.stock === 0 ? 'Недоступно' : 'Добавить в корзину'}
                                </button>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CatalogPage;
