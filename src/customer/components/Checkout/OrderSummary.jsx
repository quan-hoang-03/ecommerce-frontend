import React from "react";
const OrderSummary = ({ address }) => {
  console.log("Địa chỉ nhận hàng trong OrderSummary:", address);

  return (
    <div className="p-5 shadow-lg rounded-lg border">
      <h2 className="text-lg font-semibold mb-3">Địa chỉ giao hàng</h2>

      {address ? (
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
      )}
    </div>
  );
};


export default OrderSummary;
