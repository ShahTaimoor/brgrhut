import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import AuthInit from './components/custom/AuthInit';
import AdminProtectedRoute from './components/custom/AdminProtectedRoute';
import ErrorBoundary from './components/custom/ErrorBoundary';
import OneLoader from './components/ui/OneLoader';
import { Suspense, lazy } from 'react';
import { Toaster } from './components/ui/sonner';

// Lazy-load pages
const RootLayout = lazy(() => import('./components/layouts/RootLayout'));
const AdminLayout = lazy(() => import('./components/layouts/AdminLayout'));

const Home = lazy(() => import('./pages/Home'));
const Products = lazy(() => import('./pages/Products'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const ErrorPage = lazy(() => import('./pages/Error'));
const Category = lazy(() => import('./pages/Category'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const Users = lazy(() => import('./pages/Users'));
const AdminProfile = lazy(() => import('./pages/AdminProfile'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));

const CreateProducts = lazy(() => import('./components/custom/CreateProducts'));
const AllProducts = lazy(() => import('./components/custom/AllProducts'));
const LowStock = lazy(() => import('./components/custom/LowStock'));
const UpdateProduct = lazy(() => import('./components/custom/UpdateProduct'));
const AllReviews = lazy(() => import('./components/custom/AllReviews'));
const CreateReview = lazy(() => import('./components/custom/CreateReview'));
const UpdateReview = lazy(() => import('./components/custom/UpdateReview'));
const Media = lazy(() => import('./pages/Media'));
const Attendance = lazy(() => import('./pages/Attendance'));
const AttendancePerformance = lazy(() => import('./pages/AttendancePerformance'));

const App = () => {
  const router = createBrowserRouter([
    {
      path: '/',
      element: (
        <RootLayout>
          <ErrorBoundary>
            <Home />
          </ErrorBoundary>
        </RootLayout>
      ),
    },
    {
      path: '/products',
      element: (
        <RootLayout>
          <ErrorBoundary>
            <Products />
          </ErrorBoundary>
        </RootLayout>
      ),
    },
    {
      path: '/product/:id',
      element: (
        <RootLayout>
          <ErrorBoundary>
            <ProductDetail />
          </ErrorBoundary>
        </RootLayout>
      ),
    },
    {
      path: '/all-products',
      element: (
        <RootLayout>
          <ErrorBoundary>
            <Products />
          </ErrorBoundary>
        </RootLayout>
      ),
    },
    {
      path: '/terms-of-service',
      element: (
        <RootLayout>
          <TermsOfService />
        </RootLayout>
      ),
    },
    {
      path: '/privacy-policy',
      element: (
        <RootLayout>
          <PrivacyPolicy />
        </RootLayout>
      ),
    },
    // Standalone admin login — no layout wrapper
    {
      path: '/admin/login',
      element: <AdminLogin />,
    },
    // Protected admin routes
    {
      path: '/admin/dashboard',
      element: (
        <AdminProtectedRoute>
          <AdminLayout>
            <CreateProducts />
          </AdminLayout>
        </AdminProtectedRoute>
      ),
    },
    {
      path: '/admin/category',
      element: (
        <AdminProtectedRoute>
          <AdminLayout>
            <Category />
          </AdminLayout>
        </AdminProtectedRoute>
      ),
    },
    {
      path: '/admin/dashboard/all-products',
      element: (
        <AdminProtectedRoute>
          <AdminLayout>
            <AllProducts />
          </AdminLayout>
        </AdminProtectedRoute>
      ),
    },
    {
      path: '/admin/dashboard/low-stock',
      element: (
        <AdminProtectedRoute>
          <AdminLayout>
            <LowStock />
          </AdminLayout>
        </AdminProtectedRoute>
      ),
    },
    {
      path: '/admin/dashboard/update/:id',
      element: (
        <AdminProtectedRoute>
          <AdminLayout>
            <UpdateProduct />
          </AdminLayout>
        </AdminProtectedRoute>
      ),
    },
    {
      path: '/admin/dashboard/all-reviews',
      element: (
        <AdminProtectedRoute>
          <AdminLayout>
            <AllReviews />
          </AdminLayout>
        </AdminProtectedRoute>
      ),
    },
    {
      path: '/admin/dashboard/create-review',
      element: (
        <AdminProtectedRoute>
          <AdminLayout>
            <CreateReview />
          </AdminLayout>
        </AdminProtectedRoute>
      ),
    },
    {
      path: '/admin/dashboard/update-review/:id',
      element: (
        <AdminProtectedRoute>
          <AdminLayout>
            <UpdateReview />
          </AdminLayout>
        </AdminProtectedRoute>
      ),
    },
    {
      path: '/admin/dashboard/users',
      element: (
        <AdminProtectedRoute>
          <AdminLayout>
            <Users />
          </AdminLayout>
        </AdminProtectedRoute>
      ),
    },
    {
      path: '/admin/dashboard/media',
      element: (
        <AdminProtectedRoute>
          <AdminLayout>
            <Media />
          </AdminLayout>
        </AdminProtectedRoute>
      ),
    },
    {
      path: '/admin/dashboard/attendance',
      element: (
        <AdminProtectedRoute>
          <AdminLayout>
            <Attendance />
          </AdminLayout>
        </AdminProtectedRoute>
      ),
    },
    {
      path: '/admin/dashboard/attendance-performance',
      element: (
        <AdminProtectedRoute>
          <AdminLayout>
            <AttendancePerformance />
          </AdminLayout>
        </AdminProtectedRoute>
      ),
    },
    {
      path: '/admin/profile',
      element: (
        <AdminProtectedRoute>
          <AdminLayout>
            <AdminProfile />
          </AdminLayout>
        </AdminProtectedRoute>
      ),
    },
    {
      path: '*',
      element: (
        <RootLayout>
          <ErrorPage />
        </RootLayout>
      ),
    },
  ]);

  return (
    <Provider store={store}>
      {/* AuthInit silently restores admin session from HTTP-only cookie on every page load */}
      <AuthInit />
      <ErrorBoundary>
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><OneLoader size="large" text="Loading..." /></div>}>
          <RouterProvider router={router} />
        </Suspense>
      </ErrorBoundary>
      <Toaster />
    </Provider>
  );
};

export default App;
