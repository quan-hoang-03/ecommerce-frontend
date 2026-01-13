import React from 'react'
import { useNavigate } from 'react-router-dom'

const HomeSectionCard = ({product}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (product.id) {
      navigate(`/product/${product.id}`);
    }
  };

  return (
    <div 
      onClick={handleClick}
      className="cursor-pointer flex flex-col items-center bg-white rounded-xl shadow-md hover:shadow-xl overflow-hidden w-[15rem] mx-3 border border-gray-100 transition-all duration-300 hover:-translate-y-2 group"
    >
      <div className="h-[13rem] w-full overflow-hidden bg-gray-50">
        <img
          className="object-cover object-top w-full h-full group-hover:scale-110 transition-transform duration-300"
          src={product.imageUrl}
          alt={product.brand}
        />
      </div>
      <div className="p-4 w-full">
        <h3 className="text-base font-semibold text-gray-900 text-center line-clamp-1">{product.brand}</h3>
        <p className="mt-1 text-sm text-gray-600 text-center line-clamp-2 min-h-[2.5rem]">{product.title}</p>
        <div className="mt-3 flex items-center justify-center gap-2">
          {product.discountedPrice && product.price && (
            <>
              <span className="text-lg font-bold text-gray-900">
                ${product.discountedPrice}
              </span>
              {product.discountedPrice < product.price && (
                <>
                  <span className="text-sm text-gray-400 line-through">
                    ${product.price}
                  </span>
                  {product.discountPersent && (
                    <span className="text-xs font-semibold text-red-500 bg-red-50 px-2 py-1 rounded">
                      -{product.discountPersent}%
                    </span>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default HomeSectionCard