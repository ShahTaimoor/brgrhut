import axiosInstance from '../auth/axiosInstance';

// create review (admin)
const createReview = async (inputValues) => {
    try {
        const axiosResponse = await axiosInstance.post(
            '/create-review',
            inputValues,
            {
                headers: { 'Content-Type': 'multipart/form-data' },
            }
        );
        return axiosResponse.data;
    } catch (error) {
        const errorMessage =
            error.response?.data?.message || error.message || 'Something went wrong';
        return Promise.reject(errorMessage);
    }
};

// all reviews (admin - every status)
const getAllReviews = async () => {
    try {
        const axiosResponse = await axiosInstance.get(
            '/all-reviews',
            {
                headers: { 'Content-Type': 'application/json' },
            }
        );
        return axiosResponse.data;
    } catch (error) {
        const errorMessage =
            error.response?.data?.message || error.message || 'Something went wrong';
        return Promise.reject(errorMessage);
    }
};

// active reviews (public - storefront testimonials)
const getActiveReviews = async () => {
    try {
        const axiosResponse = await axiosInstance.get(
            '/active-reviews',
            {
                headers: { 'Content-Type': 'application/json' },
            }
        );
        return axiosResponse.data;
    } catch (error) {
        const errorMessage =
            error.response?.data?.message || error.message || 'Something went wrong';
        return Promise.reject(errorMessage);
    }
};

// update review (admin)
const updateReview = async ({ inputValues, id }) => {
    try {
        const axiosResponse = await axiosInstance.put(
            `/update-review/${id}`,
            inputValues,
            {
                headers: { 'Content-Type': 'multipart/form-data' },
            }
        );
        return axiosResponse.data;
    } catch (error) {
        const errorMessage =
            error.response?.data?.message || error.message || 'Something went wrong';
        return Promise.reject(errorMessage);
    }
};

// delete review (admin)
const deleteReview = async (id) => {
    try {
        const axiosResponse = await axiosInstance.delete(
            `/delete-review/${id}`,
            {
                headers: { 'Content-Type': 'application/json' },
            }
        );
        return axiosResponse.data;
    } catch (error) {
        const errorMessage =
            error.response?.data?.message || error.message || 'Something went wrong';
        return Promise.reject(errorMessage);
    }
};

// toggle review active status (admin)
const toggleReviewActive = async (id) => {
    try {
        const axiosResponse = await axiosInstance.patch(
            `/toggle-review-active/${id}`,
            {},
            {
                headers: { 'Content-Type': 'application/json' },
            }
        );
        return axiosResponse.data;
    } catch (error) {
        const errorMessage =
            error.response?.data?.message || error.message || 'Something went wrong';
        return Promise.reject(errorMessage);
    }
};

const reviewService = {
    createReview,
    getAllReviews,
    getActiveReviews,
    updateReview,
    deleteReview,
    toggleReviewActive,
};

export default reviewService;
