import { useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { restoreUser, demoLogin, clearTokenExpired, logout } from '@/redux/slices/auth/authSlice';
import { verifyToken } from '@/hooks/use-auth';

// DEMO MODE ONLY: this site currently has no login screen anywhere - every visitor is
// silently signed in as the admin account in the background so the dashboard and its
// API calls work with zero visible auth gate. Remove this component (and the
// backend /demo-login route + UserService.demoLogin) when the site goes back to being
// a real ordering system with real accounts.
const DemoAutoLogin = () => {
  const dispatch = useDispatch();
  const { tokenExpired } = useSelector((state) => state.auth);
  const hasInitialized = useRef(false);

  const silentLogin = useCallback(() => {
    dispatch(demoLogin());
  }, [dispatch]);

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const init = async () => {
      try {
        const result = await verifyToken();
        if (result.ok && result.user) {
          dispatch(restoreUser(result.user));
          return;
        }
      } catch {
        // fall through to silent login
      }
      silentLogin();
    };

    init();
  }, [dispatch, silentLogin]);

  useEffect(() => {
    if (tokenExpired) {
      dispatch(clearTokenExpired());
      dispatch(logout());
      silentLogin();
    }
  }, [tokenExpired, dispatch, silentLogin]);

  return null;
};

export default DemoAutoLogin;
