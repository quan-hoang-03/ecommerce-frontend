import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { findProduct } from '../../State/Products/Action';
import HomeSectionCard from '../HomeSectionCard/HomeSectionCard';

const TopPriceProducts = () => {
  const dispatch = useDispatch();
  const { products } = useSelector((store) => store);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopPriceProducts = async () => {
      try {
        setLoading(true);
        // Fetch tất cả sản phẩm với sort price_high và pageSize lớn
        await dispatch(findProduct({
          colors: "",
          size: "",
          minPrice: 0,
          maxPrice: 0,
          minDiscount: 0,
          category: "",
          stock: "",
          sort: "price_high", // Sắp xếp theo giá cao nhất
          pageNumber: 0,
          pageSize: 100, // Lấy nhiều sản phẩm để có thể chọn top
        }));
      } catch (error) {
        console.error("Error fetching top price products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopPriceProducts();
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
      // Lấy top 10 sản phẩm đắt nhất
      const sorted = [...productsList]
        .sort((a, b) => {
          const priceA = a.discountPrice || a.price || 0;
          const priceB = b.discountPrice || b.price || 0;
          return priceB - priceA;
        })
        .slice(0, 10); // Lấy top 10 sản phẩm đắt nhất
      
      setTopProducts(sorted);
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
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-4 px-1">
          <div
            className="w-1 h-6 rounded-full"
            style={{
              background: "linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)",
            }}
          />
          <h2 className="text-lg font-bold text-gray-800">Sản phẩm bán chạy</h2>
        </div>
        <div className="flex justify-center items-center h-48">
          <div className="w-8 h-8 border-3 border-gray-200 border-t-pink-500 rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (topProducts.length === 0) {
    return null;
  }

  return (
    <div className="mb-10">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2">
          <div
            className="w-1 h-6 rounded-full"
            style={{
              background: "linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)",
            }}
          />
          <h2 className="text-lg font-bold text-gray-800">Sản phẩm bán chạy</h2>
        </div>
      </div>
      
      {/* Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 overflow-hidden w-full">
        {topProducts.map((item, index) => (
          <div key={item.id || index} className="min-w-0 w-full">
            <HomeSectionCard product={mapProductData(item)} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopPriceProducts;
