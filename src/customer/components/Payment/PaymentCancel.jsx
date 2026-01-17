import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { XCircle } from "lucide-react";

const PaymentCancel = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-100">
      <div className="bg-white p-10 rounded-2xl shadow-xl text-center max-w-md mx-4">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle className="w-12 h-12 text-red-500" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Thanh toán bị hủy
        </h1>
        
        <p className="text-gray-600 mb-6">
          Bạn đã hủy thanh toán. Đơn hàng #{orderId} vẫn đang chờ thanh toán.
        </p>

        <div className="bg-yellow-50 p-4 rounded-lg mb-6 text-left border border-yellow-200">
          <p className="text-sm text-yellow-800">
            ⚠️ Đơn hàng của bạn sẽ được giữ trong 24 giờ. 
            Sau thời gian này, đơn hàng sẽ tự động bị hủy.
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => navigate(`/checkout?step=4&order_id=${orderId}`)}
            className="w-full py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition"
          >
            Thử thanh toán lại
          </button>
          
          <button
            onClick={() => navigate("/cart")}
            className="w-full py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition"
          >
            Quay lại giỏ hàng
          </button>
          
          <button
            onClick={() => navigate("/")}
            className="w-full py-3 text-gray-500 hover:text-gray-700 transition"
          >
            Về trang chủ
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancel;
