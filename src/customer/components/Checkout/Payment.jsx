import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getOrderById } from "../../State/Order/Action";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Button, CircularProgress, Divider, Typography } from "@mui/material";
import axios from "axios";
import { API_BASE_URL } from "../../../config/apiConfig";
import AddressCard from "../AddressCard/AddressCard";
import { useNotification } from "../../hooks/useNotification";
import NotificationContainer from "../Notification/NotificationContainer";

const Payment = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const orderId = searchParams.get("order_id");
  const { order } = useSelector((state) => state);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("paypal"); // paypal hoặc cod
  const { notifications, showError, removeNotification } = useNotification();

  useEffect(() => {
    if (orderId) {
      dispatch(getOrderById(orderId));
    }
  }, [orderId, dispatch]);

  // Xử lý thanh toán PayPal
  const handlePayPalPayment = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("jwt");
      const response = await axios.post(
        `${API_BASE_URL}/api/paypal/payments/${orderId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Redirect tới PayPal
      if (response.data.payment_link_url) {
        window.location.href = response.data.payment_link_url;
      }
    } catch (error) {
      console.error("Lỗi khi tạo thanh toán PayPal:", error);
      showError("Không thể tạo thanh toán. Vui lòng thử lại!");
      setLoading(false);
    }
  };

  // Xử lý thanh toán COD (Thanh toán khi nhận hàng)
  const handleCODPayment = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("jwt");
      await axios.put(
        `${API_BASE_URL}/api/orders/${orderId}/cod`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Chuyển đến trang thành công
      navigate(`/payment/success/${orderId}?method=cod`);
    } catch (error) {
      console.error("Lỗi khi xác nhận COD:", error);
      showError("Không thể xác nhận đơn hàng. Vui lòng thử lại!");
      setLoading(false);
    }
  };

  const handlePayment = () => {
    if (paymentMethod === "paypal") {
      handlePayPalPayment();
    } else {
      handleCODPayment();
    }
  };

  return (
    <div className="p-5 shadow-lg rounded-lg border">
      <h2 className="text-2xl font-bold mb-6 text-center text-purple-700">
        Thanh toán đơn hàng #{orderId}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Thông tin đơn hàng */}
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-3">Địa chỉ giao hàng</h3>
            <AddressCard address={order?.order?.shippingAddress} />
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-3">Sản phẩm</h3>
            {order.order?.orderItems?.map((item) => (
              <div key={item.id} className="flex items-center gap-3 py-2 border-b">
                <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center overflow-hidden">
                  {item.product?.imageUrl ? (
                    <img
                      src={item.product.imageUrl}
                      alt={item.product?.title || "Sản phẩm"}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <span 
                    className="text-gray-400 text-xs text-center"
                    style={{ display: item.product?.imageUrl ? 'none' : 'flex' }}
                  >
                    No Image
                  </span>
                </div>
                <div className="flex-1">
                  <p className="font-medium">{item.product?.title || "Sản phẩm"}</p>
                  <p className="text-sm text-gray-500">
                    Size: {item.size} | SL: {item.quantity}
                  </p>
                </div>
                <p className="font-semibold">{(item.discountedPrice || item.price || 0).toLocaleString()} Đ</p>
              </div>
            ))}
          </div>
        </div>

        {/* Phương thức thanh toán */}
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg border">
            <h3 className="font-semibold text-lg mb-4">Chọn phương thức thanh toán</h3>

            {/* PayPal */}
            <label
              className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer mb-3 transition ${
                paymentMethod === "paypal"
                  ? "border-purple-500 bg-purple-50"
                  : "hover:bg-gray-50"
              }`}
            >
              <input
                type="radio"
                name="payment"
                value="paypal"
                checked={paymentMethod === "paypal"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-5 h-5 text-purple-600"
              />
              <img
                src="https://www.paypalobjects.com/webstatic/mktg/Logo/pp-logo-100px.png"
                alt="PayPal"
                className="h-6"
              />
              <span className="font-medium">Thanh toán qua PayPal</span>
            </label>

            {/* COD */}
            <label
              className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition ${
                paymentMethod === "cod"
                  ? "border-purple-500 bg-purple-50"
                  : "hover:bg-gray-50"
              }`}
            >
              <input
                type="radio"
                name="payment"
                value="cod"
                checked={paymentMethod === "cod"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-5 h-5 text-purple-600"
              />
              <span className="text-2xl">💵</span>
              <span className="font-medium">Thanh toán khi nhận hàng (COD)</span>
            </label>
          </div>

          {/* Chi tiết giá */}
          <Box
            sx={{
              p: 3,
              borderRadius: 2,
              background: "#fff",
              border: "1px solid #e5e7eb",
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Chi tiết thanh toán
            </Typography>

            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
              <Typography>Tạm tính</Typography>
              <Typography>{order.order?.totalPrice?.toLocaleString()} Đ</Typography>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
              <Typography>Giảm giá</Typography>
              <Typography sx={{ color: "green" }}>
                -{order.order?.discount?.toLocaleString() || 0} Đ
              </Typography>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
              <Typography>Phí vận chuyển</Typography>
              <Typography sx={{ color: "green" }}>Miễn phí</Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
              <Typography variant="h6" fontWeight={600}>
                Tổng cộng
              </Typography>
              <Typography variant="h6" fontWeight={600} sx={{ color: "#9333ea" }}>
                {order.order?.totalDiscountedPrice?.toLocaleString() || order.order?.totalPrice?.toLocaleString()} Đ
              </Typography>
            </Box>

            <Button
              onClick={handlePayment}
              fullWidth
              disabled={loading || !orderId}
              sx={{
                background: paymentMethod === "paypal" 
                  ? "linear-gradient(90deg, #003087, #009cde)"
                  : "linear-gradient(90deg, #9333ea, #6d28d9)",
                color: "#fff",
                py: 1.5,
                fontWeight: 600,
                borderRadius: 2,
                fontSize: "1rem",
                "&:hover": {
                  background: paymentMethod === "paypal"
                    ? "linear-gradient(90deg, #002060, #0077b5)"
                    : "linear-gradient(90deg, #7e22ce, #5b21b6)",
                },
                "&:disabled": {
                  background: "#ccc",
                  color: "#666",
                },
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : paymentMethod === "paypal" ? (
                "Thanh toán với PayPal"
              ) : (
                "Xác nhận đặt hàng"
              )}
            </Button>
          </Box>

          <button
            onClick={() => navigate({ search: `step=3&order_id=${orderId}` })}
            className="w-full text-center text-gray-500 hover:text-gray-700 py-2"
          >
            ← Quay lại xem đơn hàng
          </button>
        </div>
      </div>

      <NotificationContainer 
        notifications={notifications} 
        onRemove={removeNotification} 
      />
    </div>
  );
};

export default Payment;
