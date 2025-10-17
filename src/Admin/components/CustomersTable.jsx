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
} from "@mui/material";
import axios from "axios";
import { API_BASE_URL } from "../../config/apiConfig";

const CustomersTable = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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

  const handleSaveRole = async (userId, role) => {
    try {
      setSaving(true);
      await axios.post(
        `${API_BASE_URL}/users/update-role/${userId}?role=${role}`
      );
      alert(`Đã cập nhật quyền của user #${userId} thành ${role}`);
    } catch (error) {
      console.error("Lỗi khi cập nhật quyền:", error);
      alert("Cập nhật thất bại!");
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
  const handleDelete = async (userId) => {
    if (!window.confirm("Bạn có chắc muốn xóa người dùng này không?")) return;

    try {
      const res = await fetch(`${API_BASE_URL}/users/delete/${userId}`, {
        method: "POST",
      });
      if (res.ok) {
        alert("Đã xóa người dùng thành công!");
        setUsers(users.filter((u) => u.id !== userId));
      } else {
        alert("Bạn không có quyền xóa người dùng này!");
      }
    } catch (err) {
      console.error("Lỗi khi xóa user:", err);
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
              <TableCell>ID</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Họ tên</TableCell>
              <TableCell>Quyền hiện tại</TableCell>
              <TableCell align="center">Thay đổi quyền</TableCell>
              <TableCell align="center">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
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
                    onClick={() => handleDelete(user.id)}
                  >
                    Xóa
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default CustomersTable;
