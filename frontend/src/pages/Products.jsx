import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

/**
 * The menu now lives as a section on the single-page Home (`/#menu`).
 * This route is kept only so old bookmarks/shared links (`/products`,
 * `/all-products`, optionally with `?category=`/`?search=`) still work.
 */
const Products = () => {
  const { search } = useLocation();
  return <Navigate to={`/${search}#menu`} replace />;
};

export default Products;
