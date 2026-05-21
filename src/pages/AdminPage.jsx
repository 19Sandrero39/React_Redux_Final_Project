import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addPart, deletePart, fetchParts, updatePart } from '../redux/slices/partsSlice';
import './AdminPage.css';

const initialForm = {
    id: null,
    name: '',
    price: '',
    article: '',
    category: '',
    description: '',
    stock: '',
    imageUrl: '',
    compatibleModels: '',
};

const AdminPage = () => {
    const [form, setForm] = useState(initialForm);
    const [success, setSuccess] = useState('');
    const dispatch = useDispatch();
    const { items, loading, error } = useSelector((state) => state.parts);

    useEffect(() => {
        dispatch(fetchParts());
    }, [dispatch]);

    const startEdit = (part) => {
        setForm({
            id: part.id,
            name: part.name,
            price: part.price,
            article: part.article || '',
            category: part.category || '',
            description: part.description || '',
            stock: part.stock ?? '',
            imageUrl: part.imageUrl || '',
            compatibleModels: Array.isArray(part.compatibleModels) ? part.compatibleModels.join(', ') : '',
        });
    };

    const resetForm = () => {
        setForm(initialForm);
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setForm((previous) => ({ ...previous, [name]: value }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const compatibleArray = form.compatibleModels
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean);

        const partData = {
            name: form.name,
            price: Number(form.price),
            article: form.article,
            category: form.category,
            description: form.description,
            stock: Number(form.stock) || 0,
            imageUrl: form.imageUrl || '/images/default.jpg',
            compatibleModels: compatibleArray.length ? compatibleArray : ['Универсальный'],
        };

        if (form.id) {
            dispatch(updatePart({ id: form.id, ...partData }));
            setSuccess('Карточка детали обновлена.');
        } else {
            dispatch(addPart(partData));
            setSuccess('Новая деталь добавлена в витрину.');
        }

        resetForm();
        setTimeout(() => setSuccess(''), 3000);
    };

    const totalStock = items.reduce((total, part) => total + (part.stock || 0), 0);
    const lowStockCount = items.filter((part) => part.stock > 0 && part.stock < 10).length;
    const categoryCount = new Set(items.map((part) => part.category).filter(Boolean)).size;
    const highlightedCount = items.filter((part) => part.price >= 50).length;
    const previewTags = form.compatibleModels
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
        .slice(0, 3);

    return (
        <div className="admin-page">
            <section className="admin-hero">
                <div className="admin-hero__copy">
                    <p className="admin-hero__kicker">Control Room</p>
                    <h1 className="admin-hero__title">Админ-панель теперь выглядит как настоящий рабочий центр магазина.</h1>
                    <p className="admin-hero__text">
                        Здесь удобно пополнять склад, редактировать карточки и следить за слабым запасом без ощущения,
                        что вы провалились в старую служебную форму.
                    </p>
                </div>

                <div className="admin-hero__stats">
                    <article className="admin-stat">
                        <strong>{items.length}</strong>
                        <span>карточек под управлением</span>
                    </article>
                    <article className="admin-stat">
                        <strong>{totalStock}</strong>
                        <span>единиц на складе</span>
                    </article>
                    <article className="admin-stat">
                        <strong>{lowStockCount}</strong>
                        <span>требуют внимания</span>
                    </article>
                    <article className="admin-stat">
                        <strong>{categoryCount || highlightedCount}</strong>
                        <span>{categoryCount ? 'активных категорий' : 'товаров в премиум-сегменте'}</span>
                    </article>
                </div>
            </section>

            {error && (
                <div className="admin-alert admin-alert--error">
                    Не удалось синхронизировать каталог с сервером. Форму можно подготовить, но список может быть неактуален.
                </div>
            )}

            <div className="admin-workbench">
                <section className="admin-section admin-section--editor">
                    <div className="admin-section__head">
                        <div>
                            <p className="admin-section__kicker">Editor</p>
                            <h2>{form.id ? 'Редактирование детали' : 'Добавление новой позиции'}</h2>
                            <p>
                                Заполняйте карточку с полями, которые сразу поддерживают визуальную витрину каталога.
                            </p>
                        </div>
                        <span className={`admin-section__badge${form.id ? ' is-edit' : ''}`}>
                            {form.id ? 'Режим правки' : 'Новая карточка'}
                        </span>
                    </div>

                    {success && <div className="admin-flash">{success}</div>}

                    <div className="admin-editor">
                        <form onSubmit={handleSubmit} className="admin-form">
                            <label className="admin-field">
                                <span>Название</span>
                                <input name="name" value={form.name} onChange={handleChange} placeholder="Название детали" required />
                            </label>

                            <label className="admin-field">
                                <span>Цена</span>
                                <input
                                    name="price"
                                    type="number"
                                    step="0.01"
                                    value={form.price}
                                    onChange={handleChange}
                                    placeholder="Цена в долларах"
                                    required
                                />
                            </label>

                            <label className="admin-field">
                                <span>Артикул</span>
                                <input name="article" value={form.article} onChange={handleChange} placeholder="VW-B4-..." />
                            </label>

                            <label className="admin-field">
                                <span>Категория</span>
                                <input name="category" value={form.category} onChange={handleChange} placeholder="Тормозная система" />
                            </label>

                            <label className="admin-field admin-field--wide">
                                <span>Описание</span>
                                <textarea
                                    name="description"
                                    value={form.description}
                                    onChange={handleChange}
                                    placeholder="Кратко опишите назначение, преимущества и совместимость детали"
                                    rows="4"
                                />
                            </label>

                            <label className="admin-field">
                                <span>Количество на складе</span>
                                <input
                                    name="stock"
                                    type="number"
                                    value={form.stock}
                                    onChange={handleChange}
                                    placeholder="Например, 24"
                                />
                            </label>

                            <label className="admin-field">
                                <span>URL изображения</span>
                                <input name="imageUrl" value={form.imageUrl} onChange={handleChange} placeholder="https://..." />
                            </label>

                            <label className="admin-field admin-field--wide">
                                <span>Совместимые модели</span>
                                <input
                                    name="compatibleModels"
                                    value={form.compatibleModels}
                                    onChange={handleChange}
                                    placeholder="Passat B4, Passat B3, Golf 3"
                                />
                            </label>

                            <div className="admin-form__actions">
                                <button type="submit" className={`admin-submit-button${form.id ? ' is-edit' : ''}`}>
                                    {form.id ? 'Сохранить изменения' : 'Добавить товар'}
                                </button>
                                {form.id && (
                                    <button type="button" className="admin-cancel-button" onClick={resetForm}>
                                        Сбросить форму
                                    </button>
                                )}
                            </div>
                        </form>

                        <aside className="admin-preview">
                            <p className="admin-preview__kicker">Live Preview</p>
                            <div className="admin-preview__media">
                                {form.imageUrl ? (
                                    <img src={form.imageUrl} alt={form.name || 'Предпросмотр детали'} />
                                ) : (
                                    <div className="admin-preview__placeholder">AP</div>
                                )}
                            </div>
                            <h3>{form.name || 'Новая карточка детали'}</h3>
                            <p>{form.description || 'Описание появится здесь, когда вы заполните форму.'}</p>
                            <div className="admin-preview__meta">
                                <span>{form.category || 'Категория'}</span>
                                <span>{form.article || 'Артикул'}</span>
                            </div>
                            <strong className="admin-preview__price">
                                {form.price ? `$${Number(form.price).toFixed(2)}` : '$0.00'}
                            </strong>
                            <div className="admin-preview__tags">
                                {(previewTags.length ? previewTags : ['Совместимость появится здесь']).map((tag) => (
                                    <span key={tag}>{tag}</span>
                                ))}
                            </div>
                        </aside>
                    </div>
                </section>

                <section className="admin-section admin-section--inventory">
                    <div className="admin-section__head">
                        <div>
                            <p className="admin-section__kicker">Inventory</p>
                            <h2>Список деталей под рукой</h2>
                            <p>Редактируйте существующие позиции или быстро удаляйте лишние карточки прямо из таблицы.</p>
                        </div>
                        <span className="admin-section__badge">{loading ? 'Обновляем...' : `${items.length} позиций`}</span>
                    </div>

                    {loading ? (
                        <div className="admin-empty-state">
                            <h3>Подтягиваем актуальный склад</h3>
                            <p>Данные обновятся автоматически, как только сервер вернет список деталей.</p>
                        </div>
                    ) : items.length === 0 ? (
                        <div className="admin-empty-state">
                            <h3>Каталог пока пуст</h3>
                            <p>Добавьте первую карточку через форму слева, и она сразу появится в рабочем списке.</p>
                        </div>
                    ) : (
                        <div className="admin-table-wrap">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Деталь</th>
                                        <th>Категория</th>
                                        <th>Цена</th>
                                        <th>Склад</th>
                                        <th>Совместимость</th>
                                        <th>Действия</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map((part) => (
                                        <tr key={part.id}>
                                            <td data-label="Деталь">
                                                <div className="admin-part-cell">
                                                    <img
                                                        src={part.imageUrl || '/images/placeholder.jpg'}
                                                        alt={part.name}
                                                        className="admin-part-cell__image"
                                                        onError={(event) => {
                                                            event.target.src = '/images/placeholder.jpg';
                                                        }}
                                                    />
                                                    <div className="admin-part-cell__copy">
                                                        <strong>{part.name}</strong>
                                                        <span>{part.article || 'Без артикула'}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td data-label="Категория">{part.category || '—'}</td>
                                            <td data-label="Цена">${part.price}</td>
                                            <td data-label="Склад">
                                                <span className={`admin-stock-pill${part.stock < 10 ? ' is-low' : ''}`}>
                                                    {part.stock ?? 0} шт.
                                                </span>
                                            </td>
                                            <td data-label="Совместимость">
                                                {Array.isArray(part.compatibleModels)
                                                    ? `${part.compatibleModels.length} модели`
                                                    : '—'}
                                            </td>
                                            <td data-label="Действия" className="admin-actions">
                                                <button type="button" className="admin-action-button admin-action-button--edit" onClick={() => startEdit(part)}>
                                                    Изменить
                                                </button>
                                                <button
                                                    type="button"
                                                    className="admin-action-button admin-action-button--delete"
                                                    onClick={() => dispatch(deletePart(part.id))}
                                                >
                                                    Удалить
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

export default AdminPage;
