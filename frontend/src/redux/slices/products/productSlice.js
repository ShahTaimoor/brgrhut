import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import productService from "./productService";

export const AddProduct = createAsyncThunk(
    'products/AddProduct',
    async (inputValues, thunkAPI) => {
        try {
            const res = await productService.createProduct(inputValues);
            return res;
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);

export const fetchProducts = createAsyncThunk(
    "products/fetchAll",
    async ({ category, page = 1, limit = 24, availabilityFilter, sortBy = 'az' }, thunkAPI) => {
        try {
            const res = await productService.allProduct(category, page, limit, availabilityFilter, sortBy);
            return res;
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);

export const getSingleProduct = createAsyncThunk(
    "products/getSingleProduct",
    async (id, thunkAPI) => {
        try {
            const res = await productService.getSingleProd(id);
            return res;
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);

export const updateSingleProduct = createAsyncThunk(
    "products/updateSingleProduct",
    async ({ id, inputValues }, thunkAPI) => {
        try {
            const res = await productService.updateProd({ id, inputValues });
            return res;
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);

export const deleteSingleProduct = createAsyncThunk(
    'products/deleteSingleProduct',
    async (id, thunkAPI) => {
        try {
            const res = await productService.deleteProduct(id);
            return { id, ...res };
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);

export const importProductsFromExcel = createAsyncThunk(
    'products/importProductsFromExcel',
    async (excelFile, thunkAPI) => {
        try {
            const res = await productService.importProductsFromExcel(excelFile);
            return res;
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);

// Swapped to match the new toggle naming schema
export const updateProductAvailability = createAsyncThunk(
    'products/updateProductAvailability',
    async ({ id, isAvailable }, thunkAPI) => {
        try {
            const res = await productService.updateProductAvailability({ id, isAvailable });
            return res;
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);

export const bulkUpdateFeatured = createAsyncThunk(
    'products/bulkUpdateFeatured',
    async ({ productIds, isFeatured }, thunkAPI) => {
        try {
            const res = await productService.bulkUpdateFeatured({ productIds, isFeatured });
            return res;
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);

export const searchProducts = createAsyncThunk(
    'products/searchProducts',
    async ({ query, limit = 20, page = 1 }, thunkAPI) => {
        try {
            const res = await productService.searchProducts(query, limit, page);
            return res;
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);

export const fetchSearchSuggestions = createAsyncThunk(
    'products/fetchSearchSuggestions',
    async ({ query, limit = 8 }, thunkAPI) => {
        try {
            const res = await productService.searchSuggestions(query, limit);
            return res;
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);

// Swapped out endpoint parameters from low-stock indicators to fast-food sold out states
export const fetchSoldOutCount = createAsyncThunk(
    'products/fetchSoldOutCount',
    async (_, thunkAPI) => {
        try {
            const axiosInstance = (await import('../auth/axiosInstance')).default;
            const response = await axiosInstance.get('/sold-out-count', {
                headers: { 'Content-Type': 'application/json' }
            });
            return response.data.count || 0;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message || 'Failed to fetch sold-out food items count');
        }
    }
);

// Fallback alias for components still referencing the old name layout
export const fetchLowStockCount = fetchSoldOutCount;

const initialState = {
    products: [],
    singleProducts: null,
    status: 'idle',
    error: null,
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    soldOutCount: 0,
    lowStockCount: 0,
    // Search state
    searchResults: [],
    searchStatus: 'idle',
    searchQuery: '',
    searchPagination: {
        total: 0,
        page: 1,
        limit: 20,
        totalPages: 0
    },
    // Suggestions state
    suggestions: {
        products: [],
        categories: []
    },
    suggestionsStatus: 'idle',
    suggestionsQuery: ''
};

export const productsSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        clearSearchResults: (state) => {
            state.searchResults = [];
            state.searchQuery = '';
            state.searchStatus = 'idle';
            state.searchPagination = {
                total: 0,
                page: 1,
                limit: 20,
                totalPages: 0
            };
        },
        clearSuggestions: (state) => {
            state.suggestions = { products: [], categories: [] };
            state.suggestionsQuery = '';
            state.suggestionsStatus = 'idle';
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(AddProduct.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(AddProduct.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const newProduct = action.payload.product;
                
                const transformedProduct = {
                    ...newProduct,
                    image: newProduct.picture?.secure_url || null
                };
                
                state.products.push(transformedProduct);
            })
            .addCase(AddProduct.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(fetchProducts.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const { data, pagination } = action.payload || {};
                state.products = data || [];
                state.currentPage = pagination?.page || 1;
                state.totalPages = pagination?.totalPages || 1;
                state.totalItems = pagination?.total || 0;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
                state.products = [];
                state.totalItems = 0;
            })
            .addCase(updateSingleProduct.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
           .addCase(updateSingleProduct.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const updatedProduct = action.payload.product;

                if (!updatedProduct || !updatedProduct._id) {
                    return;
                }

                const imageUrl = updatedProduct.picture?.secure_url || updatedProduct.image || null;
                
                const existingProduct = state.products.find(p => String(p._id) === String(updatedProduct._id));
                const existingImageUrl = existingProduct?.image || existingProduct?.picture?.secure_url || null;
                const imageChanged = existingImageUrl !== imageUrl;
                
                const transformedProduct = {
                    ...updatedProduct,
                    picture: updatedProduct.picture || (imageUrl ? { secure_url: imageUrl } : null),
                    image: imageUrl,
                    _imageUpdated: imageChanged ? Date.now() : (existingProduct?._imageUpdated || Date.now())
                };

                const compareIds = (id1, id2) => (id1 && id2) && String(id1) === String(id2);

                const productsIndex = state.products.findIndex(p => compareIds(p._id, updatedProduct._id));
                if (productsIndex !== -1) {
                    const existingProduct = state.products[productsIndex];
                    const updatedProductObj = {
                        ...existingProduct,
                        ...transformedProduct,
                        category: transformedProduct.category || existingProduct.category,
                        picture: transformedProduct.picture,
                        image: transformedProduct.image,
                        _imageUpdated: transformedProduct._imageUpdated
                    };
                    state.products = [
                        ...state.products.slice(0, productsIndex),
                        updatedProductObj,
                        ...state.products.slice(productsIndex + 1)
                    ];
                }

                if (state.searchResults && Array.isArray(state.searchResults)) {
                    const searchIndex = state.searchResults.findIndex(p => compareIds(p._id, updatedProduct._id));
                    if (searchIndex !== -1) {
                        const existingProduct = state.searchResults[searchIndex];
                        const updatedSearchProduct = {
                            ...existingProduct,
                            ...transformedProduct,
                            category: transformedProduct.category || existingProduct.category,
                            picture: transformedProduct.picture,
                            image: transformedProduct.image,
                            _imageUpdated: transformedProduct._imageUpdated
                        };
                        state.searchResults = [
                            ...state.searchResults.slice(0, searchIndex),
                            updatedSearchProduct,
                            ...state.searchResults.slice(searchIndex + 1)
                        ];
                    }
                }

                if (state.singleProducts && compareIds(state.singleProducts._id, updatedProduct._id)) {
                    state.singleProducts = {
                        ...state.singleProducts,
                        ...transformedProduct,
                        category: transformedProduct.category || state.singleProducts.category,
                        picture: transformedProduct.picture,
                        image: transformedProduct.image,
                        _imageUpdated: transformedProduct._imageUpdated
                    };
                }
            })
            .addCase(updateSingleProduct.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(getSingleProduct.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(getSingleProduct.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.singleProducts = action.payload.product;
            })
            .addCase(getSingleProduct.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(deleteSingleProduct.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(deleteSingleProduct.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.products = state.products.filter(prod => prod._id !== action.payload.id);
            })
            .addCase(deleteSingleProduct.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(importProductsFromExcel.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(importProductsFromExcel.fulfilled, (state) => {
                state.status = 'succeeded';
            })
            .addCase(importProductsFromExcel.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(updateProductAvailability.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(updateProductAvailability.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const updatedProduct = action.payload.product;
                
                const index = state.products.findIndex(p => String(p._id) === String(updatedProduct._id));
                if (index !== -1) {
                    state.products[index] = {
                        ...state.products[index],
                        isAvailable: updatedProduct.isAvailable
                    };
                }
            })
            .addCase(updateProductAvailability.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(bulkUpdateFeatured.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(bulkUpdateFeatured.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const { productIds, isFeatured } = action.meta.arg;
                
                state.products = state.products.map(product => {
                    if (productIds.includes(product._id)) {
                        return {
                            ...product,
                            isFeatured: isFeatured
                        };
                    }
                    return product;
                });
            })
            .addCase(bulkUpdateFeatured.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(fetchSoldOutCount.fulfilled, (state, action) => {
                state.soldOutCount = action.payload;
                state.lowStockCount = action.payload; // Sync both states for interface compatibility
            })
            .addCase(fetchSoldOutCount.rejected, (state) => {
                state.soldOutCount = 0;
                state.lowStockCount = 0;
            })
            .addCase(searchProducts.pending, (state) => {
                state.searchStatus = 'loading';
                state.error = null;
            })
            .addCase(searchProducts.fulfilled, (state, action) => {
                state.searchStatus = 'succeeded';
                const { data, query, pagination } = action.payload || {};
                state.searchResults = data || [];
                state.searchQuery = query || '';
                state.searchPagination = pagination || {
                    total: 0,
                    page: 1,
                    limit: 20,
                    totalPages: 0
                };
            })
            .addCase(searchProducts.rejected, (state, action) => {
                state.searchStatus = 'failed';
                state.error = action.payload;
                state.searchResults = [];
            })
            .addCase(fetchSearchSuggestions.pending, (state) => {
                state.suggestionsStatus = 'loading';
            })
            .addCase(fetchSearchSuggestions.fulfilled, (state, action) => {
                state.suggestionsStatus = 'succeeded';
                const { data, query } = action.payload || {};
                state.suggestions = data || { products: [], categories: [] };
                state.suggestionsQuery = query || '';
            })
            .addCase(fetchSearchSuggestions.rejected, (state) => {
                state.suggestionsStatus = 'failed';
                state.suggestions = { products: [], categories: [] };
            })
    }
});

export const { clearSearchResults, clearSuggestions } = productsSlice.actions;
export default productsSlice.reducer;