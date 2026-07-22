import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getSingleProduct } from '@/redux/slices/products/productSlice';
import LazyImage from '@/components/ui/LazyImage';
import OneLoader from '@/components/ui/OneLoader';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { singleProducts, status } = useSelector((state) => state.products);

  useEffect(() => {
    if (id) {
      dispatch(getSingleProduct(id));
    }
  }, [id, dispatch]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <OneLoader size="large" text="Loading product..." />
      </div>
    );
  }

  if (!singleProducts) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/#menu')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Button>
        </div>
      </div>
    );
  }

  const productImage = singleProducts.picture?.secure_url || singleProducts.image || '/placeholder.png';
  const isOutOfStock = !singleProducts.isAvailable;
  const hasDiscount = singleProducts.discountPercent > 0;
  const discountedPrice = hasDiscount
    ? Math.round(singleProducts.price * (1 - singleProducts.discountPercent / 100))
    : singleProducts.price;

  return (
    <div className="min-h-screen bg-slate-50 py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 lg:p-12">
            {/* Product Image */}
            <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
              <LazyImage
                src={productImage}
                alt={singleProducts.title}
                className="w-full h-full object-cover"
                fallback="/placeholder.png"
                quality={90}
              />
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                {singleProducts.title}
              </h1>

              {singleProducts.description && (
                <p className="text-gray-600 leading-relaxed mb-4">
                  {singleProducts.description}
                </p>
              )}

              <div className="flex items-center gap-3 flex-wrap mb-6">
                {hasDiscount ? (
                  <>
                    <span className="text-2xl font-bold text-primary">Rs. {discountedPrice}</span>
                    <span className="text-base text-gray-400 line-through">Rs. {singleProducts.price}</span>
                    <span className="text-xs font-bold text-white bg-primary rounded px-2 py-1">
                      {singleProducts.discountPercent}% OFF
                    </span>
                  </>
                ) : (
                  <span className="text-2xl font-bold text-gray-900">Rs. {singleProducts.price}</span>
                )}
              </div>

              <div className="border-t pt-6">
                <span
                  className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${
                    isOutOfStock
                      ? 'bg-gray-200 text-gray-500'
                      : 'bg-emerald-100 text-emerald-700'
                  }`}
                >
                  {isOutOfStock ? 'Currently Sold Out' : 'Available'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
