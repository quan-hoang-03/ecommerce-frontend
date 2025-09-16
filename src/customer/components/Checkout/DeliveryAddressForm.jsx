import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AddressCard from "../AddressCard/AddressCard";

const DeliveryAddressForm = ({ onAddressSelected }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Khi submit form địa chỉ mới
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Địa chỉ mới:", formData);
    onAddressSelected(formData); // báo ngược về Checkout
  };

  return (
    <>
      {/* Saved Addresses */}
      <div className="space-y-4">
        <AddressCard onSelectAddress={onAddressSelected} />
      </div>

      {/* New Address Form */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Add New Address</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="firstName"
              placeholder="First Name *"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name *"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>

          <textarea
            name="address"
            placeholder="Address *"
            rows="3"
            value={formData.address}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
          />

          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="city"
              placeholder="City *"
              value={formData.city}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
            />
            <input
              type="text"
              name="state"
              placeholder="State/Province/Region *"
              value={formData.state}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="zip"
              placeholder="Zip / Postal Code *"
              value={formData.zip}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone Number *"
              value={formData.phone}
              onChange={handleChange}
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
