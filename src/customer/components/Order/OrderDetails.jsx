import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getOrderById } from "../../State/Order/Action";
import AddressCard from "../AddressCard/AddressCard";
import OrderTraker from "./OrderTraker";
import { Box, Grid } from "@mui/material";
import { deepPurple } from "@mui/material/colors";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { API_BASE_URL } from "../../../config/apiConfig";

const OrderDetails = () => {
  const { orderId } = useParams();
  const dispatch = useDispatch();
  const { order } = useSelector((state) => state);

  useEffect(() => {
    if (orderId) {
      dispatch(getOrderById(orderId));
    }
  }, [orderId, dispatch]);

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
      return imageUrl;
    }
    return `${API_BASE_URL}${imageUrl.startsWith("/") ? "" : "/"}${imageUrl}`;
  };

  const formatPrice = (price) => {
    if (!price) return "0 ₫";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const getOrderStatusStep = (status) => {
    const statusMap = {
      PENDING: 0,
      PLACED: 1,
      CONFIRMED: 2,
      SHIPPED: 3,
      DELIVERED: 4,
      CANCELLED: -1,
    };
    return statusMap[status] || 0;
  };

  const orderData = order?.order;
  const orderItems = orderData?.orderItems || [];

  if (!orderData) {
    return (
      <div className="px-5 lg:px-20 py-10">
        <div className="text-center">
          <p className="text-gray-500">Đang tải thông tin đơn hàng...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-5 lg:px-20">
      {/* Header */}
      <div>
        <h1 className="font-bold text-2xl py-7 text-gray-800">
          Chi tiết đơn hàng #{orderData.id}
        </h1>
        {orderData.shippingAddress && (
          <AddressCard address={orderData.shippingAddress} />
        )}
      </div>

      {/* Order tracker */}
      <div className="py-14">
        <OrderTraker activeStep={getOrderStatusStep(orderData.orderStatus)} />
      </div>

      {/* Product list */}
      {orderItems.length > 0 ? (
        <Grid container spacing={3} className="mb-4">
          {orderItems.map((orderItem, index) => {
            const product = orderItem.product;
            const imageUrl = getImageUrl(product?.imageUrl);

            return (
              <Grid item xs={12} key={orderItem.id || index} className="py-3">
                <div className="flex items-center justify-between p-5 rounded-2xl border shadow-md hover:shadow-lg transition-all bg-white">
                  {/* Product info */}
                  <div className="flex items-center space-x-5">
                    {imageUrl ? (
                      <img
                        className="w-20 h-20 object-cover rounded-lg border"
                        src={imageUrl}
                        alt={product?.title || "Sản phẩm"}
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/80?text=No+Image";
                        }}
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-lg border flex items-center justify-center bg-gray-100">
                        <span className="text-xs text-gray-400 text-center px-2">
                          Không có ảnh
                        </span>
                      </div>
                    )}
                    <div className="space-y-1">
                      <p className="font-semibold text-gray-800">
                        {product?.title || "Sản phẩm"}
                      </p>
                      <p className="text-sm text-gray-500">
                        Kích cỡ: {orderItem.size} | Số lượng: {orderItem.quantity}
                      </p>
                      <p className="text-green-600 font-bold">
                        {formatPrice(orderItem.price)}
                      </p>
                    </div>
                  </div>

                  {/* Review button */}
                  <Box
                    className="flex items-center cursor-pointer px-4 py-2 rounded-lg hover:bg-purple-50"
                    sx={{ color: deepPurple[600] }}
                  >
                    <StarBorderIcon sx={{ fontSize: "1.8rem" }} />
                    <span className="ml-2 font-medium">Đánh giá & nhận xét</span>
                  </Box>
                </div>
              </Grid>
            );
          })}
        </Grid>
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-500">Không có sản phẩm nào trong đơn hàng này.</p>
        </div>
      )}

      {/* Order summary */}
      {orderData.totalPrice && (
        <div className="mt-6 p-5 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-gray-800">Tổng tiền:</span>
            <span className="text-xl font-bold text-green-600">
              {formatPrice(orderData.totalPrice)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;
