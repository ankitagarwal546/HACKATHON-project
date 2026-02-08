import { Navigate, useLocation } from 'react-router-dom';
import { getStoredToken } from '@/services/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * If localStorage has a token, render children. Otherwise redirect to /login.
 * Backend will later validate the token; for now we only check presence.
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation();
  const token = getStoredToken();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
