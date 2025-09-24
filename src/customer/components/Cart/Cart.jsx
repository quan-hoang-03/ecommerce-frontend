import React, { useState } from "react";
import { Box, Typography, Button, Divider, IconButton } from "@mui/material";
import { Add, Remove, Delete } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const [cart, setCart] = useState([
    {
      id: 1,
      name: "Men Slim Mid Rise Black Jeans",
      size: "L",
      color: "White",
      seller: "Cristahliyo 2fashion",
      oldPrice: 1799,
      price: 494,
      discount: 72,
      quantity: 1,
      image:
        "https://rukminim2.flixcart.com/image/612/612/xif0q/jean/m/f/y/30-jun2029-1-celios-original-imah3gs8bjh7vsga.jpeg",
    },
    {
      id: 2,
      name: "Women Fit and Flare Dark Green Dress",
      size: "M",
      color: "White",
      seller: "SUBH LAXMI",
      oldPrice: 1599,
      price: 399,
      discount: 75,
      quantity: 1,
      image:
        "https://rukminim2.flixcart.com/image/612/612/kqgyhe80/dress/j/g/b/m-printed-anarkali-dress-crishtaliyo-2fashion-original-imag4hp3yzzd6h4h.jpeg",
    },
  ]);

  const handleIncrease = (id) =>
    setCart((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity: i.quantity + 1 } : i))
    );

  const handleDecrease = (id) =>
    setCart((prev) =>
      prev.map((i) =>
        i.id === id && i.quantity > 1 ? { ...i, quantity: i.quantity - 1 } : i
      )
    );

  const handleRemove = (id) =>
    setCart((prev) => prev.filter((i) => i.id !== id));

  const totalPrice = cart.reduce((sum, i) => sum + i.oldPrice * i.quantity, 0);
  const totalDiscount = cart.reduce(
    (sum, i) => sum + (i.oldPrice - i.price) * i.quantity,
    0
  );
  const finalAmount = totalPrice - totalDiscount;
  const navigate = useNavigate();
  const handleCheckout = () => {
    navigate('/checkout?step=2');
  }

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
        {cart.map((item) => (
          <Box
            key={item.id}
            sx={{
              display: "flex",
              gap: 3,
              p: 2,
              mb: 3,
              borderRadius: 3,
              background: "#fff",
              boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
              transition: "transform 0.2s",
              "&:hover": { transform: "translateY(-3px)" },
            }}
          >
            {/* Ảnh sản phẩm */}
            <Box
              component="img"
              src={item.image}
              alt={item.name}
              sx={{
                width: 120,
                height: 150,
                objectFit: "cover",
                borderRadius: 2,
              }}
            />

            {/* Thông tin */}
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
                <Typography
                  variant="body2"
                  sx={{ color: "green", fontWeight: 500 }}
                >
                  {item.discount}% off
                </Typography>
              </Box>

              {/* Số lượng + Remove */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  mt: 2,
                }}
              >
                <IconButton
                  size="small"
                  sx={{ border: "1px solid #ccc" }}
                  onClick={() => handleDecrease(item.id)}
                >
                  <Remove />
                </IconButton>
                <Typography sx={{ fontWeight: 600 }}>
                  {item.quantity}
                </Typography>
                <IconButton
                  size="small"
                  sx={{ border: "1px solid #ccc" }}
                  onClick={() => handleIncrease(item.id)}
                >
                  <Add />
                </IconButton>

                <Button
                  color="error"
                  startIcon={<Delete />}
                  onClick={() => handleRemove(item.id)}
                >
                  Xóa
                </Button>
              </Box>
            </Box>
          </Box>
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
          PRICE DETAILS
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Typography>Price ({cart.length} item)</Typography>
          <Typography>₹{totalPrice}</Typography>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Typography>Discount</Typography>
          <Typography sx={{ color: "green" }}>-₹{totalDiscount}</Typography>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Typography>Delivery Charges</Typography>
          <Typography sx={{ color: "green" }}>Free</Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography variant="h6">Total Amount</Typography>
          <Typography variant="h6" sx={{ color: "green" }}>
            ₹{finalAmount}
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
