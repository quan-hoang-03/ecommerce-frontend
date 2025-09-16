import React from "react";
import { Box, Typography, IconButton, Button } from "@mui/material";
import { Add, Remove } from "@mui/icons-material";

const CartItem = ({ item, onIncrease, onDecrease, onRemove }) => {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        p: 2,
        mb: 2,
        borderRadius: 2,
        border: "1px solid #e5e7eb",
        boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
        background: "#fff",
      }}
    >
      {/* Ảnh sản phẩm */}
      <Box
        component="img"
        src={item.image}
        alt={item.name}
        sx={{ width: 120, height: 150, objectFit: "cover", borderRadius: 2 }}
      />

      {/* Thông tin sản phẩm */}
      <Box sx={{ flex: 1 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          {item.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Size: {item.size}, {item.color}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Seller: {item.seller}
        </Typography>

        {/* Giá */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography
            variant="body2"
            sx={{ textDecoration: "line-through", color: "gray" }}
          >
            ₹{item.oldPrice}
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            ₹{item.price}
          </Typography>
          <Typography variant="body2" sx={{ color: "green", fontWeight: 500 }}>
            {item.discount}% off
          </Typography>
        </Box>

        {/* Số lượng + Remove */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 2 }}>
          <IconButton size="small" onClick={() => onDecrease(item.id)}>
            <Remove />
          </IconButton>
          <Typography>{item.quantity}</Typography>
          <IconButton size="small" onClick={() => onIncrease(item.id)}>
            <Add />
          </IconButton>

          <Button color="error" onClick={() => onRemove(item.id)}>
            Xóa
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default CartItem;
