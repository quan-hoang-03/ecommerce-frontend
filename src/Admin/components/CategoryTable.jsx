import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Alert,
  Snackbar,
  Chip,
  Typography,
  CircularProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { api } from "../../config/apiConfig";

const CategoryTable = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    displayName: "",
    parentName: "",
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [deleteConfirm, setDeleteConfirm] = useState({
    open: false,
    category: null,
  });

  // Fetch all categories
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/api/admin/categories");
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      showSnackbar("Lỗi khi tải danh mục", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Show snackbar notification
  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Open dialog for creating new category
  const handleOpenCreateDialog = () => {
    setEditingCategory(null);
    setFormData({ name: "", displayName: "", parentName: "" });
    setOpenDialog(true);
  };

  // Open dialog for editing category
  const handleOpenEditDialog = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      displayName: category.displayName || "",
      parentName: category.parentCategory?.name || "",
    });
    setOpenDialog(true);
  };

  // Close dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingCategory(null);
    setFormData({ name: "", displayName: "", parentName: "" });
  };

  // Submit form (create or update)
  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      showSnackbar("Vui lòng nhập tên danh mục", "error");
      return;
    }

    try {
      if (editingCategory) {
        // Update
        await api.put(`/api/admin/categories/${editingCategory.id}`, formData);
        showSnackbar("Cập nhật danh mục thành công");
      } else {
        // Create
        await api.post("/api/admin/categories", formData);
        showSnackbar("Thêm danh mục thành công");
      }
      handleCloseDialog();
      fetchCategories();
    } catch (error) {
      const message = error.response?.data?.message || "Có lỗi xảy ra";
      showSnackbar(message, "error");
    }
  };

  // Open delete confirmation
  const handleOpenDeleteConfirm = (category) => {
    setDeleteConfirm({ open: true, category });
  };

  // Close delete confirmation
  const handleCloseDeleteConfirm = () => {
    setDeleteConfirm({ open: false, category: null });
  };

  // Delete category
  const handleDelete = async () => {
    try {
      await api.delete(`/api/admin/categories/${deleteConfirm.category.id}`);
      showSnackbar("Xóa danh mục thành công");
      handleCloseDeleteConfirm();
      fetchCategories();
    } catch (error) {
      const message = error.response?.data?.message || "Có lỗi xảy ra";
      showSnackbar(message, "error");
      handleCloseDeleteConfirm();
    }
  };

  // Get level chip color
  const getLevelColor = (level) => {
    switch (level) {
      case 1:
        return "primary";
      case 2:
        return "secondary";
      case 3:
        return "success";
      default:
        return "default";
    }
  };

  // Get parent categories for dropdown (exclude current category when editing)
  const getParentOptions = () => {
    return categories.filter((cat) => {
      if (editingCategory) {
        // Can't be parent of itself or its children
        return cat.id !== editingCategory.id && cat.level < 3;
      }
      return cat.level < 3;
    });
  };

  return (
    <Box className="p-5">
      <Card>
        <CardHeader
          title={
            <Typography variant="h5" fontWeight="bold">
              Quản lý danh mục
            </Typography>
          }
          action={
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenCreateDialog}
              sx={{
                bgcolor: "#9155fd",
                "&:hover": { bgcolor: "#7c3aed" },
              }}
            >
              Thêm danh mục
            </Button>
          }
        />

        <TableContainer component={Paper}>
          {loading ? (
            <Box display="flex" justifyContent="center" py={5}>
              <CircularProgress />
            </Box>
          ) : (
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                  <TableCell sx={{ fontWeight: "bold" }}>ID</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Tên (slug)</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Tên hiển thị</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Cấp</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Danh mục cha</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }} align="center">
                    Thao tác
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {categories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 5 }}>
                      <Typography color="textSecondary">
                        Chưa có danh mục nào
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  categories.map((category) => (
                    <TableRow
                      key={category.id}
                      sx={{
                        "&:hover": { bgcolor: "#fafafa" },
                        pl: category.level * 2,
                      }}
                    >
                      <TableCell>{category.id}</TableCell>
                      <TableCell>
                        <code
                          style={{
                            background: "#f0f0f0",
                            padding: "2px 8px",
                            borderRadius: 4,
                          }}
                        >
                          {category.name}
                        </code>
                      </TableCell>
                      <TableCell>
                        <Typography fontWeight="medium">
                          {category.displayName || category.name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={`Cấp ${category.level}`}
                          color={getLevelColor(category.level)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {category.parentCategory ? (
                          <Chip
                            label={
                              category.parentCategory.displayName ||
                              category.parentCategory.name
                            }
                            variant="outlined"
                            size="small"
                          />
                        ) : (
                          <Typography color="textSecondary" variant="body2">
                            —
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          color="primary"
                          onClick={() => handleOpenEditDialog(category)}
                          size="small"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleOpenDeleteConfirm(category)}
                          size="small"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </TableContainer>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingCategory ? "Sửa danh mục" : "Thêm danh mục mới"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            <TextField
              label="Tên danh mục (slug)"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              fullWidth
              required
              helperText="Dùng cho URL, VD: trang_diem, son_moi"
              disabled={!!editingCategory} // Không cho sửa name khi edit
            />
            <TextField
              label="Tên hiển thị"
              name="displayName"
              value={formData.displayName}
              onChange={handleInputChange}
              fullWidth
              helperText="Tên đẹp hiển thị cho khách hàng, VD: Trang điểm, Son môi"
            />
            <TextField
              label="Danh mục cha"
              name="parentName"
              value={formData.parentName}
              onChange={handleInputChange}
              select
              fullWidth
              helperText="Để trống nếu là danh mục cấp 1"
            >
              <MenuItem value="">
                <em>Không có (Cấp 1)</em>
              </MenuItem>
              {getParentOptions().map((cat) => (
                <MenuItem key={cat.id} value={cat.name}>
                  {"—".repeat(cat.level - 1)} {cat.displayName || cat.name}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseDialog}>Hủy</Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{
              bgcolor: "#9155fd",
              "&:hover": { bgcolor: "#7c3aed" },
            }}
          >
            {editingCategory ? "Cập nhật" : "Thêm"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirm.open} onClose={handleCloseDeleteConfirm}>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn xóa danh mục "
            <strong>
              {deleteConfirm.category?.displayName || deleteConfirm.category?.name}
            </strong>
            "?
          </Typography>
          <Alert severity="warning" sx={{ mt: 2 }}>
            Chỉ có thể xóa danh mục không có danh mục con và không có sản phẩm.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteConfirm}>Hủy</Button>
          <Button variant="contained" color="error" onClick={handleDelete}>
            Xóa
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CategoryTable;
