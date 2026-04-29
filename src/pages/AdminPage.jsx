import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addPart, deletePart, fetchParts, updatePart } from '../redux/slices/partsSlice';
import './AdminPage.css';

const AdminPage = () => {
    const [form, setForm] = useState({
        id: null,
        name: '',
        price: '',
        article: '',
        category: '',
        description: '',
        stock: '',
        imageUrl: '',
        compatibleModels: ''
    });
    const [success, setSuccess] = useState('');
    const dispatch = useDispatch();
    const { items } = useSelector((state) => state.parts);

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
            compatibleModels: Array.isArray(part.compatibleModels) ? part.compatibleModels.join(', ') : ''
        });
    };

    const resetForm = () => {
        setForm({
            id: null,
            name: '',
            price: '',
            article: '',
            category: '',
            description: '',
            stock: '',
            imageUrl: '',
            compatibleModels: ''
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const compatibleArray = form.compatibleModels.split(',').map(s => s.trim()).filter(Boolean);
        const partData = {
            name: form.name,
            price: Number(form.price),
            article: form.article,
            category: form.category,
            description: form.description,
            stock: Number(form.stock) || 0,
            imageUrl: form.imageUrl || '/images/default.jpg',
            compatibleModels: compatibleArray.length ? compatibleArray : ['Универсальный']
        };

        if (form.id) {
            dispatch(updatePart({ id: form.id, ...partData }));
            setSuccess('Товар успешно обновлен!');
        } else {
            dispatch(addPart(partData));
            setSuccess('Товар успешно добавлен!');
        }
        resetForm();
        setTimeout(() => setSuccess(''), 3000);
    };

    return (
        <div className="admin-container">
            <h1>Панель администратора</h1>

            <section className="admin-section">
                <h3>{form.id ? 'Редактировать запчасть' : 'Добавить запчасть'}</h3>
                {success && <div className="success-message">{success}</div>}

                <form onSubmit={handleSubmit} className="admin-form">
                    <input name="name" value={form.name} onChange={handleChange} placeholder="Название" required />
                    <input name="price" type="number" step="0.01" value={form.price} onChange={handleChange} placeholder="Цена ($)" required />
                    <input name="article" value={form.article} onChange={handleChange} placeholder="Артикул" />
                    <input name="category" value={form.category} onChange={handleChange} placeholder="Категория" />
                    <textarea name="description" value={form.description} onChange={handleChange} placeholder="Описание" rows="3" />
                    <input name="stock" type="number" value={form.stock} onChange={handleChange} placeholder="Количество на складе" />
                    <input name="imageUrl" value={form.imageUrl} onChange={handleChange} placeholder="URL изображения" />
                    <input name="compatibleModels" value={form.compatibleModels} onChange={handleChange} placeholder="Совместимые модели (через запятую)" />

                    <div className="form-actions">
                        <button type="submit" className={`submit-btn ${form.id ? 'edit-mode' : 'add-mode'}`}>
                            {form.id ? 'Сохранить изменения' : 'Добавить товар'}
                        </button>
                        {form.id && <button type="button" className="cancel-btn" onClick={resetForm}>Отмена</button>}
                    </div>
                </form>
            </section>

            <section className="admin-section">
                <h3>Управление списком</h3>
                <div className="table-wrapper">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Название</th>
                                <th>Цена</th>
                                <th>Категория</th>
                                <th>Артикул</th>
                                <th>Наличие</th>
                                <th>Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((part) => (
                                <tr key={part.id}>
                                    <td data-label="Название">{part.name}</td>
                                    <td data-label="Цена">{part.price} $</td>
                                    <td data-label="Категория">{part.category || '—'}</td>
                                    <td data-label="Артикул">{part.article || '—'}</td>
                                    <td data-label="Наличие">{part.stock ?? '?'} шт.</td>
                                    <td data-label="Действия" className="actions-cell">
                                        <button className="btn-edit" onClick={() => startEdit(part)}>Изменить</button>
                                        <button className="btn-delete-small" onClick={() => dispatch(deletePart(part.id))}>Удалить</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
};

export default AdminPage;