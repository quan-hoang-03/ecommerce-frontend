import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../../config/apiConfig';

const CategoryGrid = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/api/categories/navigation");
        // Chỉ lấy các danh mục con (level 2 và 3), không lấy danh mục cha (level 1)
        const displayCategories = (data || [])
          .filter(cat => cat.level === 2 || cat.level === 3)
          .slice(0, 9); // Giới hạn 9 categories như trong ảnh
        setCategories(displayCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Fetch ảnh đại diện từ sản phẩm đầu tiên của category
  useEffect(() => {
    const fetchCategoryImages = async () => {
      const categoriesWithImages = await Promise.all(
        categories.map(async (category) => {
          try {
            // Lấy sản phẩm đầu tiên của category để làm ảnh đại diện
            const { data: products } = await api.get(`/api/category/${encodeURIComponent(category.name)}`);
            if (products && products.length > 0 && products[0].imageUrl) {
              return {
                ...category,
                imageUrl: products[0].imageUrl.startsWith('http') 
                  ? products[0].imageUrl 
                  : `http://localhost:8080${products[0].imageUrl}`
              };
            }
            return category;
          } catch (error) {
            console.error(`Error fetching image for category ${category.name}:`, error);
            return category;
          }
        })
      );
      setCategories(categoriesWithImages);
    };

    if (categories.length > 0) {
      fetchCategoryImages();
    }
  }, [categories.length]);

  const handleCategoryClick = (categoryName) => {
    navigate(`/category/${categoryName}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
          <h2 className="text-lg font-bold text-gray-800">Danh mục</h2>
        </div>
        <div className="flex justify-center items-center h-48">
          <div className="w-8 h-8 border-3 border-gray-200 border-t-pink-500 rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (categories.length === 0) {
    return null;
  }

  return (
    <div className="mb-10">
      {/* Section Header */}
      <div className="flex items-center gap-2 mb-4 px-1">
        <div
          className="w-1 h-6 rounded-full"
          style={{
            background: "linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)",
          }}
        />
        <h2 className="text-lg font-bold text-gray-800">Danh mục</h2>
      </div>
      
      {/* Categories Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-9 gap-3 overflow-hidden w-full">
        {categories.map((category) => (
          <div
            key={category.id}
            onClick={() => handleCategoryClick(category.name)}
            className="cursor-pointer bg-white rounded-lg border-2 border-red-500 overflow-hidden transition-all duration-300 hover:shadow-lg"
          >
            {/* Category Image */}
            <div className="aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
              {category.imageUrl ? (
                <img
                  src={category.imageUrl}
                  alt={category.displayName || category.name}
                  className="w-full h-full object-contain p-2"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/150x150?text=No+Image';
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </div>
              )}
            </div>
            
            {/* Category Name */}
            <div className="p-2 text-center">
              <p className="text-xs font-semibold text-gray-800 line-clamp-2 min-h-[2rem]">
                {category.displayName || category.name}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryGrid;
