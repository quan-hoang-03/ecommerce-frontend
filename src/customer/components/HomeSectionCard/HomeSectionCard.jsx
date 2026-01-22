import React from 'react'
import { useNavigate } from 'react-router-dom'
import { API_BASE_URL } from '../../../config/apiConfig';
import { formatPriceNumber } from '../../../utils/formatPrice';

const HomeSectionCard = ({product}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (product?.id) {
      navigate(`/product/${product.id}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Handle both API (discountPrice) and mapped data (discountedPrice)
  const discountedPrice = product.discountedPrice || product.discountPrice;
  const originalPrice = product.price;
  const discountPercent = product.discountPersent || product.discountPercent;
  const soldQuantity = product.soldQuantity || product.quantity || 0;
  const rating = product.rating || product.averageRating || 0;
  const numReviews = product.numReviews || product.reviewCount || 0;
  
  // Determine which price to display
  const displayPrice = discountedPrice || originalPrice;
  const hasDiscount = discountedPrice && originalPrice && discountedPrice < originalPrice;
  
  // Calculate discount percent if not provided
  const calculatedDiscountPercent = hasDiscount 
    ? Math.round((1 - discountedPrice / originalPrice) * 100) 
    : discountPercent;

  // Determine badge type (New or Best Seller)
  const isNew = product.isNew || product.newProduct || false;
  const isBestSeller = soldQuantity > 50 || product.isBestSeller || false;
  
  // Check if imageUrl is external (starts with http) or internal
  const imageUrl = product.imageUrl?.startsWith('http') 
    ? product.imageUrl 
    : product.imageUrl 
      ? `${API_BASE_URL}${product.imageUrl}`
      : 'https://via.placeholder.com/300x300?text=No+Image';

  // Mock promotional offers (in real app, this would come from API)
  const hasPromo = displayPrice >= 399000;
  const hasFreeShipping = displayPrice >= 799000;

  return (
    <div
      onClick={handleClick}
      className="cursor-pointer flex flex-col bg-white rounded-md overflow-hidden w-full transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 group border border-gray-200"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      {/* Product Image Section */}
      <div className="relative aspect-square overflow-hidden bg-white">
        <img
          className="w-full h-full object-contain p-1.5 group-hover:scale-105 transition-transform duration-300"
          src={imageUrl}
          alt={product.title || product.brand}
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/200x200?text=No+Image";
          }}
        />

        {/* Badge - New or Best Seller */}
        {(isNew || isBestSeller) && (
          <div className="absolute top-1 left-1 z-10">
            <span className="px-1.5 py-0.5 bg-yellow-400 text-yellow-900 text-[9px] font-bold rounded">
              {isNew ? "New" : "Best Seller"}
            </span>
          </div>
        )}

        {/* Discount Badge - Only show if not New/Best Seller */}
        {calculatedDiscountPercent > 0 && !isNew && !isBestSeller && (
          <div className="absolute top-1 left-1 z-10">
            <span className="px-1.5 py-0.5 bg-yellow-400 text-yellow-900 text-[9px] font-bold rounded">
              -{calculatedDiscountPercent}%
            </span>
          </div>
        )}
      </div>

      {/* Promotional Banner */}
      <div className="px-1.5 py-0.5 bg-pink-100 border-b border-pink-200">
        <p className="text-[9px] font-medium text-pink-700 text-center">
          DUY NHẤT THÁNG 1
        </p>
      </div>

      {/* Product Info */}
      <div className="p-2 flex flex-col gap-1.5 flex-1">
        {/* Product Title */}
        <h3 className="text-xs font-semibold text-gray-900 line-clamp-2 leading-tight min-h-[2rem]">
          {product.title || "Sản phẩm"}
        </h3>

        {/* Promotional Offers Section */}
        {/* {(hasPromo || hasFreeShipping) && (
          <div className="space-y-1">
            {hasPromo && (
              <div className="px-1.5 py-1 bg-pink-50 border border-pink-200 rounded text-[9px] leading-tight">
                <p className="text-pink-700 font-medium">
                  VỚI HOÁ ĐƠN 399K VOUCHER 15K
                </p>
              </div>
            )}
            {hasFreeShipping && (
              <div className="px-1.5 py-1 bg-pink-50 border border-pink-200 rounded text-[9px] leading-tight">
                <p className="text-pink-700 font-medium">
                  VỚI HOÁ ĐƠN 799K MIỄN PHÍ VẬN CHUYỂN
                </p>
              </div>
            )}
          </div>
        )} */}

        {/* Price and Rating Section */}
        <div className="mt-auto pt-2 border-t border-gray-200">
          {/* Price */}
          <div className="flex items-baseline gap-1.5 mb-1.5">
            {displayPrice ? (
              <>
                <span className="text-base font-bold text-red-500">
                  {formatPriceNumber(displayPrice)} VNĐ
                </span>
                {hasDiscount && originalPrice && (
                  <span className="text-[10px] text-gray-400 line-through">
                    {formatPriceNumber(originalPrice)} VNĐ
                  </span>
                )}
              </>
            ) : (
              <span className="text-sm text-gray-500">Liên hệ</span>
            )}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1.5">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className={`w-3 h-3 ${
                    star <= Math.round(rating)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-200 fill-gray-200"
                  }`}
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              ))}
            </div>
            <span className="text-[10px] text-gray-500">
              ({numReviews} đánh giá)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomeSectionCard
