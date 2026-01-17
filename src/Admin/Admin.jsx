import React, { useState } from "react";
import {
  CssBaseline,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
  Box,
  Typography,
  InputBase,
  Avatar,
  IconButton,
} from "@mui/material";
import { useNavigate, useLocation, Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import SearchIcon from "@mui/icons-material/Search";

// Icons
import DashboardIcon from "@mui/icons-material/Dashboard";
import SettingsIcon from "@mui/icons-material/Settings";
import TableChartIcon from "@mui/icons-material/TableChart";
import MapIcon from "@mui/icons-material/Map";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CancelIcon from "@mui/icons-material/Cancel";
import LogoutIcon from "@mui/icons-material/Logout";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import CategoryIcon from "@mui/icons-material/Category";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import PeopleIcon from "@mui/icons-material/People";

// Components
import CreateProductForm from "./components/CreateProductForm";
import ProductsTable from "./components/ProductsTable";
import OrdersTable from "./components/OrdersTable";
import CustomersTable from "./components/CustomersTable";
import InventoryTable from "./components/InventoryTable";
import AdminDashboard from "./components/Dashboard";
import CategoryTable from "./components/CategoryTable";
import AdminChat from "../customer/components/Chat/AdminChat";
import OrderCancellationRequests from "./components/OrderCancellationRequests";
import avt from "../assets/img/avt.jpg";

// Menu sections
const menuSections = [
  {
    title: "Hệ thống",
    items: [
      { name: "Dashboard", link: "/admin", icon: <DashboardIcon /> },
      { name: "Sản phẩm", link: "/admin/products", icon: <Inventory2Icon /> },
      { name: "Danh mục", link: "/admin/categories", icon: <CategoryIcon /> },
    ],
  },
  {
    title: "QUẢN LÝ",
    items: [
      { name: "Kho hàng", link: "/admin/inventory", icon: <WarehouseIcon /> },
      { name: "Đơn hàng", link: "/admin/orders", icon: <ShoppingCartIcon /> },
      { name: "Khách hàng", link: "/admin/customers", icon: <PeopleIcon /> },
      { name: "Hủy đơn", link: "/admin/cancellation-requests", icon: <CancelIcon /> },
    ],
  },
];

const Admin = () => {
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("lg"));
  const navigate = useNavigate();
  const location = useLocation();
  const { auth } = useSelector((store) => store);
  const user = auth?.user;

  // Get page title based on current route
  const getPageTitle = () => {
    const allItems = menuSections.flatMap(section => section.items);
    const currentItem = allItems.find(item => item.link === location.pathname);
    return currentItem?.name?.toUpperCase() || "DASHBOARD";
  };

  const drawer = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        background: "linear-gradient(180deg, #1e88e5 0%, #1565c0 100%)",
        width: 250,
        color: "#fff",
      }}
    >
      {/* Logo */}
      <Box sx={{ p: 3, pb: 2 }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            fontSize: "1.25rem",
            letterSpacing: "1px",
          }}
        >
          Quản lý hệ thống
        </Typography>
      </Box>

      {/* Menu Sections */}
      <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
        {menuSections.map((section, sectionIndex) => (
          <Box key={sectionIndex} sx={{ mb: 2 }}>
            {/* Section Title */}
            <Typography
              sx={{
                px: 3,
                py: 1.5,
                fontSize: "0.7rem",
                fontWeight: 700,
                letterSpacing: "1px",
                color: "rgba(255,255,255,0.6)",
                textTransform: "uppercase",
              }}
            >
              {section.title}
            </Typography>

            {/* Section Items */}
            <List sx={{ px: 1.5, py: 0 }}>
              {section.items.map((item) => {
                const isSelected = location.pathname === item.link;
                return (
                  <ListItem
                    key={item.name}
                    disablePadding
                    onClick={() => navigate(item.link)}
                    sx={{ mb: 0.5 }}
                  >
                    <ListItemButton
                      selected={isSelected}
                      sx={{
                        borderRadius: 1,
                        py: 1.25,
                        px: 2,
                        "&.Mui-selected": {
                          bgcolor: "rgba(255,255,255,0.15)",
                          "&:hover": {
                            bgcolor: "rgba(255,255,255,0.2)",
                          },
                        },
                        "&:hover": {
                          bgcolor: "rgba(255,255,255,0.1)",
                        },
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 36,
                          color: isSelected ? "#fff" : "rgba(255,255,255,0.8)",
                        }}
                      >
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={item.name}
                        primaryTypographyProps={{
                          fontSize: "0.875rem",
                          fontWeight: isSelected ? 600 : 400,
                          color: isSelected ? "#fff" : "rgba(255,255,255,0.9)",
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </Box>
        ))}
      </Box>

      {/* Logout */}
      <Box sx={{ borderTop: "1px solid rgba(255,255,255,0.1)", p: 1.5 }}>
        <ListItemButton
          onClick={() => {
            localStorage.removeItem("jwt");
            navigate("/admin/login");
          }}
          sx={{
            borderRadius: 1,
            py: 1.25,
            "&:hover": {
              bgcolor: "rgba(255,255,255,0.1)",
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: 36, color: "rgba(255,255,255,0.8)" }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText
            primary="Đăng xuất"
            primaryTypographyProps={{
              fontSize: "0.875rem",
              color: "rgba(255,255,255,0.9)",
            }}
          />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <div className="flex h-screen bg-gray-100">
      <CssBaseline />

      {/* Sidebar */}
      <Box sx={{ flexShrink: 0 }}>
        {drawer}
      </Box>

      {/* Main Content Area */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Header */}
        <Box
          sx={{
            bgcolor: "#f8fafc",
            px: 4,
            py: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          {/* Page Title */}
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: "#1e88e5",
              fontSize: "1rem",
              letterSpacing: "0.5px",
            }}
          >
            {getPageTitle()}
          </Typography>

          {/* Right Side - Search & Avatar */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
            {/* Search */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                bgcolor: "#fff",
                borderRadius: 2,
                px: 2,
                py: 0.75,
                border: "1px solid #e5e7eb",
                minWidth: 240,
              }}
            >
              <SearchIcon sx={{ color: "#9ca3af", mr: 1, fontSize: 20 }} />
              <InputBase
                placeholder="Tìm kiếm..."
                sx={{
                  fontSize: "0.875rem",
                  "& input::placeholder": {
                    color: "#9ca3af",
                    opacity: 1,
                  },
                }}
              />
            </Box>

            {/* User Avatar */}
            <Avatar
              src={avt}
              sx={{
                width: 40,
                height: 40,
                border: "2px solid #e5e7eb",
                cursor: "pointer",
              }}
            />
          </Box>
        </Box>

        {/* Content */}
        <Box sx={{ flex: 1, overflow: "auto", bgcolor: "#eef2f6" }}>
          <Routes>
            <Route path="/" element={<AdminDashboard />} />
            <Route path="/products/create" element={<CreateProductForm />} />
            <Route path="/products/edit/:productId" element={<CreateProductForm />} />
            <Route path="/products" element={<ProductsTable />} />
            <Route path="/categories" element={<CategoryTable />} />
            <Route path="/inventory" element={<InventoryTable />} />
            <Route path="/orders" element={<OrdersTable />} />
            <Route path="/customers" element={<CustomersTable />} />
            <Route path="/cancellation-requests" element={<OrderCancellationRequests />} />
          </Routes>
        </Box>
      </Box>

      <AdminChat />
    </div>
  );
};

export default Admin;
