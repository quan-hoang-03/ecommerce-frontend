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
          p: 2,
          borderRadius: 3,
          bgcolor: theme.palette.background.default,
          boxShadow: 1,
          transition: "0.3s",
          "&:hover": {
            boxShadow: 4,
            transform: "translateY(-4px)",
          },
        }}
      >
        <Avatar
          variant="rounded"
          sx={{
            mr: 2.5,
            width: 48,
            height: 48,
            boxShadow: 3,
            color: "#fff",
            bgcolor: item.color,
          }}
        >
          {item.icon}
        </Avatar>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Typography
            variant="caption"
            sx={{ color: "text.secondary", fontWeight: 500 }}
          >
            {item.title}
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 700,
              color: "#6b7280"
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
      sx={{ boxShadow: 3, height: "100%", bgcolor: "#242B2E", color: "#fff" }}
    >
      <CardHeader
        title="Tổng quan hàng tháng"
        action={
          <IconButton size="small" aria-label="more options" sx={{ color: "#fff" }}>
            <MoreVertIcon />
          </IconButton>
        }
        subheader={
          <Typography variant="body2" sx={{ color: "#fff" }}>
            <Box
              component="span"
              sx={{ fontWeight: 600, mr: 0.5 }}
            >
              Tổng quan
            </Box>
            hệ thống
          </Typography>
        }
        titleTypographyProps={{
          sx: {
            mb: 1.5,
            lineHeight: "2rem !important",
            letterSpacing: ".15px !important",
          },
        }}
      />

      <CardContent sx={{ pt: theme.spacing(2) }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress sx={{ color: "#fff" }} />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {renderStats(theme, stats)}
          </Grid>
        )}
      </CardContent>
    </Card>
  );
};

export default MonthlyOverview;
