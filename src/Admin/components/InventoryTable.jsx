import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getInventory,
  updateInventory,
  addInventory,
  reduceInventory,
  deleteInventory,
} from '../../customer/State/Admin/Inventory/Action';
import { API_BASE_URL } from '../../config/apiConfig';
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
  Tooltip,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Box,
  Pagination,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

const InventoryTable = () => {
  const dispatch = useDispatch();
  const { adminInventory } = useSelector((store) => store);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [reduceDialogOpen, setReduceDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(0);
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  useEffect(() => {
    dispatch(getInventory());
  }, []);

  // Tự động điều chỉnh trang khi dữ liệu thay đổi
  useEffect(() => {
    const inventory = adminInventory?.inventory || [];
    const totalPages = Math.ceil(inventory.length / rowsPerPage);
    if (page > totalPages && totalPages > 0) {
      setPage(totalPages);
    }
  }, [adminInventory?.inventory, page, rowsPerPage]);

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  const handleOpenEditDialog = (product) => {
    setSelectedProduct(product);
    setQuantity(product.quantity);
    setEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setSelectedProduct(null);
    setQuantity(0);
  };

  const handleOpenAddDialog = (product) => {
    setSelectedProduct(product);
    setQuantity(0);
    setAddDialogOpen(true);
  };

  const handleCloseAddDialog = () => {
    setAddDialogOpen(false);
    setSelectedProduct(null);
    setQuantity(0);
  };

  const handleOpenReduceDialog = (product) => {
    setSelectedProduct(product);
    setQuantity(0);
    setReduceDialogOpen(true);
  };

  const handleCloseReduceDialog = () => {
    setReduceDialogOpen(false);
    setSelectedProduct(null);
    setQuantity(0);
  };

  const handleOpenDeleteDialog = (product) => {
    setSelectedProduct(product);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setSelectedProduct(null);
  };

  const handleUpdateInventory = async () => {
    if (quantity < 0) {
      setSnackbar({
        open: true,
        message: "Số lượng không thể âm!",
        severity: "error",
      });
      return;
    }

    try {
      await dispatch(updateInventory(selectedProduct.id, quantity));
      setSnackbar({
        open: true,
        message: "Cập nhật số lượng thành công!",
        severity: "success",
      });
      handleCloseEditDialog();
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Có lỗi xảy ra khi cập nhật!",
        severity: "error",
      });
    }
  };

  const handleAddInventory = async () => {
    if (quantity <= 0) {
      setSnackbar({
        open: true,
        message: "Số lượng phải lớn hơn 0!",
        severity: "error",
      });
      return;
    }

    try {
      await dispatch(addInventory(selectedProduct.id, quantity));
      setSnackbar({
        open: true,
        message: `Đã thêm ${quantity} sản phẩm vào kho!`,
        severity: "success",
      });
      handleCloseAddDialog();
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || "Có lỗi xảy ra khi thêm!",
        severity: "error",
      });
    }
  };

  const handleReduceInventory = async () => {
    if (quantity <= 0) {
      setSnackbar({
        open: true,
        message: "Số lượng phải lớn hơn 0!",
        severity: "error",
      });
      return;
    }

    if (quantity > selectedProduct.quantity) {
      setSnackbar({
        open: true,
        message: `Số lượng không đủ! Hiện có: ${selectedProduct.quantity}`,
        severity: "error",
      });
      return;
    }

    try {
      await dispatch(reduceInventory(selectedProduct.id, quantity));
      setSnackbar({
        open: true,
        message: `Đã giảm ${quantity} sản phẩm khỏi kho!`,
        severity: "success",
      });
      handleCloseReduceDialog();
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || "Có lỗi xảy ra khi giảm!",
        severity: "error",
      });
    }
  };

  const handleDeleteInventory = async () => {
    try {
      await dispatch(deleteInventory(selectedProduct.id));
      setSnackbar({
        open: true,
        message: "Đã xóa số lượng trong kho!",
        severity: "success",
      });
      handleCloseDeleteDialog();
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Có lỗi xảy ra khi xóa!",
        severity: "error",
      });
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Tính toán dữ liệu phân trang
  const inventory = adminInventory?.inventory || [];
  const totalPages = Math.ceil(inventory.length / rowsPerPage);
  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedInventory = inventory.slice(startIndex, endIndex);

  return (
    <div className="p-5 bg-gray-50 min-h-screen">
      <Card className="mt-2 shadow-md rounded-2xl" sx={{ bgcolor: "white" }}>
        <CardHeader
          title="Quản lý kho hàng"
          titleTypographyProps={{
            sx: {
              fontSize: "1.4rem",
              fontWeight: 600,
              color: "#1f2937",
            },
          }}
        />
      </Card>

      <TableContainer
        component={Paper}
        className="mt-4 shadow-sm rounded-2xl overflow-hidden"
      >
        <Table sx={{ minWidth: 650 }} aria-label="inventory table">
          <TableHead sx={{ bgcolor: "#f3f4f6" }}>
            <TableRow>
              <TableCell align="center" sx={{ fontWeight: 600 }}>
                Ảnh
              </TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Tên sản phẩm</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Số lượng trong kho</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Số lượng đã bán</TableCell>
              <TableCell align="center" sx={{ fontWeight: 600 }}>
                Thao tác
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedInventory.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    Không có sản phẩm nào trong kho
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginatedInventory.map((product) => (
              <TableRow
                key={product.id}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  "&:hover": { bgcolor: "#f9fafb" },
                  transition: "0.2s ease",
                }}
              >
                <TableCell align="center">
                  <Avatar
                    src={product.imageUrl ? (product.imageUrl.startsWith('http') ? product.imageUrl : `${API_BASE_URL}${product.imageUrl}`) : ''}
                    alt={product.title}
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: 2,
                      boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                      bgcolor: product.imageUrl ? 'transparent' : '#e5e7eb',
                    }}
                  >
                    {!product.imageUrl && (
                      <span className="text-gray-600 font-semibold text-lg">
                        {product.title?.charAt(0)?.toUpperCase() || '?'}
                      </span>
                    )}
                  </Avatar>
                </TableCell>

                <TableCell>
                  <span className="font-medium text-gray-800">
                    {product.title}
                  </span>
                </TableCell>

                <TableCell>
                  <span
                    className={`font-semibold ${
                      product.quantity > 10
                        ? "text-green-600"
                        : product.quantity > 0
                        ? "text-orange-600"
                        : "text-red-600"
                    }`}
                  >
                    {product.quantity || 0}
                  </span>
                </TableCell>

                <TableCell>
                  <span className="text-gray-700 font-medium">
                    {product.soldQuantity || 0}
                  </span>
                </TableCell>

                <TableCell align="center">
                  <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
                    <Tooltip title="Sửa số lượng">
                      <IconButton
                        onClick={() => handleOpenEditDialog(product)}
                        sx={{ color: "#3b82f6" }}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Thêm vào kho">
                      <IconButton
                        onClick={() => handleOpenAddDialog(product)}
                        sx={{ color: "#10b981" }}
                      >
                        <AddIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Giảm khỏi kho">
                      <IconButton
                        onClick={() => handleOpenReduceDialog(product)}
                        sx={{ color: "#f59e0b" }}
                      >
                        <RemoveIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Xóa số lượng">
                      <IconButton
                        onClick={() => handleOpenDeleteDialog(product)}
                        sx={{ color: "#ef4444" }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination và thông tin */}
      {inventory.length > 0 && (
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 3, px: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Hiển thị {startIndex + 1} - {Math.min(endIndex, inventory.length)} trong tổng số {inventory.length} sản phẩm
          </Typography>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handleChangePage}
            color="primary"
            shape="rounded"
            size="large"
            showFirstButton
            showLastButton
          />
        </Box>
      )}

      {/* Dialog Sửa số lượng */}
      <Dialog open={editDialogOpen} onClose={handleCloseEditDialog}>
        <DialogTitle>Sửa số lượng trong kho</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Sản phẩm: <strong>{selectedProduct?.title}</strong>
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Số lượng"
            type="number"
            fullWidth
            variant="outlined"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>Hủy</Button>
          <Button onClick={handleUpdateInventory} variant="contained">
            Cập nhật
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Thêm vào kho */}
      <Dialog open={addDialogOpen} onClose={handleCloseAddDialog}>
        <DialogTitle>Thêm sản phẩm vào kho</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Sản phẩm: <strong>{selectedProduct?.title}</strong>
            <br />
            Số lượng hiện có: <strong>{selectedProduct?.quantity || 0}</strong>
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Số lượng thêm"
            type="number"
            fullWidth
            variant="outlined"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddDialog}>Hủy</Button>
          <Button onClick={handleAddInventory} variant="contained" color="success">
            Thêm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Giảm khỏi kho */}
      <Dialog open={reduceDialogOpen} onClose={handleCloseReduceDialog}>
        <DialogTitle>Giảm sản phẩm khỏi kho</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Sản phẩm: <strong>{selectedProduct?.title}</strong>
            <br />
            Số lượng hiện có: <strong>{selectedProduct?.quantity || 0}</strong>
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Số lượng giảm"
            type="number"
            fullWidth
            variant="outlined"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseReduceDialog}>Hủy</Button>
          <Button onClick={handleReduceInventory} variant="contained" color="warning">
            Giảm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Xóa số lượng */}
      <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Xác nhận xóa số lượng</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn xóa số lượng trong kho của sản phẩm{" "}
            <strong>{selectedProduct?.title}</strong>?
            <br />
            Số lượng hiện có: <strong>{selectedProduct?.quantity || 0}</strong>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Hủy</Button>
          <Button onClick={handleDeleteInventory} variant="contained" color="error">
            Xóa
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar thông báo */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default InventoryTable;
