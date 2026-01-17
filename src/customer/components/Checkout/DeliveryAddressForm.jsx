import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AddressCard from "../AddressCard/AddressCard";
import { useDispatch } from "react-redux";
import { createOrder } from "../../State/Order/Action";

const DeliveryAddressForm = ({ onAddressSelected }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  // State quản lý dữ liệu form
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    streetAddress: "",
    city: "",
    state: "",
    zip: "",
    mobile: "",
  });

  // Cập nhật dữ liệu khi người dùng gõ vào input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Hàm tạo order với address
  const handleCreateOrder = (address) => {
    const orderData = { address, navigate };
    dispatch(createOrder(orderData));
    setRefetchTrigger((prev) => prev + 1);
  };

  // Submit form địa chỉ mới
  const handleSubmit = (e) => {
    e.preventDefault();

    const address = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      streetAddress: formData.streetAddress,
      city: formData.city,
      state: formData.state,
      zip: formData.zip,
      mobile: formData.mobile,
    };

    handleCreateOrder(address);

    // Xóa dữ liệu form sau khi lưu
    setFormData({
      firstName: "",
      lastName: "",
      streetAddress: "",
      city: "",
      state: "",
      zip: "",
      mobile: "",
    });
  };

  // Xử lý khi chọn address từ danh sách đã lưu
  const handleSelectSavedAddress = (addr) => {
    console.log("Selected saved address:", addr);
    handleCreateOrder(addr);
  };

  return (
    <>
      {/* Saved Addresses */}
      <div className="space-y-4 mb-6">
        <AddressCard
          refetchTrigger={refetchTrigger}
          onSelectAddress={handleSelectSavedAddress}
        />
      </div>

      {/* New Address Form */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Thêm địa chỉ mới</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="firstName"
              placeholder="Họ *"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
            />
            <input
              type="text"
              name="lastName"
              placeholder="Tên *"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>

          <textarea
            name="streetAddress"
            placeholder="Địa điểm *"
            rows="3"
            value={formData.streetAddress}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
          />

          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="city"
              placeholder="Thành phố *"
              value={formData.city}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
            />
            <input
              type="text"
              name="state"
              placeholder="Tỉnh / Khu vực *"
              value={formData.state}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="zip"
              placeholder="Mã Code *"
              value={formData.zip}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
            />
            <input
              type="tel"
              name="mobile"
              placeholder="Số điện thoại *"
              value={formData.mobile}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition"
          >
            Lưu và sử dụng địa chỉ này
          </button>
        </form>
      </div>
    </>
  );
};

export default DeliveryAddressForm;
