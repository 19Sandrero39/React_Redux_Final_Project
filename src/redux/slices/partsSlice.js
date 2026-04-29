// redux/slices/partsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Лучше вынести базовый URL в переменную окружения
const API_URL = 'http://localhost:3001/parts';

// --- Асинхронные действия (CRUD) ---
export const fetchParts = createAsyncThunk('parts/fetchParts', async () => {
    const response = await axios.get(API_URL);
    return response.data;
});

export const addPart = createAsyncThunk('parts/addPart', async (newPart) => {
    // newPart содержит все поля (name, price, article, category, ...)
    const response = await axios.post(API_URL, newPart);
    return response.data;
});

export const updatePart = createAsyncThunk('parts/updatePart', async (updatedPart) => {
    const response = await axios.put(`${API_URL}/${updatedPart.id}`, updatedPart);
    return response.data;
});

export const deletePart = createAsyncThunk('parts/deletePart', async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    return id;
});

const initialState = {
    items: [],          // массив запчастей (все поля)
    cart: [],           // корзина: { id, name, price, quantity, ...остальные поля по желанию}
    loading: false,     // глобальная загрузка (для fetchParts)
    error: null,        // глобальная ошибка
    // Можно добавить отдельные состояния для каждого действия, но для простоты пока глобальные
};

const partsSlice = createSlice({
    name: 'parts',
    initialState,
    reducers: {
        // --- Действия корзины ---
        addToCart: (state, action) => {
            const existingItem = state.cart.find(item => item.id === action.payload.id);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                // Сохраняем в корзину минимально необходимые поля (можно расширить)
                const { id, name, price, stock, imageUrl } = action.payload;
                state.cart.push({ id, name, price, quantity: 1, stock, imageUrl });
            }
        },
        removeFromCart: (state, action) => {
            state.cart = state.cart.filter(item => item.id !== action.payload);
        },
        incrementQuantity: (state, action) => {
            const item = state.cart.find(item => item.id === action.payload);
            if (item) item.quantity += 1;
        },
        decrementQuantity: (state, action) => {
            const item = state.cart.find(item => item.id === action.payload);
            if (item && item.quantity > 1) item.quantity -= 1;
        },
        clearCart: (state) => {
            state.cart = [];
        },
    },
    extraReducers: (builder) => {
        builder
            // ----- fetchParts -----
            .addCase(fetchParts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchParts.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchParts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // ----- addPart -----
            .addCase(addPart.pending, (state) => {
                // Можно показать локальную загрузку, но для простоты не делаем отдельный флаг
            })
            .addCase(addPart.fulfilled, (state, action) => {
                state.items.push(action.payload);
            })
            .addCase(addPart.rejected, (state, action) => {
                console.error('Ошибка добавления:', action.error);
                state.error = action.error.message;
            })
            // ----- updatePart -----
            .addCase(updatePart.pending, () => { })
            .addCase(updatePart.fulfilled, (state, action) => {
                const index = state.items.findIndex(item => item.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            })
            .addCase(updatePart.rejected, (state, action) => {
                console.error('Ошибка обновления:', action.error);
                state.error = action.error.message;
            })
            // ----- deletePart -----
            .addCase(deletePart.pending, () => { })
            .addCase(deletePart.fulfilled, (state, action) => {
                state.items = state.items.filter(item => item.id !== action.payload);
                // Также удалить товар из корзины, если он там был
                state.cart = state.cart.filter(item => item.id !== action.payload);
            })
            .addCase(deletePart.rejected, (state, action) => {
                console.error('Ошибка удаления:', action.error);
                state.error = action.error.message;
            });
    },
});

// Экспорт действий корзины
export const {
    addToCart,
    removeFromCart,
    incrementQuantity,
    decrementQuantity,
    clearCart,
} = partsSlice.actions;

export default partsSlice.reducer;