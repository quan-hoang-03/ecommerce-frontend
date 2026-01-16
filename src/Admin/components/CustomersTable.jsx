import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import axios from "axios";
import { API_BASE_URL } from "../../config/apiConfig";

const CustomersTable = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info", // 'success', 'error', 'warning', 'info'
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/users/all`);
      setUsers(res.data);
    } catch (error) {
      console.error("Lỗi khi tải danh sách người dùng:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = (userId, newRole) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  const handleSaveRole = async (userId, role) => {
    try {
      setSaving(true);
      await axios.post(
        `${API_BASE_URL}/users/update-role/${userId}?role=${role}`
      );
      // Tìm user để lấy email
      const user = users.find((u) => u.id === userId);
      const userEmail = user?.email || `user #${userId}`;
      setSnackbar({
        open: true,
        message: `Đã cập nhật quyền của người dùng ${userEmail} thành ${role}`,
        severity: "success",
      });
    } catch (error) {
      console.error("Lỗi khi cập nhật quyền:", error);
      setSnackbar({
        open: true,
        message: "Cập nhật thất bại!",
        severity: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    );
  }
  const handleOpenDeleteDialog = (user) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  const handleDelete = async () => {
    if (!userToDelete) return;

    try {
      const res = await fetch(`${API_BASE_URL}/users/delete/${userToDelete.id}`, {
        method: "POST",
      });
      if (res.ok) {
        setUsers(users.filter((u) => u.id !== userToDelete.id));
        setSnackbar({
          open: true,
          message: "Đã xóa người dùng thành công!",
          severity: "success",
        });
        handleCloseDeleteDialog();
      } else {
        setSnackbar({
          open: true,
          message: "Bạn không có quyền xóa người dùng này!",
          severity: "error",
        });
      }
    } catch (err) {
      console.error("Lỗi khi xóa user:", err);
      setSnackbar({
        open: true,
        message: "Có lỗi xảy ra khi xóa người dùng!",
        severity: "error",
      });
    }
  };

  return (
    <Box p={4}>
      <Typography variant="h5" mb={3} fontWeight="bold">
        Quản lý quyền người dùng
      </Typography>

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell>STT</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Họ tên</TableCell>
              <TableCell>Quyền hiện tại</TableCell>
              <TableCell align="center">Thay đổi quyền</TableCell>
              <TableCell align="center">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user,index) => (
              <TableRow key={user.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {user.firstName} {user.lastName}
                </TableCell>
                <TableCell>
                  <Typography
                    color={
                      user.role === "ADMIN"
                        ? "error"
                        : user.role === "USER"
                        ? "primary"
                        : "text.secondary"
                    }
                  >
                    {user.role}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Box display="flex" alignItems="center" gap={2}>
                    <Select
                      size="small"
                      value={user.role}
                      onChange={(e) =>
                        handleRoleChange(user.id, e.target.value)
                      }
                    >
                      <MenuItem value="USER">USER</MenuItem>
                      <MenuItem value="ADMIN">ADMIN</MenuItem>
                    </Select>

                    <Button
                      variant="contained"
                      size="small"
                      disabled={saving}
                      onClick={() => handleSaveRole(user.id, user.role)}
                    >
                      {saving ? "Đang lưu..." : "Lưu"}
                    </Button>
                  </Box>
                </TableCell>
                <TableCell align="center">
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    sx={{
                      borderRadius: "12px",
                      textTransform: "none",
                      fontWeight: 500,
                    }}
                    onClick={() => handleOpenDeleteDialog(user)}
                  >
                    Xóa
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog Xác nhận xóa */}
      <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Xác nhận xóa người dùng</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn xóa người dùng{" "}
            <strong>
              {userToDelete?.firstName} {userToDelete?.lastName}
            </strong>{" "}
            ({userToDelete?.email})?
            <br />
            Hành động này không thể hoàn tác!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Hủy</Button>
          <Button onClick={handleDelete} variant="contained" color="error">
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
    </Box>
  );
};

export default CustomersTable;
