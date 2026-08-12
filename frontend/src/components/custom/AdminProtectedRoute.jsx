import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import OneLoader from '@/components/ui/OneLoader';

/**
 * AdminProtectedRoute — wraps /admin/* routes.
 *
 * Flow:
 *  1. On first render, AuthInit fires verifyToken in the background.
 *     During this brief window, status is 'idle' then 'loading'.
 *     We give it a short grace period before making an auth decision.
 *  2. Once status is 'succeeded' or 'failed'/'idle' (after init), we evaluate.
 *  3. If user.role >= 1 → render children.
 *  4. Otherwise → redirect to /admin/login.
 */
const AdminProtectedRoute = ({ children }) => {
  const { user, isAuthenticated, status } = useSelector((state) => state.auth);

  // Give AuthInit a grace window before deciding — avoids flash-redirect on refresh
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // If already resolved, mark ready immediately
    if (status === 'succeeded' || status === 'failed') {
      setReady(true);
      return;
    }
    // Otherwise wait a tick for AuthInit to fire, then a max of 2s
    const timer = setTimeout(() => setReady(true), 2000);
    return () => clearTimeout(timer);
  }, [status]);

  // Still resolving session
  if (!ready || status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-50">
        <OneLoader size="large" text="Verifying session..." />
      </div>
    );
  }

  // Not logged in or not an admin (role 0 = user, 1 = admin, 2 = super admin)
  const isAdmin = isAuthenticated && user && user.role >= 1;
  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default AdminProtectedRoute;
