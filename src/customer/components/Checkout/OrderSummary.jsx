import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getOrderById } from "../../State/Order/Action";
import { useLocation } from "react-router-dom";
import { Box, Button, Divider, Typography } from "@mui/material";
import CartItem from "../Cart/CartItem";
import AddressCard from "../AddressCard/AddressCard";
const OrderSummary = ({ address }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const orderId = searchParams.get("order_id");
  const {order} = useSelector((state) => state);
  console.log(order,"order");

  useEffect(() => {
    dispatch(getOrderById(orderId));
  }, [orderId]);
  console.log("Địa chỉ nhận hàng trong OrderSummary:", orderId);

  return (
    <div className="p-5 shadow-lg rounded-lg border">
      <h2 className="text-lg font-semibold mb-3">Địa chỉ giao hàng</h2>

      {/* {address ? (
        <div className="space-y-2">
          <p>
            <span className="font-medium">Họ tên:</span> {address.firstName}{" "}
            {address.lastName}
          </p>
          <p>
            <span className="font-medium">Địa chỉ:</span> {address.address},{" "}
            {address.city} {address.state} {address.zip}
          </p>
          <p>
            <span className="font-medium">Số điện thoại:</span> {address.phone}
          </p>
        </div>
      ) : (
        <p>Chưa có địa chỉ nào được chọn</p>
      )} */}
      <AddressCard address={order?.order.shippingAddress}/>
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
          {order.orders?.orderItems?.map((item) => (
            <CartItem item={item} />
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
            <Typography>Giá ({order.orders?.totalItem} sản phẩm)</Typography>
            <Typography>{order.orders?.totalPrice} Đ</Typography>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography>Discount</Typography>
            <Typography sx={{ color: "green" }}>
              -{order.orders?.discountedPrice || 0}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography>Delivery Charges</Typography>
            <Typography sx={{ color: "green" }}>Free</Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="h6">Total Amount</Typography>
            <Typography variant="h6" sx={{ color: "green" }}>
              {order.orders?.totalDiscountedPrice || 0} Đ
            </Typography>
          </Box>

          {/* <Button
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
          </Button> */}
        </Box>
      </Box>
    </div>
  );
};


export default OrderSummary;
