import React, { useEffect, useState } from "react";
import { AccountCircle, TrendingUp } from "@mui/icons-material";
import SettingsCellIcon from "@mui/icons-material/SettingsCell";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  Grid,
  IconButton,
  Typography,
  useTheme,
  CircularProgress,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

// Hàm format số
const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + "k";
  }
  return num?.toLocaleString("vi-VN") || "0";
};

// Hàm format tiền
const formatCurrency = (amount) => {
  if (!amount) return "0 đ";
  if (amount >= 1000000) {
    return (amount / 1000000).toFixed(1) + "M đ";
  } else if (amount >= 1000) {
    return (amount / 1000).toFixed(1) + "k đ";
  }
  return amount.toLocaleString("vi-VN") + " đ";
};

// Hàm render từng ô thống kê
const renderStats = (theme, stats) => {
  const salesData = [
    {
      stats: formatNumber(stats.totalSalesQuantity),
      title: "Doanh số",
      color: "primary.main",
      icon: <TrendingUp sx={{ fontSize: "1.75rem" }} />,
    },
    {
      stats: formatNumber(stats.totalCustomers),
      title: "Khách hàng",
      color: "success.main",
      icon: <AccountCircle sx={{ fontSize: "1.75rem" }} />,
    },
    {
      stats: formatNumber(stats.totalProducts),
      title: "Sản phẩm",
      color: "warning.main",
      icon: <SettingsCellIcon sx={{ fontSize: "1.75rem" }} />,
    },
    {
      stats: formatCurrency(stats.totalRevenue),
      title: "Doanh thu",
      color: "info.main",
      icon: <AttachMoneyIcon sx={{ fontSize: "1.75rem" }} />,
    },
  ];

  return salesData.map((item, index) => (
    <Grid item xs={12} sm={6} md={3} key={index}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          p: 3,
          borderRadius: 2.5,
          bgcolor: "#fff",
          boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
          border: "1px solid #e5e7eb",
          transition: "all 0.3s ease",
          cursor: "pointer",
          "&:hover": {
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
            transform: "translateY(-4px)",
            borderColor: "#d1d5db",
          },
        }}
      >
        <Avatar
          variant="rounded"
          sx={{
            mr: 2.5,
            width: 64,
            height: 64,
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            color: "#fff",
            bgcolor: item.color,
            borderRadius: 2,
          }}
        >
          {item.icon}
        </Avatar>
        <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <Typography
            variant="body2"
            sx={{ 
              color: "#6b7280", 
              fontWeight: 500, 
              mb: 0.75,
              fontSize: "0.875rem",
            }}
          >
            {item.title}
          </Typography>
          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: 700,
              color: "#111827",
              fontSize: "1.5rem",
              lineHeight: 1.2,
            }}
          >
            {item.stats || "0"}
          </Typography>
        </Box>
      </Box>
    </Grid>
  ));
};

// Component chính
const MonthlyOverview = ({ stats, loading }) => {
  const theme = useTheme();

  return (
    <Card
      sx={{ 
        boxShadow: "0 8px 32px rgba(0,0,0,0.12)", 
        height: "100%", 
        bgcolor: "#1e293b",
        color: "#fff",
        borderRadius: 3,
        border: "1px solid rgba(255,255,255,0.1)",
        overflow: "hidden",
      }}
    >
      <CardHeader
        title="Tổng quan hàng tháng"
        action={
          <IconButton 
            size="small" 
            aria-label="more options" 
            sx={{ 
              color: "rgba(255,255,255,0.7)",
              "&:hover": {
                bgcolor: "rgba(255,255,255,0.1)",
                color: "#fff",
              },
            }}
          >
            <MoreVertIcon />
          </IconButton>
        }
        subheader={
          <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)", mt: 0.5 }}>
            Tổng quan hệ thống
          </Typography>
        }
        titleTypographyProps={{
          sx: {
            fontSize: "1.5rem",
            fontWeight: 700,
            color: "#fff",
            letterSpacing: "-0.5px",
          },
        }}
        sx={{ pb: 2 }}
      />

      <CardContent sx={{ pt: 1, px: 3, pb: 3 }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress sx={{ color: "#fff" }} />
          </Box>
        ) : (
          <Grid container spacing={2.5}>
            {renderStats(theme, stats)}
          </Grid>
        )}
      </CardContent>
    </Card>
  );
};

export default MonthlyOverview;
