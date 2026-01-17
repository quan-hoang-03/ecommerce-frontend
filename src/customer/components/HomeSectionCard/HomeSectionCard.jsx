import React from 'react'
import { useNavigate } from 'react-router-dom'
import { API_BASE_URL } from '../../../config/apiConfig';

// Format price to Vietnamese currency
const formatPrice = (price) => {
  if (!price && price !== 0) return '';
  return new Intl.NumberFormat('vi-VN').format(price);
};

const HomeSectionCard = ({product}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (product?.id) {
      navigate(`/product/${product.id}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      console.error("Product ID không tồn tại:", product);
    }
  };

  // Handle both API (discountPrice) and mapped data (discountedPrice)
  const discountedPrice = product.discountedPrice || product.discountPrice;
  const originalPrice = product.price;
  const discountPercent = product.discountPersent || product.discountPercent;
  const soldQuantity = product.soldQuantity || product.quantity || 0;
  
  // Determine which price to display
  const displayPrice = discountedPrice || originalPrice;
  const hasDiscount = discountedPrice && originalPrice && discountedPrice < originalPrice;
  
  // Calculate discount percent if not provided
  const calculatedDiscountPercent = hasDiscount 
    ? Math.round((1 - discountedPrice / originalPrice) * 100) 
    : discountPercent;
  
  // Check if imageUrl is external (starts with http) or internal
  const imageUrl = product.imageUrl?.startsWith('http') 
    ? product.imageUrl 
    : product.imageUrl 
      ? `${API_BASE_URL}${product.imageUrl}`
      : 'https://via.placeholder.com/300x300?text=No+Image';

  // Get category for display
  const category = product.category?.name || product.topLevelCategory || '';

  return (
    <div 
      onClick={handleClick}
      className="cursor-pointer flex flex-col bg-white rounded-2xl overflow-hidden w-full transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 group relative"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
      style={{
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        border: '1px solid rgba(0,0,0,0.04)'
      }}
    >
      {/* Discount Badge */}
      {calculatedDiscountPercent > 0 && (
        <div className="absolute top-3 left-3 z-10">
          <div 
            className="px-2.5 py-1 rounded-full text-xs font-bold text-white"
            style={{
              background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
              boxShadow: '0 2px 8px rgba(238, 90, 36, 0.4)'
            }}
          >
            -{calculatedDiscountPercent}%
          </div>
        </div>
      )}

      {/* Wishlist Button */}
      <button 
        className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110"
        style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
        onClick={(e) => {
          e.stopPropagation();
          // Add to wishlist logic
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600 hover:text-red-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </button>

      {/* Product Image */}
      <div className="relative w-full pt-[100%] overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
        <img
          className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          src={imageUrl}
          alt={product.title || product.brand}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
          }}
        />
        
        {/* Quick View Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center">
          <span className="px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-800 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-lg">
            Xem nhanh
          </span>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4 flex flex-col gap-2">
        {/* Category Tag */}
        {category && (
          <div className="flex items-center gap-1.5">
            <span 
              className="text-[11px] font-medium px-2 py-0.5 rounded-full truncate max-w-full"
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white'
              }}
            >
              {category}
            </span>
          </div>
        )}

        {/* Brand */}
        {product.brand && (
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            {product.brand}
          </p>
        )}

        {/* Product Title */}
        <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 leading-snug min-h-[2.5rem] hover:text-indigo-600 transition-colors">
          {product.title || 'Sản phẩm'}
        </h3>

        {/* Sold Count Badge */}
        {soldQuantity > 0 && (
          <div className="flex items-center gap-1">
            <span className="text-orange-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
              </svg>
            </span>
            <span className="text-xs text-gray-500">
              Đã bán <span className="font-semibold text-gray-700">{soldQuantity}</span>
            </span>
          </div>
        )}

        {/* Price Section */}
        <div className="mt-1 flex flex-col gap-0.5">
          {displayPrice ? (
            <>
              <div className="flex items-baseline gap-2">
                <span 
                  className="text-lg font-bold"
                  style={{
                    background: 'linear-gradient(135deg, #f12711 0%, #f5af19 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                >
                  {formatPrice(displayPrice)}
                  <span className="text-sm ml-0.5" style={{
                    background: 'linear-gradient(135deg, #f12711 0%, #f5af19 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}>₫</span>
                </span>
              </div>
              {hasDiscount && originalPrice && (
                <span className="text-xs text-gray-400 line-through">
                  {formatPrice(originalPrice)}₫
                </span>
              )}
            </>
          ) : (
            <span className="text-sm font-medium text-gray-500 italic">Liên hệ</span>
          )}
        </div>

        {/* Rating Stars (if available) */}
        {product.rating && product.rating > 0 && (
          <div className="flex items-center gap-1 mt-1">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className={`w-3 h-3 ${star <= product.rating ? 'text-yellow-400' : 'text-gray-200'}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-xs text-gray-400">({product.numRatings || 0})</span>
          </div>
        )}
      </div>

      {/* Add to Cart Button - Shows on Hover */}
      <div className="px-4 pb-4 pt-0 opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-y-2 group-hover:translate-y-0">
        <button 
          className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-300 hover:shadow-lg active:scale-95"
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
          }}
          onClick={(e) => {
            e.stopPropagation();
            // Add to cart logic here
          }}
        >
          <span className="flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Thêm vào giỏ
          </span>
        </button>
      </div>
    </div>
  );
}

export default HomeSectionCard
