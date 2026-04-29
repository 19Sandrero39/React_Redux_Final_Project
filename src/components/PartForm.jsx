import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addPart } from '../redux/slices/partsSlice';
import './PartForm.css'; // создайте при необходимости

const PartForm = () => {
    const [form, setForm] = useState({
        name: '',
        price: '',
        article: '',
        category: '',
        description: '',
        stock: '',
        imageUrl: '',
        compatibleModels: ''
    });
    const dispatch = useDispatch();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // compatibleModels из строки превращаем в массив (разделитель запятая)
        const compatible = form.compatibleModels.split(',').map(s => s.trim()).filter(Boolean);
        const partData = {
            name: form.name,
            price: Number(form.price),
            article: form.article,
            category: form.category,
            description: form.description,
            stock: Number(form.stock) || 0,
            imageUrl: form.imageUrl || '/images/default.jpg',
            compatibleModels: compatible.length ? compatible : ['Универсальный']
        };
        dispatch(addPart(partData));
        // сброс формы
        setForm({
            name: '', price: '', article: '', category: '',
            description: '', stock: '', imageUrl: '', compatibleModels: ''
        });
    };

    return (
        <form onSubmit={handleSubmit} className="part-form">
            <input name="name" value={form.name} onChange={handleChange} placeholder="Название" required />
            <input name="price" type="number" value={form.price} onChange={handleChange} placeholder="Цена" required />
            <input name="article" value={form.article} onChange={handleChange} placeholder="Артикул" />
            <input name="category" value={form.category} onChange={handleChange} placeholder="Категория" />
            <textarea name="description" value={form.description} onChange={handleChange} placeholder="Описание" rows="2" />
            <input name="stock" type="number" value={form.stock} onChange={handleChange} placeholder="Количество на складе" />
            <input name="imageUrl" value={form.imageUrl} onChange={handleChange} placeholder="URL изображения" />
            <input name="compatibleModels" value={form.compatibleModels} onChange={handleChange} placeholder="Совместимые модели (через запятую)" />
            <button type="submit">Добавить запчасть</button>
        </form>
    );
};

export default PartForm;