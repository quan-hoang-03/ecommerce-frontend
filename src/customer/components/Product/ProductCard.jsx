import React from 'react'
import "./ProductCard.css"
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../../config/apiConfig';
import { formatPrice } from '../../../utils/formatPrice';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  
  // Handle both API (discountPrice) and static data (discountedPrice)
  const discountedPrice = product.discountPrice || product.discountedPrice;
  const discountPercent = product.discountPersent || product.discountPercent;
  
  // Check if imageUrl is external (starts with http) or internal
  const imageUrl = product.imageUrl?.startsWith('http') 
    ? product.imageUrl 
    : `${API_BASE_URL}${product.imageUrl}`;

  return (
    <div
      onClick={() => navigate(`/product/${product.id}`)}
      className="productCard w-[15rem] m-3 transition-all cursor-pointer rounded-lg overflow-hidden shadow-md hover:shadow-xl"
    >
      <div className="h-[20rem] bg-gray-100">
        <img
          className="h-full w-full object-cover object-center"
          src={imageUrl}
          alt={product.title}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x400?text=No+Image';
          }}
        />
      </div>
      <div className="textPart bg-white p-3">
        <div>
          <p className="font-bold text-gray-600 text-sm">{product.brand}</p>
          <p className="text-gray-800 line-clamp-2 min-h-[2.5rem]">{product.title}</p>
        </div>
        <div className="flex items-center flex-wrap gap-2 mt-2">
          <p className="font-semibold text-gray-900">
            {formatPrice(discountedPrice)}
          </p>
          {product.price && discountedPrice < product.price && (
            <>
              <p className="line-through text-gray-400 text-sm">
                {formatPrice(product.price)}
              </p>
              {discountPercent > 0 && (
                <p className="text-red-500 font-semibold text-sm">
                  -{discountPercent}%
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductCard
