import { Navigate } from 'react-router-dom';
import { useAuthenticationContext } from '../context/AuthenticationContext';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

// All visitors
const NonAuthRoute = ({ children, redirectTo = '/' }) => {
  const { isAuthenticated } = useAuthenticationContext();

  return !isAuthenticated ? children : <Navigate to={redirectTo} />;
};

// All users
const ProtectedRoute = ({ children, redirectTo = '/sign-in' }) => {
  const { isAuthenticated } = useAuthenticationContext();

  return isAuthenticated ? <>{children}</> : <Navigate to={redirectTo} />;
};

// Admin only
const AdminProtectedRoute = ({ children, redirectTo = '/sign-in' }) => {
  const { isAdmin, isAuthenticated } = useAuthenticationContext();

  useEffect(() => {
    if (isAuthenticated && !isAdmin) {
      toast.error('You are not Admin');
    }
  }, [isAuthenticated]);

  return isAuthenticated ? (
    isAdmin ? (
      <>{children}</>
    ) : (
      <>
        <Navigate to={'/'} />
      </>
    )
  ) : (
    <Navigate to={redirectTo} />
  );
};

export { NonAuthRoute, ProtectedRoute, AdminProtectedRoute };
