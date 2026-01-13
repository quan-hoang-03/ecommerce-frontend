import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardContent,
  Typography,
  Box,
  styled,
  CircularProgress,
} from "@mui/material";
import avt from "../../assets/img/avt.jpg"; // ảnh cúp (bạn có thể đổi đường dẫn)
import { useNavigate } from "react-router-dom";

const TrophyImg = styled("img")({
  height: 90,
  position: "absolute",
  right: 16,
  top: "50%",
  transform: "translateY(-50%)",
  borderRadius: "50%",
});

const Achievement = ({ stats, loading }) => {
  const navigate = useNavigate();
  
  // Tổng doanh số = tổng số lượng hàng bán được hoặc tổng giá trị đơn hàng
  const totalSales = stats?.totalSalesQuantity || stats?.totalSalesValue || 0;

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "k";
    }
    return num?.toLocaleString("vi-VN") || "0";
  };

  return (
    <Card
      sx={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        p: 2,
        pt: 0,
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        minWidth: 360,
        maxWidth: 400,
        bgcolor: "#242B2E",
        color: "#fff",
        height: "100%",
      }}
    >
      <CardContent sx={{ flex: "1 1 auto", p: "0 !important" }}>
        <Typography variant="h6" fontWeight={600}>
          Quân Hoàng
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          Xin chúc mừng 🎉
        </Typography>
        {loading ? (
          <CircularProgress size={24} sx={{ color: "#fff", mb: 1 }} />
        ) : (
          <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>
            {formatNumber(totalSales)}
          </Typography>
        )}
        <Button 
          variant="contained" 
          size="small"
          onClick={() => navigate("/admin/products")}
        >
          XEM SẢN PHẨM
        </Button>
      </CardContent>

      {/* Ảnh trophy bên phải */}
      <Box sx={{ position: "relative", minWidth: 100 }}>
        <TrophyImg src={avt} alt="trophy" />
      </Box>
    </Card>
  );
};

export default Achievement;
