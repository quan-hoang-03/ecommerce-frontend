import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { findProduct } from '../../State/Products/Action';
import HomeSectionCard from '../HomeSectionCard/HomeSectionCard';

const TopDiscountProducts = () => {
  const dispatch = useDispatch();
  const { products } = useSelector((store) => store);
  const [topDiscountProducts, setTopDiscountProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopDiscountProducts = async () => {
      try {
        setLoading(true);
        // Fetch tất cả sản phẩm để tìm những sản phẩm có discount cao nhất
        await dispatch(findProduct({
          colors: "",
          size: "",
          minPrice: 0,
          maxPrice: 0,
          minDiscount: 0,
          category: "",
          stock: "",
          sort: "price_low",
          pageNumber: 0,
          pageSize: 100, // Lấy nhiều sản phẩm để có thể chọn top
        }));
      } catch (error) {
        console.error("Error fetching top discount products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopDiscountProducts();
  }, [dispatch]);

  useEffect(() => {
    // API trả về trong store.products.products hoặc store.products.products.content
    let productsList = [];
    
    if (products?.products) {
      if (Array.isArray(products.products)) {
        productsList = products.products;
      } else if (products.products?.content && Array.isArray(products.products.content)) {
        productsList = products.products.content;
      }
    } else if (Array.isArray(products)) {
      productsList = products;
    } else if (products?.content && Array.isArray(products.content)) {
      productsList = products.content;
    }
    
    if (productsList.length > 0) {
      // Lấy 4 sản phẩm có discount cao nhất
      const sorted = [...productsList]
        .filter(product => {
          // Chỉ lấy sản phẩm có discount
          const discountPercent = product.discountPersent || product.discountPercent || 0;
          const hasDiscount = product.discountPrice && product.price && product.discountPrice < product.price;
          return discountPercent > 0 || hasDiscount;
        })
        .map(product => {
          // Tính discount percent nếu chưa có
          const discountPercent = product.discountPersent || product.discountPercent || 0;
          const calculatedDiscount = discountPercent > 0 
            ? discountPercent 
            : (product.discountPrice && product.price && product.discountPrice < product.price)
              ? Math.round((1 - product.discountPrice / product.price) * 100)
              : 0;
          
          return {
            ...product,
            calculatedDiscountPercent: calculatedDiscount
          };
        })
        .sort((a, b) => b.calculatedDiscountPercent - a.calculatedDiscountPercent)
        .slice(0, 4); // Lấy top 4 sản phẩm có discount cao nhất
      
      setTopDiscountProducts(sorted);
    }
  }, [products]);

  // Map API product structure to match what HomeSectionCard expects
  const mapProductData = (product) => {
    if (product.discountPrice !== undefined) {
      return {
        ...product,
        discountedPrice: product.discountPrice,
      };
    }
    return product;
  };

  if (loading) {
    return (
      <div
        className="mb-10 rounded-lg p-6 shadow-lg"
        style={{
          background: "#8f071b",
        }}
      >
        <div className="flex items-center gap-3 mb-4">
          <h2
            className="text-xl font-bold text-white drop-shadow-md"
            style={{fontFamily: "auto"}}
          >
            FLASH SALE
          </h2>
        </div>
        <div className="flex justify-center items-center h-48">
          <div className="w-8 h-8 border-3 border-white border-t-pink-300 rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (topDiscountProducts.length === 0) {
    return null;
  }

  return (
    <div
      className="mb-10 rounded-lg p-6 shadow-lg"
      style={{
        background: "#8f071b",
      }}
    >
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h2
            className="text-xl font-bold text-white drop-shadow-md"
            style={{ fontFamily: "auto" }}
          >
            FLASH SALE
          </h2>
        </div>
      </div>

      {/* Products Grid - Only 4 items */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-3 overflow-hidden w-full">
        {topDiscountProducts.map((item, index) => (
          <div key={item.id || index} className="min-w-0 w-full">
            <HomeSectionCard product={mapProductData(item)} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopDiscountProducts;
