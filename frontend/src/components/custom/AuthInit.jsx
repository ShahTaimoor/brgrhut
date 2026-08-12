import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { restoreUser } from '@/redux/slices/auth/authSlice';
import { verifyToken } from '@/hooks/use-auth';

/**
 * AuthInit — silently restores the user session from the HTTP-only cookie on
 * every page load. Replaces DemoAutoLogin (which bypassed auth entirely).
 * Renders nothing — purely a side-effect component.
 */
const AuthInit = () => {
  const dispatch = useDispatch();
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const init = async () => {
      try {
        const result = await verifyToken();
        if (result.ok && result.user) {
          dispatch(restoreUser(result.user));
        }
        // If no valid session → leave Redux state as unauthenticated (user must log in)
      } catch {
        // No session — do nothing
      }
    };

    init();
  }, [dispatch]);

  return null;
};

export default AuthInit;
