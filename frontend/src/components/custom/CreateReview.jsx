import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AddReview } from '@/redux/slices/reviews/reviewSlice';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import StarRatingInput from './StarRatingInput';
import { Loader2, MessageSquareQuote, PlusCircle } from 'lucide-react';

const CreateReview = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();

  const [inputValue, setInputValue] = useState({
    customerName: '',
    rating: 5,
    comment: '',
    location: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputValue((values) => ({ ...values, [name]: value }));
  };

  const handleRatingChange = (rating) => {
    setInputValue((values) => ({ ...values, rating }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleCancel = () => {
    navigate('/admin/dashboard/all-reviews');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('customerName', inputValue.customerName);
    formData.append('rating', inputValue.rating);
    formData.append('comment', inputValue.comment);
    formData.append('location', inputValue.location || '');
    if (imageFile) {
      formData.append('picture', imageFile);
    }

    dispatch(AddReview(formData))
      .unwrap()
      .then((response) => {
        if (response?.success) {
          toast.success('Review added successfully!');
          navigate('/admin/dashboard/all-reviews');
        }
      })
      .catch((error) => {
        toast.error(error || 'Failed to add review. Please try again.');
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Card className="border border-gray-100 shadow-sm">
        <CardHeader className="border-b border-gray-50 pb-4">
          <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <MessageSquareQuote className="h-5 w-5 text-primary" />
            Add Customer Review
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="grid gap-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="grid gap-3">
                  <Label htmlFor="customerName" className="font-semibold text-gray-700">Customer Name</Label>
                  <Input
                    type="text"
                    id="customerName"
                    name="customerName"
                    required
                    value={inputValue.customerName}
                    onChange={handleChange}
                    placeholder="e.g. John Doe"
                    className="focus-visible:ring-primary"
                  />
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="location" className="font-semibold text-gray-700">
                    Location <span className="text-xs font-normal text-gray-400">(optional)</span>
                  </Label>
                  <Input
                    type="text"
                    id="location"
                    name="location"
                    value={inputValue.location}
                    onChange={handleChange}
                    placeholder="e.g. Walsall, West Midlands"
                    className="focus-visible:ring-primary"
                  />
                </div>
              </div>

              <div className="grid gap-3">
                <Label className="font-semibold text-gray-700">Rating</Label>
                <StarRatingInput value={inputValue.rating} onChange={handleRatingChange} />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="comment" className="font-semibold text-gray-700">Review Text</Label>
                <Textarea
                  id="comment"
                  name="comment"
                  required
                  rows={4}
                  value={inputValue.comment}
                  onChange={handleChange}
                  placeholder="What did the customer say about their order?"
                  className="focus-visible:ring-primary resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-3">
                  <Label htmlFor="picture" className="text-sm font-semibold text-gray-700">
                    Customer Photo <span className="text-xs font-normal text-gray-400">(optional)</span>
                  </Label>

                  {imagePreview ? (
                    <div className="relative h-36 w-36">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover rounded-full border shadow-sm"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute -top-1 -right-1 bg-destructive text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow-md hover:bg-destructive/90 transition"
                        title="Remove"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <label
                      htmlFor="picture"
                      className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:border-primary hover:bg-orange-50/30 transition duration-200 ease-in-out"
                    >
                      <PlusCircle className="w-5 h-5 text-primary mb-1" />
                      <span className="text-gray-500 text-sm font-medium">Upload photo</span>
                      <span className="text-xs text-gray-400">No photo? Initials are shown instead</span>
                      <Input
                        type="file"
                        id="picture"
                        name="picture"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              <div className="flex gap-4 pt-2">
                <Button type="submit" disabled={loading} className="bg-primary hover:bg-primary/95 text-white">
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding review...
                    </>
                  ) : (
                    'Add Review'
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateReview;
