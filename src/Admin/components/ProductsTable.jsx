import { 
  Avatar, 
  Button, 
  Card, 
  CardHeader, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  IconButton, 
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Alert,
  Pagination,
  Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react'
import { deleteProduct, findProduct } from '../../customer/State/Products/Action';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../../config/apiConfig';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

const ProductsTable = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const decodedQueryString = decodeURIComponent(location.search);
    const searchParams = new URLSearchParams(decodedQueryString);
    const priceValue = searchParams.get("price");
    const [currentPage, setCurrentPage] = useState(Number(searchParams.get("page")) || 1);
    const itemsPerPage = 10;
    const [products, setProducts] = useState([]);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

    // Tính toán phân trang
    const totalPages = Math.ceil(products.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedProducts = products.slice(startIndex, endIndex);

     useEffect(() => {
        const token = localStorage.getItem("jwt");
       axios
         .get(`${API_BASE_URL}/api/admin/products/all`, {
           headers: {
             Authorization: `Bearer ${token}`,
           },
         })
         .then((res) => {
           setProducts(res.data);
           // Reset về trang 1 nếu trang hiện tại không hợp lệ
           const maxPage = Math.ceil(res.data.length / itemsPerPage);
           if (currentPage > maxPage && maxPage > 0) {
             setCurrentPage(1);
             navigate("/admin/products?page=1");
           }
         })
         .catch((err) => console.error("Lỗi khi load sản phẩm:", err));
     }, []);

     // Sync currentPage với URL params
     useEffect(() => {
       const pageFromUrl = Number(searchParams.get("page")) || 1;
       if (pageFromUrl !== currentPage) {
         setCurrentPage(pageFromUrl);
       }
     }, [location.search]);

   const handleDeleteClick = (productId) => {
     setProductToDelete(productId);
     setDeleteDialogOpen(true);
   };

   const handleDeleteConfirm = async () => {
     if (!productToDelete) return;

     try {
       await dispatch(deleteProduct(productToDelete));
       const updatedProducts = products.filter((p) => p.id !== productToDelete);
       setProducts(updatedProducts);
       
       // Kiểm tra nếu trang hiện tại trống sau khi xóa
       const maxPage = Math.ceil(updatedProducts.length / itemsPerPage);
       if (currentPage > maxPage && maxPage > 0) {
         const newPage = maxPage;
         setCurrentPage(newPage);
         navigate(`/admin/products?page=${newPage}`);
       }
       
       setSnackbar({
         open: true,
         message: "Đã xóa sản phẩm thành công!",
         severity: "success"
       });
       setDeleteDialogOpen(false);
       setProductToDelete(null);
     } catch (err) {
       console.error("Lỗi khi xóa sản phẩm:", err);
       setSnackbar({
         open: true,
         message: "Xóa sản phẩm thất bại!",
         severity: "error"
       });
       setDeleteDialogOpen(false);
       setProductToDelete(null);
     }
   };

   const handleDeleteCancel = () => {
     setDeleteDialogOpen(false);
     setProductToDelete(null);
   };

   const handleSnackbarClose = (event, reason) => {
     if (reason === 'clickaway') {
       return;
     }
     setSnackbar({ ...snackbar, open: false });
   };

   const handlePageChange = (event, value) => {
     setCurrentPage(value);
     navigate(`/admin/products?page=${value}`);
     // Scroll to top khi đổi trang
     window.scrollTo({ top: 0, behavior: 'smooth' });
   };

  return (
    <div className="p-5 bg-gray-50 min-h-screen">
      <Card className="mt-2 shadow-md rounded-2xl" sx={{ bgcolor: "white" }}>
        <CardHeader
          title="Danh sách sản phẩm"
          titleTypographyProps={{
            sx: {
              fontSize: "1.4rem",
              fontWeight: 600,
              color: "#1f2937",
            },
          }}
          action={
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => navigate("/admin/products/create")}
              sx={{
                borderRadius: "12px",
                textTransform: "none",
                fontWeight: 600,
                px: 3,
                py: 1,
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                "&:hover": {
                  boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                  transform: "translateY(-1px)",
                },
                transition: "all 0.2s ease",
              }}
            >
              Thêm sản phẩm
            </Button>
          }
        />
      </Card>

      <TableContainer
        component={Paper}
        className="mt-4 shadow-sm rounded-2xl overflow-hidden"
      >
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead sx={{ bgcolor: "#f3f4f6" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Ảnh</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Sản phẩm</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Danh mục</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Giá</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Số lượng</TableCell>
              <TableCell align="center" sx={{ fontWeight: 600 }}>
                Thao tác
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    Không có sản phẩm nào
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginatedProducts.map((item) => (
              <TableRow
                key={item.name}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  "&:hover": { bgcolor: "#f9fafb" },
                  transition: "0.2s ease",
                }}
              >
                <TableCell align="center">
                  <Avatar
                    src={item.imageUrl ? (item.imageUrl.startsWith('http') ? item.imageUrl : `${API_BASE_URL}${item.imageUrl}`) : ''}
                    alt={item.title}
                    sx={{
                      width: 50,
                      height: 50,
                      borderRadius: 2,
                      boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                    }}
                  >
                    {!item.imageUrl && item.title?.charAt(0).toUpperCase()}
                  </Avatar>
                </TableCell>

                <TableCell align="left" scope="row">
                  <span className="font-medium text-gray-800">
                    {item.title}
                  </span>
                </TableCell>

                <TableCell align="left">
                  <span className="text-gray-600">{item.category.name}</span>
                </TableCell>

                <TableCell align="left">
                  <span className="text-green-600 font-semibold">
                    {item.price.toLocaleString("vi-VN")}
                  </span>
                </TableCell>

                <TableCell align="left">
                  <span className="text-gray-700">{item.quantity}</span>
                </TableCell>

                <TableCell align="center">
                  <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
                    <Button
                      onClick={() => navigate(`/admin/products/edit/${item.id}`)}
                      variant="outlined"
                      color="primary"
                      size="small"
                      startIcon={<EditIcon />}
                      sx={{
                        borderRadius: "12px",
                        textTransform: "none",
                        fontWeight: 500,
                      }}
                    >
                      Sửa
                    </Button>
                    <Button
                      onClick={() => handleDeleteClick(item.id)}
                      variant="outlined"
                      color="error"
                      size="small"
                      startIcon={<DeleteIcon />}
                      sx={{
                        borderRadius: "12px",
                        textTransform: "none",
                        fontWeight: 500,
                      }}
                    >
                      Xóa
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            )))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      {products.length > 0 && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: 2,
            px: 2,
            py: 1.5,
            bgcolor: "white",
            borderRadius: 2,
            boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
          }}
        >
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ 
              fontSize: "0.875rem",
              fontWeight: 400,
            }}
          >
            Hiển thị <strong>{startIndex + 1}</strong> - <strong>{Math.min(endIndex, products.length)}</strong> trong tổng số <strong>{products.length}</strong> sản phẩm
          </Typography>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            shape="rounded"
            size="small"
            showFirstButton={totalPages > 5}
            showLastButton={totalPages > 5}
            siblingCount={1}
            boundaryCount={1}
            sx={{
              "& .MuiPaginationItem-root": {
                fontSize: "0.875rem",
                minWidth: "32px",
                height: "32px",
                fontWeight: 400,
                "&.Mui-selected": {
                  fontWeight: 600,
                  backgroundColor: "#667eea",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "#5568d3",
                  },
                },
                "&:hover": {
                  backgroundColor: "#f3f4f6",
                },
              },
              "& .MuiPaginationItem-ellipsis": {
                fontSize: "0.875rem",
              },
            }}
          />
        </Box>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
        PaperProps={{
          sx: {
            borderRadius: 3,
            minWidth: 400,
          }
        }}
      >
        <DialogTitle 
          id="delete-dialog-title"
          sx={{
            fontSize: "1.25rem",
            fontWeight: 600,
            color: "#1f2937",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <DeleteIcon color="error" />
          Xác nhận xóa sản phẩm
        </DialogTitle>
        <DialogContent>
          <DialogContentText 
            id="delete-dialog-description"
            sx={{ fontSize: "1rem", color: "#4b5563" }}
          >
            Bạn có chắc chắn muốn xóa sản phẩm này không ?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button
            onClick={handleDeleteCancel}
            variant="outlined"
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 500,
              px: 3,
            }}
          >
            Hủy
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            color="error"
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              px: 3,
              boxShadow: "0 2px 8px rgba(211, 47, 47, 0.3)",
              "&:hover": {
                boxShadow: "0 4px 12px rgba(211, 47, 47, 0.4)",
              },
            }}
            startIcon={<DeleteIcon />}
          >
            Xóa
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success/Error Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          variant="filled"
          sx={{
            borderRadius: 2,
            fontSize: "0.95rem",
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default ProductsTable