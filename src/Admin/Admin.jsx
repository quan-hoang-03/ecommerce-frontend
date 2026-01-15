import React, { useState } from "react";
import {
  CssBaseline,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  useMediaQuery,
  useTheme,
  Box,
} from "@mui/material";
import { useNavigate, useLocation, Routes, Route } from "react-router-dom";

// Icons
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonIcon from "@mui/icons-material/Person";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import InventoryIcon from "@mui/icons-material/Inventory";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CreateProductForm from "./components/CreateProductForm";
import ProductsTable from "./components/ProductsTable";
import OrdersTable from "./components/OrdersTable";
import CustomersTable from "./components/CustomersTable";
import InventoryTable from "./components/InventoryTable";
import AdminDashboard from "./components/Dashboard";
import LogoutIcon from "@mui/icons-material/Logout";


// Sidebar menu
const menu = [
  { name: "Dashboard", link: "/admin", icon: <DashboardIcon /> },
  { name: "Sản phẩm", link: "/admin/products", icon: <InventoryIcon /> },
  { name: "Quản lý kho", link: "/admin/inventory", icon: <WarehouseIcon /> },
  { name: "Người dùng", link: "/admin/customers", icon: <PersonIcon /> },
  { name: "Đơn hàng", link: "/admin/orders", icon: <ShoppingCartIcon /> },
];

const Admin = () => {
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("lg"));
  const [sideBarVisible, setSideBarVisible] = useState(isLargeScreen);
  const navigate = useNavigate();
  const location = useLocation();

  const drawer = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        bgcolor: "#fff",
        borderRight: "1px solid #ddd",
        p: 1,
      }}
    >
      {/* Toolbar để chừa chỗ nếu có AppBar */}
      {/* {isLargeScreen && <Toolbar />} */}

      {/* Danh sách menu chính */}
      <List sx={{ flexGrow: 1, mt: 1 }}>
        {menu.map((item) => (
          <ListItem
            key={item.name}
            disablePadding
            onClick={() => navigate(item.link)}
            sx={{
              borderRadius: 2,
              mb: 0.5,
            }}
          >
            <ListItemButton
              selected={location.pathname === item.link}
              sx={{
                "&.Mui-selected": {
                  bgcolor: "#ccc",
                  color: "#fff",
                  "& .MuiListItemIcon-root": { color: "#fff" },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* Mục tài khoản ở cuối */}
      <List sx={{ borderTop: "1px solid #eee", mt: "auto" }}>
        <ListItem
          disablePadding
          onClick={() => {
            localStorage.removeItem("jwt");
            navigate("/admin/login");
          }}
        >
          <ListItemButton>
            <ListItemIcon sx={{ minWidth: 40 }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Đăng xuất" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <div>
    <div className="flex h-[100vh] sticky top-0">
      <CssBaseline />

      {/* Sidebar */}
      <div className="w-[15%] border-r border-gray-300">
        {drawer}
      </div>

      {/* Nội dung bên phải */}
      <div className="w-[85%] ">
        <Routes>
          <Route path="/" element={<AdminDashboard />} />
          <Route path="/products/create" element={<CreateProductForm />} />
          <Route path="/products/edit/:productId" element={<CreateProductForm />} />
          <Route path="/products" element={<ProductsTable />} />
          <Route path="/inventory" element={<InventoryTable />} />
          <Route path="/orders" element={<OrdersTable />} />
          <Route path="/customers" element={<CustomersTable />} />
        </Routes>
      </div>
    </div>

    </div>
  );
};

export default Admin;
