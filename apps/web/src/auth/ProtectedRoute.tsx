import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import { Loading } from '../components/common/Loading';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
