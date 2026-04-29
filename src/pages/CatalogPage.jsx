import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchParts, addToCart } from '../redux/slices/partsSlice';
import './CatalogPage.css';

const CatalogPage = () => {
    const dispatch = useDispatch();
    const { items, loading, error } = useSelector((state) => state.parts);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        dispatch(fetchParts());
    }, [dispatch]);

    const filteredParts = items.filter((part) =>
        part.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <h2 className="status-msg">Загрузка данных...</h2>;
    if (error) return <h2 className="status-msg error">Ошибка: {error}</h2>;

    return (
        <div className="catalog-page">
            <h1>Каталог запчастей</h1>
            <hr className="catalog-divider" />
            <input
                type="text"
                placeholder="Поиск по названию..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
                aria-label="Поиск запчастей"
            />

            {filteredParts.length === 0 ? (
                <p className="status-msg">Запчасти не найдены.</p>
            ) : (
                <div className="catalog-grid">
                    {filteredParts.map((part) => (
                        <div key={part.id} className="product-card">
                            {/* Бейджи */}
                            <div className="product-badge">
                                {part.price > 50 && <span className="badge-hot">🔥 Хит</span>}
                                {part.stock < 5 && part.stock > 0 && <span className="badge-low">⚠️ Осталось {part.stock}</span>}
                            </div>

                            <img
                                src={part.imageUrl || '/images/placeholder.jpg'}
                                alt={part.name}
                                className="product-image"
                                onError={(e) => (e.target.src = '/images/placeholder.jpg')}
                            />
                            <h3>{part.name}</h3>
                            <p className="article">Арт. {part.article || '—'}</p>
                            <p className="category">{part.category || 'Разное'}</p>
                            <p className="price">{part.price} $</p>

                            {/* Прогресс-бар наличия */}
                            {part.stock > 0 && (
                                <div className="stock-bar">
                                    <div className="stock-fill" style={{ width: `${Math.min(100, (part.stock / 20) * 100)}%` }}></div>
                                </div>
                            )}

                            <p className="stock-status">
                                {part.stock > 0
                                    ? `✅ В наличии (${part.stock} шт.)`
                                    : '❌ Нет в наличии'}
                            </p>

                            <button
                                className={`btn-add ${part.stock < 5 && part.stock > 0 ? 'btn-low-stock' : ''}`}
                                onClick={() => dispatch(addToCart(part))}
                                disabled={part.stock === 0}
                                aria-label={`Добавить ${part.name} в корзину`}
                            >
                                🛒 В корзину
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CatalogPage;