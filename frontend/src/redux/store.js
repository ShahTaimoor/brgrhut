
import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/auth/authSlice'
import categoriesReducer from './slices/categories/categoriesSlice'
import productsReducer from './slices/products/productSlice'
import reviewsReducer from './slices/reviews/reviewSlice'
import { setStoreReference } from './slices/auth/axiosInstance'

export const store = configureStore({
    reducer: {
        auth: authReducer,
        products: productsReducer,
        categories: categoriesReducer,
        reviews: reviewsReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // Ignore these action types
                ignoredActions: [
                    'products/fetchAll/fulfilled',
                    'products/getSingleProduct/fulfilled',
                    'products/AddProduct/fulfilled',
                    'products/AddProduct/pending',
                    'products/AddProduct/rejected',
                    'products/updateSingleProduct/fulfilled',
                    'products/updateSingleProduct/pending',
                    'products/updateSingleProduct/rejected',
                    'products/importProductsFromExcel/fulfilled',
                    'reviews/AddReview/fulfilled',
                    'reviews/AddReview/pending',
                    'reviews/AddReview/rejected',
                ],
                // Ignore these field paths in all actions
                ignoredActionPaths: [
                    'payload.timestamp', 
                    'payload.error.stack',
                    'meta.arg.inputValues', // Allow FormData in updateSingleProduct and AddProduct actions
                ],
                // Ignore these paths in the state
                ignoredPaths: [
                    'products.products',
                    'products.singleProducts',
                    'auth.user',
                ],
                // Increase the warning threshold to 50ms
                warnAfter: 50,
            },
        }),
})

// Set the store reference for axiosInstance
setStoreReference(store)