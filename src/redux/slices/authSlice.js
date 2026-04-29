import { createSlice } from '@reduxjs/toolkit';

const getInitialUser = () => {
    try {
        const saved = localStorage.getItem('user');
        return saved ? JSON.parse(saved) : null;
    } catch (e) {
        return null;
    }
};

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: getInitialUser(),
        isAuthenticated: !!localStorage.getItem('user'),
    },
    reducers: {
        login: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = true;
            localStorage.setItem('user', JSON.stringify(action.payload));
        },
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            localStorage.removeItem('user');
        }
    }
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;