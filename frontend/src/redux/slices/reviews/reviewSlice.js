import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import reviewService from "./reviewService";

export const AddReview = createAsyncThunk(
    'reviews/AddReview',
    async (inputValues, thunkAPI) => {
        try {
            const res = await reviewService.createReview(inputValues);
            return res;
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);

export const fetchAllReviews = createAsyncThunk(
    'reviews/fetchAllReviews',
    async (_, thunkAPI) => {
        try {
            const res = await reviewService.getAllReviews();
            return res;
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);

export const fetchActiveReviews = createAsyncThunk(
    'reviews/fetchActiveReviews',
    async (_, thunkAPI) => {
        try {
            const res = await reviewService.getActiveReviews();
            return res;
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);

export const updateReview = createAsyncThunk(
    'reviews/updateReview',
    async ({ id, inputValues }, thunkAPI) => {
        try {
            const res = await reviewService.updateReview({ id, inputValues });
            return res;
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);

export const deleteReview = createAsyncThunk(
    'reviews/deleteReview',
    async (id, thunkAPI) => {
        try {
            const res = await reviewService.deleteReview(id);
            return { id, ...res };
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);

export const toggleReviewActive = createAsyncThunk(
    'reviews/toggleReviewActive',
    async (id, thunkAPI) => {
        try {
            const res = await reviewService.toggleReviewActive(id);
            return res;
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);

const initialState = {
    reviews: [],
    activeReviews: [],
    status: 'idle',
    activeStatus: 'idle',
    error: null,
};

export const reviewsSlice = createSlice({
    name: 'reviews',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(AddReview.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(AddReview.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.reviews.unshift(action.payload.data);
            })
            .addCase(AddReview.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(fetchAllReviews.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchAllReviews.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.reviews = action.payload.data || [];
            })
            .addCase(fetchAllReviews.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
                state.reviews = [];
            })
            .addCase(fetchActiveReviews.pending, (state) => {
                state.activeStatus = 'loading';
            })
            .addCase(fetchActiveReviews.fulfilled, (state, action) => {
                state.activeStatus = 'succeeded';
                state.activeReviews = action.payload.data || [];
            })
            .addCase(fetchActiveReviews.rejected, (state) => {
                state.activeStatus = 'failed';
                state.activeReviews = [];
            })
            .addCase(updateReview.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(updateReview.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const updated = action.payload.data;
                if (!updated || !updated._id) return;
                const index = state.reviews.findIndex((r) => String(r._id) === String(updated._id));
                if (index !== -1) {
                    state.reviews[index] = updated;
                }
            })
            .addCase(updateReview.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(deleteReview.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(deleteReview.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.reviews = state.reviews.filter((r) => r._id !== action.payload.id);
            })
            .addCase(deleteReview.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(toggleReviewActive.fulfilled, (state, action) => {
                const updated = action.payload.data;
                if (!updated || !updated._id) return;
                const index = state.reviews.findIndex((r) => String(r._id) === String(updated._id));
                if (index !== -1) {
                    state.reviews[index] = { ...state.reviews[index], active: updated.active };
                }
            })
            .addCase(toggleReviewActive.rejected, (state, action) => {
                state.error = action.payload;
            });
    }
});

export default reviewsSlice.reducer;
