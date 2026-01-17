import React from 'react';

const ProductReviewCard = ({ review }) => {
  const userName = review?.user?.firstName 
    ? `${review.user.firstName} ${review.user.lastName || ""}`.trim()
    : review?.user?.email?.split("@")[0] || "Người dùng ẩn danh";
  
  const reviewText = review?.review || "";
  const reviewDate = review?.createdAt 
    ? new Date(review.createdAt).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit", 
        year: "numeric"
      })
    : "";
  
  const ratingValue = review?.rating || 0;
  const avatarLetter = userName.charAt(0).toUpperCase();
  
  // Random pastel color for avatar based on name
  const colors = [
    "bg-pink-400", "bg-purple-400", "bg-indigo-400", 
    "bg-blue-400", "bg-teal-400", "bg-green-400", 
    "bg-orange-400", "bg-rose-400"
  ];
  const colorIndex = userName.charCodeAt(0) % colors.length;
  const avatarColor = colors[colorIndex];

  return (
    <div className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors">
      <div className="flex gap-4">
        {/* Avatar */}
        <div className={`w-12 h-12 rounded-full ${avatarColor} flex items-center justify-center flex-shrink-0`}>
          <span className="text-white font-semibold text-lg">{avatarLetter}</span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-3">
              <span className="font-semibold text-gray-800">{userName}</span>
              <span className="text-xs text-gray-400">{reviewDate}</span>
            </div>
            
            {/* Rating */}
            <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
              <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <span className="text-sm font-medium text-yellow-700">{ratingValue.toFixed(1)}</span>
            </div>
          </div>

          {/* Stars */}
          <div className="flex gap-0.5 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                className={`w-4 h-4 ${star <= ratingValue ? "text-yellow-400" : "text-gray-200"}`}
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            ))}
          </div>

          {/* Review Text */}
          {reviewText && (
            <p className="text-gray-600 text-sm leading-relaxed">{reviewText}</p>
          )}

          {/* Helpful buttons */}
          <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-200">
            <button className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-green-600 transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
              </svg>
              Hữu ích
            </button>
            <button className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-blue-600 transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
              </svg>
              Trả lời
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductReviewCard;
