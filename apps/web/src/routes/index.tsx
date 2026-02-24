import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { ProtectedRoute } from '../auth/ProtectedRoute';
import { Login } from '../pages/Login';
import { Register } from '../pages/Register';
import { Dashboard } from '../pages/Dashboard';
import { Expenses } from '../pages/Expenses';
import { Categories } from '../pages/Categories';
import { Layout } from '../components/layout/Navbar';

const router = createBrowserRouter([
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'expenses', element: <Expenses /> },
      { path: 'categories', element: <Categories /> },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
]);

export function Routes() {
  return <RouterProvider router={router} />;
}
