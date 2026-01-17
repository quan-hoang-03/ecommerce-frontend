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
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import avt from "../../assets/img/avt.jpg";

const TrophyImg = styled("img")({
  height: 160,
  width: 160,
  position: "absolute",
  right: 24,
  top: "50%",
  transform: "translateY(-50%)",
  borderRadius: "50%",
  objectFit: "cover",
  border: "4px solid rgba(255,255,255,0.25)",
  boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
});

const Achievement = ({ stats, loading }) => {
  const navigate = useNavigate();
  const { auth } = useSelector((store) => store);
  const user = auth?.user;
  
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
        boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
        borderRadius: 3,
        background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
        color: "#fff",
        height: "100%",
        minHeight: 300,
        overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.1)",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          right: 0,
          width: "200px",
          height: "200px",
          background: "radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)",
          borderRadius: "50%",
          transform: "translate(30%, -30%)",
        },
      }}
    >
      <CardContent sx={{ flex: "1 1 auto", p: 4, position: "relative", zIndex: 1 }}>
        <Typography 
          variant="h4" 
          fontWeight={700} 
          sx={{ 
            mb: 1.5, 
            fontSize: "1.75rem",
            letterSpacing: "-0.5px",
          }}
        >
          {user?.firstName} {user?.lastName || ""}
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            mb: 3, 
            color: "rgba(255,255,255,0.85)",
            fontSize: "1rem",
          }}
        >
          Xin chúc mừng 🎉
        </Typography>
        {loading ? (
          <CircularProgress size={36} sx={{ color: "#fff", mb: 3 }} />
        ) : (
          <Typography 
            variant="h2" 
            fontWeight={700} 
            sx={{ 
              mb: 4, 
              fontSize: "3rem",
              lineHeight: 1.2,
              background: "linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.9) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {formatNumber(totalSales)}
          </Typography>
        )}
        <Button 
          variant="contained" 
          size="large"
          onClick={() => navigate("/admin/products")}
          sx={{
            bgcolor: "#3b82f6",
            color: "#fff",
            fontWeight: 600,
            textTransform: "uppercase",
            px: 4,
            py: 1.5,
            borderRadius: 2,
            boxShadow: "0 4px 12px rgba(59,130,246,0.4)",
            fontSize: "0.875rem",
            letterSpacing: "0.5px",
            "&:hover": {
              bgcolor: "#2563eb",
              boxShadow: "0 6px 16px rgba(59,130,246,0.5)",
              transform: "translateY(-2px)",
            },
            transition: "all 0.2s ease",
          }}
        >
          XEM SẢN PHẨM
        </Button>
      </CardContent>

      {/* Ảnh avatar bên phải */}
      <Box sx={{ position: "relative", minWidth: 120, zIndex: 1 }}>
        <TrophyImg src={avt} alt="avatar" />
      </Box>
    </Card>
  );
};

export default Achievement;
