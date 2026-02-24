import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthProvider';

export function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-14">
            <div className="flex items-center gap-6">
              <Link to="/dashboard" className="text-lg font-semibold text-gray-800">
                Expense Tracker
              </Link>
              <Link
                to="/dashboard"
                className="text-gray-600 hover:text-gray-900 px-2 py-1 rounded"
              >
                Dashboard
              </Link>
              <Link
                to="/expenses"
                className="text-gray-600 hover:text-gray-900 px-2 py-1 rounded"
              >
                Expenses
              </Link>
              <Link
                to="/categories"
                className="text-gray-600 hover:text-gray-900 px-2 py-1 rounded"
              >
                Categories
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">{user?.email}</span>
              <button
                type="button"
                onClick={handleLogout}
                className="text-sm text-red-600 hover:text-red-800"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Outlet />
      </main>
    </div>
  );
}
