import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { findProductsByCategoryName } from '../../State/Products/Action';
import ProductCard from '../../components/Product/ProductCard';
import { Box, Typography, CircularProgress, Pagination, Grid } from '@mui/material';

const CategoryProductsPage = () => {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  
  const searchParams = new URLSearchParams(location.search);
  const pageNumber = Number(searchParams.get('page')) || 1;
  const itemsPerPage = 12;
  
  const { productsByCategory = {}, categoryLoading = {} } = useSelector((state) => state.products) || {};
  const products = productsByCategory[categoryName] || [];
  const isLoading = categoryLoading[categoryName] || false;
  
  // Scroll to top when component mounts or categoryName changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [categoryName]);
  
  // Fetch products when categoryName changes
  useEffect(() => {
    if (categoryName) {
      dispatch(findProductsByCategoryName(categoryName));
    }
  }, [categoryName, dispatch]);
  
  // Pagination
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const startIndex = (pageNumber - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = products.slice(startIndex, endIndex);
  
  const handlePageChange = (event, value) => {
    const newSearchParams = new URLSearchParams(location.search);
    newSearchParams.set('page', value);
    navigate({ search: newSearchParams.toString() });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Get category display name (you might need to fetch this from API)
  const getCategoryDisplayName = () => {
    // Try to get display name from first product's category
    if (products.length > 0 && products[0].category) {
      return products[0].category.displayName || products[0].category.name;
    }
    // Fallback to categoryName with formatting
    return categoryName ? categoryName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Danh mục';
  };
  
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <div 
              className="w-1 h-8 rounded-full"
              style={{ background: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)' }}
            />
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#1f2937' }}>
              {getCategoryDisplayName()}
            </Typography>
          </div>
          <Typography variant="body2" color="text.secondary">
            {products.length} sản phẩm
          </Typography>
        </div>
        
        {/* Loading State */}
        {isLoading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
            <CircularProgress />
          </Box>
        ) : paginatedProducts.length === 0 ? (
          <Box textAlign="center" py={8}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Không có sản phẩm nào trong danh mục này
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Vui lòng thử lại sau hoặc xem các danh mục khác
            </Typography>
          </Box>
        ) : (
          <>
            {/* Products Grid */}
            <Grid container spacing={3}>
              {paginatedProducts.map((product) => {
                // Map API product structure to match ProductCard expectations
                const mappedProduct = {
                  ...product,
                  discountedPrice: product.discountPrice || product.discountedPrice,
                  discountPercent: product.discountPersent || product.discountPercent,
                };
                return (
                  <Grid item xs={6} sm={4} md={3} key={product.id}>
                    <ProductCard product={mappedProduct} />
                  </Grid>
                );
              })}
            </Grid>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <Box display="flex" justifyContent="center" mt={4}>
                <Pagination
                  count={totalPages}
                  page={pageNumber}
                  onChange={handlePageChange}
                  color="primary"
                  shape="rounded"
                  size="large"
                  showFirstButton
                  showLastButton
                />
              </Box>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CategoryProductsPage;
