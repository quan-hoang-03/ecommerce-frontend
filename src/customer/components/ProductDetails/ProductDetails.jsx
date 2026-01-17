import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { findProductById } from "../../State/Products/Action";
import { addItemToCart } from "../../State/Cart/Action";
import { API_BASE_URL } from "../../../config/apiConfig";
import { useNotification } from "../../hooks/useNotification";
import NotificationContainer from "../Notification/NotificationContainer";
import HomeSectionCard from "../HomeSectionCard/HomeSectionCard";
import ProductReviewCard from "./ProductReviewCard";
import ReviewForm from "./ReviewForm";
import axios from "axios";

// Format price
const formatPrice = (price) => {
  if (!price && price !== 0) return "0";
  return new Intl.NumberFormat("vi-VN").format(price);
};

// Star Rating Component
const StarRating = ({ value, size = "medium", showValue = false }) => {
  const sizeMap = { small: 14, medium: 18, large: 22 };
  const starSize = sizeMap[size] || 18;

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          width={starSize}
          height={starSize}
          viewBox="0 0 24 24"
          fill={star <= value ? "#fbbf24" : "#e5e7eb"}
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
      {showValue && (
        <span className="ml-1 text-sm text-gray-500">({value.toFixed(1)})</span>
      )}
    </div>
  );
};

export default function ProductDetails() {
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loadingSimilar, setLoadingSimilar] = useState(false);

  const { notifications, showWarning, showSuccess, removeNotification } = useNotification();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();

  const { products } = useSelector((store) => store);
  const product = products?.product;

  // Fetch product data
  useEffect(() => {
    dispatch(findProductById({ productId: params.productId }));
    fetchReviewsAndRatings();
  }, [params.productId, dispatch]);

  // Fetch similar products
  useEffect(() => {
    if (product?.category?.name) {
      fetchSimilarProducts(product.category.name);
    }
  }, [product?.category?.name, params.productId]);

  const fetchReviewsAndRatings = async () => {
    setLoadingReviews(true);
    try {
      const token = localStorage.getItem("jwt");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const [reviewsRes, ratingsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/review/product/${params.productId}`, { headers }),
        axios.get(`${API_BASE_URL}/api/rating/product/${params.productId}`, { headers }),
      ]);

      setReviews(reviewsRes.data || []);
      setRatings(ratingsRes.data || []);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoadingReviews(false);
    }
  };

  const fetchSimilarProducts = async (categoryName) => {
    setLoadingSimilar(true);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/category/${encodeURIComponent(categoryName)}`
      );
      const currentProductId = parseInt(params.productId);
      const filtered = (response.data || [])
        .filter((p) => p.id && p.id !== currentProductId)
        .slice(0, 5);
      setSimilarProducts(filtered);
    } catch (error) {
      console.error("Error fetching similar products:", error);
    } finally {
      setLoadingSimilar(false);
    }
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      showWarning("Vui lòng chọn size trước khi thêm vào giỏ hàng");
      return;
    }
    dispatch(addItemToCart({ productId: params.productId, size: selectedSize }));
    showSuccess("Đã thêm sản phẩm vào giỏ hàng");
    navigate("/cart");
  };

  // Calculate ratings
  const averageRating = ratings.length > 0
    ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
    : 0;

  const reviewsWithRatings = reviews.map((review) => {
    const userRating = ratings.find((r) => r.user?.id === review.user?.id);
    return { ...review, rating: userRating?.rating || 0 };
  });

  // Get image URL
  const getImageUrl = (url) => {
    if (!url) return "https://via.placeholder.com/600x600?text=No+Image";
    return url.startsWith("http") ? url : `${API_BASE_URL}${url}`;
  };

  // Mock multiple images (in real app, this would come from API)
  const productImages = product?.imageUrl ? [product.imageUrl] : [];

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-pink-500 rounded-full animate-spin" />
      </div>
    );
  }

  const discountPercent = product.discountPersent || 
    (product.price && product.discountPrice 
      ? Math.round((1 - product.discountPrice / product.price) * 100) 
      : 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm mb-6">
          <a href="/" className="text-gray-500 hover:text-pink-500 transition-colors">Trang chủ</a>
          <span className="text-gray-300">/</span>
          <a href="#" className="text-gray-500 hover:text-pink-500 transition-colors">
            {product.category?.name || "Sản phẩm"}
          </a>
          <span className="text-gray-300">/</span>
          <span className="text-gray-700 font-medium truncate max-w-[200px]">{product.title}</span>
        </nav>

        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Left - Image Gallery */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            {/* Main Image */}
            <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 mb-4">
              <img
                src={getImageUrl(productImages[selectedImage] || product.imageUrl)}
                alt={product.title}
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/600x600?text=No+Image";
                }}
              />
              
              {/* Image Navigation Arrows */}
              {productImages.length > 1 && (
                <>
                  <button 
                    onClick={() => setSelectedImage(prev => Math.max(0, prev - 1))}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-colors"
                  >
                    <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => setSelectedImage(prev => Math.min(productImages.length - 1, prev + 1))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-colors"
                  >
                    <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Strip */}
            {productImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {productImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === idx 
                        ? "border-pink-500 shadow-lg" 
                        : "border-gray-200 hover:border-pink-300"
                    }`}
                  >
                    <img
                      src={getImageUrl(img)}
                      alt={`${product.title} ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Product Highlights */}
            <div className="mt-6 pt-6 border-t border-gray-100">
              <h3 className="font-semibold text-gray-800 mb-3">Đặc điểm nổi bật</h3>
              <p className="text-sm text-gray-500">
                {product.description ? product.description.substring(0, 100) + "..." : "Đang cập nhật thông tin!"}
              </p>
            </div>
          </div>

          {/* Right - Product Info */}
          <div className="space-y-6">
            {/* Rating & Wishlist */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <StarRating value={Math.round(averageRating)} size="medium" />
                <span className="text-sm text-gray-500">
                  ({ratings.length} đánh giá)
                </span>
              </div>
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
              >
                <svg
                  className={`w-6 h-6 transition-colors ${
                    isWishlisted ? "text-pink-500 fill-pink-500" : "text-gray-300"
                  }`}
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  fill={isWishlisted ? "currentColor" : "none"}
                >
                  <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>

            {/* Product Title */}
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
                {product.title}
              </h1>
              {product.brand && (
                <p className="text-sm text-gray-500 mt-1">Thương hiệu: <span className="font-medium text-gray-700">{product.brand}</span></p>
              )}
            </div>

            {/* Price Section */}
            <div className="flex items-baseline gap-4 py-4 border-y border-gray-100">
              <span className="text-3xl font-bold text-red-500">
                {formatPrice(product.discountPrice || product.price)}₫
              </span>
              {product.discountPrice && product.price > product.discountPrice && (
                <>
                  <span className="text-lg text-gray-400 line-through">
                    {formatPrice(product.price)}₫
                  </span>
                  <span className="px-2 py-1 bg-red-100 text-red-600 text-sm font-semibold rounded">
                    -{discountPercent}%
                  </span>
                </>
              )}
            </div>

            {/* Size Selector */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                  Chọn loại: <span className="text-pink-500">{selectedSize || "Chưa chọn"}</span>
                </h3>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map((size) => {
                    const sizeName = size.name || size;
                    const isInStock = size.quantity === undefined || size.quantity > 0;
                    const isSelected = selectedSize === sizeName;

                    return (
                      <button
                        key={sizeName}
                        onClick={() => isInStock && setSelectedSize(sizeName)}
                        disabled={!isInStock}
                        className={`
                          px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all
                          ${isSelected
                            ? "border-pink-500 bg-pink-500 text-white shadow-lg shadow-pink-200"
                            : isInStock
                              ? "border-gray-200 bg-white text-gray-700 hover:border-pink-300 hover:bg-pink-50"
                              : "border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed"
                          }
                        `}
                      >
                        <div className="flex items-center gap-2">
                          {size.color && (
                            <span 
                              className="w-4 h-4 rounded-full border border-gray-200"
                              style={{ backgroundColor: size.color }}
                            />
                          )}
                          <span>{sizeName}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Product Description */}
            <div className="bg-white rounded-xl p-5 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                MÔ TẢ SẢN PHẨM
              </h3>
              <div className={`text-sm text-gray-600 leading-relaxed ${!showFullDescription && "line-clamp-4"}`}>
                {product.description || "Đang cập nhật thông tin sản phẩm..."}
              </div>
              {product.description && product.description.length > 200 && (
                <button
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="mt-3 text-sm font-medium text-pink-500 hover:text-pink-600 flex items-center gap-1"
                >
                  {showFullDescription ? "Thu gọn" : "Xem thêm"}
                  <svg 
                    className={`w-4 h-4 transition-transform ${showFullDescription ? "rotate-180" : ""}`} 
                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                onClick={handleAddToCart}
                className="flex-1 py-4 px-6 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold rounded-xl shadow-lg shadow-pink-200 hover:shadow-xl hover:shadow-pink-300 transition-all hover:-translate-y-0.5 active:translate-y-0"
              >
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Thêm vào giỏ hàng
                </span>
              </button>
              <button
                onClick={() => {
                  if (!selectedSize && product.sizes?.length > 0) {
                    showWarning("Vui lòng chọn size");
                    return;
                  }
                  handleAddToCart();
                }}
                className="py-4 px-6 border-2 border-pink-500 text-pink-500 font-semibold rounded-xl hover:bg-pink-50 transition-all"
              >
                Mua ngay
              </button>
            </div>

            {/* Extra Info */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
                <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-green-700">Hàng chính hãng 100%</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
                <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-blue-700">Giao hàng nhanh 2h</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl">
                <svg className="w-5 h-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span className="text-purple-700">Bảo hành 30 ngày</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-xl">
                <svg className="w-5 h-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-orange-700">Đổi trả miễn phí</span>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white rounded-2xl shadow-sm p-6 lg:p-8 mb-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl lg:text-2xl font-bold text-gray-900 flex items-center gap-3">
              <svg className="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              Đánh giá & Nhận xét
            </h2>
            <div className="flex items-center gap-2 bg-yellow-50 px-4 py-2 rounded-full">
              <span className="text-2xl font-bold text-yellow-600">{averageRating.toFixed(1)}</span>
              <span className="text-sm text-yellow-700">/ 5</span>
            </div>
          </div>

          {/* Rating Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Rating Bars */}
            <div className="lg:col-span-2 space-y-3">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = ratings.filter(r => Math.round(r.rating) === star).length;
                const percentage = ratings.length > 0 ? (count / ratings.length) * 100 : 0;
                return (
                  <div key={star} className="flex items-center gap-3">
                    <span className="w-12 text-sm text-gray-600 flex items-center gap-1">
                      {star} <svg className="w-3 h-3 text-yellow-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                    </span>
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="w-10 text-sm text-gray-500 text-right">{count}</span>
                  </div>
                );
              })}
            </div>

            {/* Stats */}
            <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl p-6 text-center">
              <div className="text-4xl font-bold text-pink-600 mb-2">{averageRating.toFixed(1)}</div>
              <StarRating value={Math.round(averageRating)} size="medium" />
              <p className="text-sm text-gray-500 mt-2">{ratings.length} đánh giá</p>
              <div className="mt-4 pt-4 border-t border-pink-100">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold text-green-600">
                    {ratings.filter(r => r.rating >= 4).length > 0 
                      ? Math.round((ratings.filter(r => r.rating >= 4).length / ratings.length) * 100)
                      : 0}%
                  </span> khách hàng khuyên dùng
                </p>
              </div>
            </div>
          </div>

          {/* Review Form */}
          <ReviewForm
            productId={params.productId}
            onReviewSubmitted={fetchReviewsAndRatings}
          />

          {/* Reviews List */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {reviewsWithRatings.length} Nhận xét
            </h3>
            {loadingReviews ? (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-4 border-gray-200 border-t-pink-500 rounded-full animate-spin mx-auto" />
              </div>
            ) : reviewsWithRatings.length > 0 ? (
              <div className="space-y-4">
                {reviewsWithRatings.map((review) => (
                  <ProductReviewCard key={review.id} review={review} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p>Chưa có nhận xét nào. Hãy là người đầu tiên!</p>
              </div>
            )}
          </div>
        </div>

        {/* Similar Products */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl lg:text-2xl font-bold text-gray-900 flex items-center gap-3">
              <svg className="w-6 h-6 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              Sản phẩm tương tự
            </h2>
            <a href="#" className="text-sm font-medium text-pink-500 hover:text-pink-600 flex items-center gap-1">
              Xem tất cả
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>

          {loadingSimilar ? (
            <div className="flex justify-center py-12">
              <div className="w-10 h-10 border-4 border-gray-200 border-t-pink-500 rounded-full animate-spin" />
            </div>
          ) : similarProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {similarProducts.map((item) => (
                <HomeSectionCard key={item.id} product={item} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              Không có sản phẩm tương tự
            </div>
          )}
        </div>
      </div>

      <NotificationContainer
        notifications={notifications}
        onRemove={removeNotification}
      />
    </div>
  );
}
