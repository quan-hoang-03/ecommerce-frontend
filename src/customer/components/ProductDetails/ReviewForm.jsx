import React, { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../../config/apiConfig";
import { useNotification } from "../../hooks/useNotification";
import NotificationContainer from "../Notification/NotificationContainer";

const ReviewForm = ({ productId, onReviewSubmitted }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const { showSuccess, showError, notifications, removeNotification } = useNotification();

  const ratingLabels = {
    1: "Rất tệ",
    2: "Tệ", 
    3: "Bình thường",
    4: "Tốt",
    5: "Xuất sắc"
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!rating || rating === 0) {
      showError("Vui lòng chọn đánh giá sao");
      return;
    }

    if (!review.trim()) {
      showError("Vui lòng nhập đánh giá");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("jwt");
      if (!token) {
        showError("Vui lòng đăng nhập để đánh giá");
        setLoading(false);
        return;
      }

      // Submit rating
      await axios.post(
        `${API_BASE_URL}/api/rating/add`,
        { productId, rating },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Submit review
      await axios.post(
        `${API_BASE_URL}/api/review/add`,
        { productId, review },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      showSuccess("Đánh giá của bạn đã được gửi thành công!");
      setRating(0);
      setReview("");
      setIsExpanded(false);
      
      if (onReviewSubmitted) {
        onReviewSubmitted();
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      showError(error.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border-2 border-dashed border-pink-200 rounded-xl p-6 bg-gradient-to-br from-pink-50/50 to-rose-50/50">
      {!isExpanded ? (
        <button
          onClick={() => setIsExpanded(true)}
          className="w-full flex items-center justify-center gap-3 py-4 text-pink-500 hover:text-pink-600 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          <span className="font-medium">Viết đánh giá của bạn</span>
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <svg className="w-5 h-5 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Viết đánh giá
            </h3>
            <button
              type="button"
              onClick={() => setIsExpanded(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Rating Stars */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Đánh giá của bạn <span className="text-pink-500">*</span>
            </label>
            <div className="flex items-center gap-4">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 transition-transform hover:scale-110"
                  >
                    <svg
                      className={`w-8 h-8 transition-colors ${
                        star <= (hoverRating || rating) 
                          ? "text-yellow-400" 
                          : "text-gray-200"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  </button>
                ))}
              </div>
              {(hoverRating || rating) > 0 && (
                <span className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                  {ratingLabels[hoverRating || rating]}
                </span>
              )}
            </div>
          </div>

          {/* Review Text */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nhận xét <span className="text-pink-500">*</span>
            </label>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-200 focus:border-pink-400 transition-all resize-none text-sm"
            />
            <p className="text-xs text-gray-400 mt-1">{review.length}/500 ký tự</p>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 px-6 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold rounded-xl shadow-lg shadow-pink-200 hover:shadow-xl hover:shadow-pink-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Đang gửi...
                </span>
              ) : (
                "Gửi đánh giá"
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                setRating(0);
                setReview("");
                setIsExpanded(false);
              }}
              className="py-3 px-6 border-2 border-gray-200 text-gray-600 font-medium rounded-xl hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
          </div>
        </form>
      )}

      <NotificationContainer 
        notifications={notifications} 
        onRemove={removeNotification} 
      />
    </div>
  );
};

export default ReviewForm;
