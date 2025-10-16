import React from "react";
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
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

// Dữ liệu thống kê
const salesData = [
  {
    stats: "245k",
    title: "Doanh số",
    color: "primary.main",
    icon: <TrendingUp sx={{ fontSize: "1.75rem" }} />,
  },
  {
    stats: "12.5k",
    title: "Khách hàng",
    color: "success.main",
    icon: <AccountCircle sx={{ fontSize: "1.75rem" }} />,
  },
  {
    stats: "1.45k",
    title: "Sản phẩm",
    color: "warning.main",
    icon: <SettingsCellIcon sx={{ fontSize: "1.75rem" }} />,
  },
  {
    stats: "$18.8k",
    title: "Doanh thu",
    color: "info.main",
    icon: <AttachMoneyIcon sx={{ fontSize: "1.75rem" }} />,
  },
];

// Hàm render từng ô thống kê
const renderStats = (theme) => {
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
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {item.stats}
          </Typography>
        </Box>
      </Box>
    </Grid>
  ));
};

// Component chính
const MonthlyOverview = () => {
  const theme = useTheme();

  return (
    <Card
      sx={{ boxShadow: 3, height: "100%", bgcolor: "#242B2E", color: "#fff" }}
    >
      <CardHeader
        title="Tổng quan hàng tháng"
        action={
          <IconButton size="small" aria-label="more options">
            <MoreVertIcon />
          </IconButton>
        }
        subheader={
          <Typography variant="body2" sx={{ color: "#fff" }}>
            <Box
              component="span"
              sx={{ fontWeight: 600, mr: 0.5 }}
            >
              Tăng trưởng 48,5%
            </Box>
            so với tháng trước
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
        <Grid container spacing={3}>
          {renderStats(theme)}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default MonthlyOverview;
