import React from "react";
import { Box, Typography, IconButton, Button } from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { getCart, removeItemToCart, updateItemToCart } from "../../State/Cart/Action";
import { API_BASE_URL } from "../../../config/apiConfig";

const CartItem = ({item}) => {
  const dispatch = useDispatch();

 const handleUpdateCartItem = async (num) => {
   const reqData = {
     data: { quantity: item.quantity + num },
     cartItemid: item?.id,
   };

   await dispatch(updateItemToCart(reqData));

   dispatch(getCart());
 };

  const handleRemoveItem = () => {
    dispatch(removeItemToCart(item.id));
  }
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
        src={
          item?.product?.imageUrl?.startsWith('http') 
            ? item?.product?.imageUrl 
            : `${API_BASE_URL}${item?.product?.imageUrl}`
        }
        alt={item?.product?.title}
        sx={{ width: 120, height: 150, objectFit: "cover", borderRadius: 2 }}
        onError={(e) => {
          e.target.src = 'https://via.placeholder.com/120x150?text=No+Image';
        }}
      />

      {/* Thông tin sản phẩm */}
      <Box sx={{ flex: 1 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          {item?.product?.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Size: {item?.size}, {item?.product?.colors}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Seller: {item?.product?.brand}
        </Typography>

        {/* Giá */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography
            variant="body2"
            sx={{ textDecoration: "line-through", color: "gray" }}
          >
            {item?.price} Đ
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {item?.discountedPrice} Đ
          </Typography>
          <Typography variant="body2" sx={{ color: "green", fontWeight: 500 }}>
            {item?.discountedPresent}% Off
          </Typography>
        </Box>

        {/* Số lượng + Remove */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 2 }}>
          <IconButton
            size="small"
            onClick={() => handleUpdateCartItem(-1)}
            disabled={item?.length <= 1}
          >
            <Remove />
          </IconButton>
          <Typography>{item?.quantity}</Typography>
          <IconButton size="small" onClick={() => handleUpdateCartItem(1)}>
            <Add />
          </IconButton>

          <Button color="error" onClick={handleRemoveItem}>
            Xóa
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default CartItem;
