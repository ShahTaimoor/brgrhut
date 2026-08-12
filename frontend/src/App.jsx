import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import DemoAutoLogin from './components/custom/DemoAutoLogin';
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
    {
      path: '/admin/dashboard',
      element: (
        <AdminLayout>
          <CreateProducts />
        </AdminLayout>
      ),
    },
    {
      path: '/admin/category',
      element: (
        <AdminLayout>
          <Category />
        </AdminLayout>
      ),
    },
    {
      path: '/admin/dashboard/all-products',
      element: (
        <AdminLayout>
          <AllProducts />
        </AdminLayout>
      ),
    },
    {
      path: '/admin/dashboard/low-stock',
      element: (
        <AdminLayout>
          <LowStock />
        </AdminLayout>
      ),
    },
    {
      path: '/admin/dashboard/update/:id',
      element: (
        <AdminLayout>
          <UpdateProduct />
        </AdminLayout>
      ),
    },
    {
      path: '/admin/dashboard/all-reviews',
      element: (
        <AdminLayout>
          <AllReviews />
        </AdminLayout>
      ),
    },
    {
      path: '/admin/dashboard/create-review',
      element: (
        <AdminLayout>
          <CreateReview />
        </AdminLayout>
      ),
    },
    {
      path: '/admin/dashboard/update-review/:id',
      element: (
        <AdminLayout>
          <UpdateReview />
        </AdminLayout>
      ),
    },
    {
      path: '/admin/dashboard/users',
      element: (
        <AdminLayout>
          <Users />
        </AdminLayout>
      ),
    },
    {
      path: '/admin/dashboard/media',
      element: (
        <AdminLayout>
          <Media />
        </AdminLayout>
      ),
    },
    {
      path: '/admin/dashboard/attendance',
      element: (
        <AdminLayout>
          <Attendance />
        </AdminLayout>
      ),
    },
    {
      path: '/admin/dashboard/attendance-performance',
      element: (
        <AdminLayout>
          <AttendancePerformance />
        </AdminLayout>
      ),
    },
    {
      path: '/admin/profile',
      element: (
        <AdminLayout>
          <AdminProfile />
        </AdminLayout>
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
      <DemoAutoLogin />
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
