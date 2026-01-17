import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { API_BASE_URL } from "../../../config/apiConfig";
import { CheckCircle } from "lucide-react";
import { getCart } from "../../State/Cart/Action";

const PaymentSuccess = () => {
  const { orderId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const capturePayment = async () => {
      const searchParams = new URLSearchParams(location.search);
      const paypalOrderId = searchParams.get("token"); // PayPal trả về token
      const method = searchParams.get("method");

      // Nếu là COD, không cần capture
      if (method === "cod") {
        setMessage("Đơn hàng của bạn đã được xác nhận!");
        // Xóa giỏ hàng sau khi thanh toán thành công
        await clearCartAfterPayment();
        setLoading(false);
        return;
      }

      // Nếu là PayPal, capture payment
      if (paypalOrderId) {
        try {
          const token = localStorage.getItem("jwt");
          await axios.get(
            `${API_BASE_URL}/api/paypal/capture/${paypalOrderId}/${orderId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setMessage("Thanh toán PayPal thành công!");
          // Xóa giỏ hàng sau khi thanh toán thành công
          await clearCartAfterPayment();
        } catch (error) {
          console.error("Lỗi capture payment:", error);
          setMessage("Có lỗi xảy ra khi xác nhận thanh toán. Vui lòng liên hệ hỗ trợ.");
        }
      } else {
        setMessage("Đơn hàng của bạn đã được đặt thành công!");
        // Xóa giỏ hàng sau khi thanh toán thành công
        await clearCartAfterPayment();
      }
      setLoading(false);
    };

    const clearCartAfterPayment = async () => {
      try {
        const token = localStorage.getItem("jwt");
        await axios.post(
          `${API_BASE_URL}/api/cart_items/clear`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        // Refresh cart để cập nhật UI
        dispatch(getCart());
      } catch (error) {
        console.error("Lỗi khi xóa giỏ hàng:", error);
        // Không hiển thị lỗi cho user vì đơn hàng đã thành công
      }
    };

    capturePayment();
  }, [orderId, location.search, dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang xác nhận thanh toán...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="bg-white p-10 rounded-2xl shadow-xl text-center max-w-md mx-4">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-green-500" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Đặt hàng thành công!
        </h1>
        
        <p className="text-gray-600 mb-2">{message}</p>
        
        <p className="text-lg font-semibold text-purple-600 mb-6">
          Mã đơn hàng: #{orderId}
        </p>

        <div className="bg-gray-50 p-4 rounded-lg mb-6 text-left">
          <p className="text-sm text-gray-600">
            📧 Chúng tôi sẽ gửi email xác nhận đơn hàng cho bạn.
          </p>
          <p className="text-sm text-gray-600 mt-2">
            🚚 Đơn hàng sẽ được giao trong 3-5 ngày làm việc.
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => navigate("/account/order")}
            className="w-full py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition"
          >
            Xem đơn hàng của tôi
          </button>
          
          <button
            onClick={() => navigate("/")}
            className="w-full py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition"
          >
            Tiếp tục mua sắm
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
