// src/components/ProtectedRoute.jsx
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { isAuthenticated, user } = useSelector((state) => state.auth);

    if (!isAuthenticated) {
        return <Navigate to="/auth" />;
    }

    if (adminOnly && user?.role !== 'admin') {
        return <Navigate to="/" />; // Обычного юзера выкидываем на главную
    }

    return children;
};

export default ProtectedRoute;