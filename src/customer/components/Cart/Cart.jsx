import React, { useEffect, useState } from "react";
import { Box, Typography, Button, Divider, IconButton } from "@mui/material";
import { Add, Remove, Delete } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getCart, removeItemToCart, updateItemToCart } from "../../State/Cart/Action";
import CartItem from "./CartItem";
import { formatPrice } from "../../../utils/formatPrice";

const Cart = () => {

  const navigate = useNavigate();
  const { cart } = useSelector((state) => state);
  console.log(cart,"cart")
  const dispatch = useDispatch();
  const handleCheckout = () => {
    navigate('/checkout?step=2');
  }

  useEffect(()=>{
    dispatch(getCart());
  },[cart.updateItemToCart,cart.deleteCartItem])

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        gap: 3,
        p: 3,
        bgcolor: "#f3f4f6",
        minHeight: "100vh",
      }}
    >
      {/* Danh sách sản phẩm */}
      <Box sx={{ flex: 2 }}>
        {cart.cartItems?.map((item) => (
          <CartItem item={item}/>
        ))}
      </Box>

      {/* PRICE DETAILS */}
      <Box
        sx={{
          flex: 1,
          p: 3,
          borderRadius: 3,
          background: "#fff",
          boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
          height: "fit-content",
        }}
      >
        <Typography
          variant="h6"
          sx={{ mb: 2, borderBottom: "2px solid #eee", pb: 1 }}
        >
          Chi tiết giá sản phẩm
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Typography>Giá ({cart.cart?.totalItem} sản phẩm)</Typography>
          <Typography>{formatPrice(cart.cart?.totalPrice)}</Typography>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Typography>Giảm giá</Typography>
          <Typography sx={{ color: "green" }}>
            -{formatPrice(cart.cart?.discount || 0)}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Typography>Phí giao hàng</Typography>
          <Typography sx={{ color: "green" }}>Miễn phí</Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography variant="h6">Tổng số tiền</Typography>
          <Typography variant="h6" sx={{ color: "green" }}>
            {formatPrice(cart.cart?.totalDiscountedPrice || 0)}
          </Typography>
        </Box>

        <Button
          onClick={handleCheckout}
          fullWidth
          sx={{
            background: "linear-gradient(90deg, #9333ea, #6d28d9)",
            color: "#fff",
            py: 1.2,
            fontWeight: 600,
            borderRadius: 2,
            "&:hover": {
              background: "linear-gradient(90deg, #7e22ce, #5b21b6)",
            },
          }}
        >
          Thanh toán
        </Button>
      </Box>
    </Box>
  );
};

export default Cart;
