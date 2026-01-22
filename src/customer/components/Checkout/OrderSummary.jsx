import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getOrderById } from "../../State/Order/Action";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Button, Divider, Typography } from "@mui/material";
import CartItem from "../Cart/CartItem";
import AddressCard from "../AddressCard/AddressCard";
import axios from "axios";
import { API_BASE_URL } from "../../../config/apiConfig";
import { useNotification } from "../../hooks/useNotification";
import NotificationContainer from "../Notification/NotificationContainer";
import { formatPrice } from "../../../utils/formatPrice";

const OrderSummary = ({ address }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const orderId = searchParams.get("order_id");
  const {order} = useSelector((state) => state);
  const [isChangingAddress, setIsChangingAddress] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const { notifications, showError, removeNotification } = useNotification();
  console.log(order,"order");

  useEffect(() => {
    if (orderId) {
      dispatch(getOrderById(orderId));
    }
  }, [orderId, dispatch]);

  // Load danh sách địa chỉ đã lưu
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const token = localStorage.getItem("jwt");
        if (!token) return;
        const response = await axios.get(`${API_BASE_URL}/api/address`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSavedAddresses(response.data || []);
      } catch (error) {
        console.error("Lỗi khi load địa chỉ:", error);
      }
    };
    fetchAddresses();
  }, []);

  // Hàm cập nhật địa chỉ giao hàng cho order
  const handleChangeAddress = async (newAddress) => {
    try {
      const token = localStorage.getItem("jwt");
      await axios.put(
        `${API_BASE_URL}/api/orders/${orderId}/address`,
        { addressId: newAddress.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Reload order để cập nhật địa chỉ mới
      dispatch(getOrderById(orderId));
      setIsChangingAddress(false);
    } catch (error) {
      console.error("Lỗi khi đổi địa chỉ:", error);
      showError("Không thể đổi địa chỉ. Vui lòng thử lại!");
    }
  };

  console.log("Địa chỉ nhận hàng trong OrderSummary:", orderId);

  const handleCheckout = () => {
    // Chuyển sang bước thanh toán (step 4)
    if (orderId && order.order) {
      navigate({ search: `step=4&order_id=${orderId}` });
    } else {
      showError("Không tìm thấy đơn hàng. Vui lòng thử lại.");
    }
  };

  return (
    <div className="p-5 shadow-lg rounded-lg border">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold">Địa chỉ giao hàng</h2>
        {!isChangingAddress && (
          <button
            onClick={() => setIsChangingAddress(true)}
            className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
          >
            Đổi địa chỉ
          </button>
        )}
      </div>

      {isChangingAddress ? (
        <div className="space-y-4 mb-4">
          <div className="flex justify-between items-center">
            <h3 className="font-medium text-gray-700">Chọn địa chỉ khác:</h3>
            <button
              onClick={() => setIsChangingAddress(false)}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              ✕ Hủy
            </button>
          </div>
          {savedAddresses.length === 0 ? (
            <p className="text-gray-500 text-sm">Chưa có địa chỉ nào được lưu.</p>
          ) : (
            savedAddresses.map((addr) => (
              <div
                key={addr.id}
                className={`flex justify-between items-start border rounded-lg p-4 shadow-sm hover:shadow-md transition cursor-pointer ${
                  order?.order?.shippingAddress?.id === addr.id
                    ? "border-purple-500 bg-purple-50"
                    : ""
                }`}
              >
                <div className="flex-1">
                  <h3 className="font-semibold">
                    {addr.firstName} {addr.lastName}
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">
                    {addr.streetAddress}, {addr.city}, {addr.state}
                  </p>
                  <p className="text-gray-800 text-sm mt-1">
                    <span className="font-medium">SĐT:</span> {addr.mobile}
                  </p>
                </div>
                <button
                  className={`ml-4 px-4 py-2 text-sm rounded-lg transition ${
                    order?.order?.shippingAddress?.id === addr.id
                      ? "bg-green-500 text-white"
                      : "bg-purple-600 text-white hover:bg-purple-700"
                  }`}
                  onClick={() => handleChangeAddress(addr)}
                  disabled={order?.order?.shippingAddress?.id === addr.id}
                >
                  {order?.order?.shippingAddress?.id === addr.id
                    ? "Đang chọn"
                    : "Chọn địa chỉ này"}
                </button>
              </div>
            ))
          )}
        </div>
      ) : (
        <AddressCard address={order?.order?.shippingAddress} />
      )}
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
          {order.order?.orderItems?.map((item) => (
            <CartItem key={item.id || item.product?.id} item={item} />
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
            <Typography>Giá ({order.order?.totalItem || order.orders?.totalItem || 0} sản phẩm)</Typography>
            <Typography>{formatPrice(order.order?.totalPrice || order.orders?.totalPrice || 0)}</Typography>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography>Giảm giá</Typography>
            <Typography sx={{ color: "green" }}>
              -{formatPrice(order.order?.discount || order.orders?.discount || 0)}
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
              {formatPrice(order.order?.totalDiscountedPrice || order.orders?.totalDiscountedPrice || 0)}
            </Typography>
          </Box>

          <Button
            onClick={handleCheckout}
            fullWidth
            disabled={!orderId || !order.order}
            sx={{
              background: "linear-gradient(90deg, #9333ea, #6d28d9)",
              color: "#fff",
              py: 1.2,
              fontWeight: 600,
              borderRadius: 2,
              "&:hover": {
                background: "linear-gradient(90deg, #7e22ce, #5b21b6)",
              },
              "&:disabled": {
                background: "#ccc",
                color: "#666",
              },
            }}
          >
            Hoàn tất thanh toán
          </Button>
        </Box>
      </Box>

      <NotificationContainer 
        notifications={notifications} 
        onRemove={removeNotification} 
      />
    </div>
  );
};


export default OrderSummary;
