import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../../config/apiConfig";

const AddressCard = ({ onSelectAddress = () => {} }, refetchTrigger) => {
  const [savedAddresses, setSavedAddresses] = useState([]);


  const fetchAddresses = async () => {
    try {
      const token = localStorage.getItem("jwt");
      const response = await axios.get(`${API_BASE_URL}/api/address`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSavedAddresses(response.data);
    } catch (error) {
      console.error("Lỗi khi load danh sách địa chỉ:", error);
    }
  };

   useEffect(() => {
     fetchAddresses();
   }, [refetchTrigger]);

  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm("Bạn có chắc muốn xóa địa chỉ này không?")) return;

    try {
      const token = localStorage.getItem("jwt");
      await axios.post(
        `${API_BASE_URL}/api/address/${addressId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json; charset=UTF-8",
          },
        }
      );

      // Cập nhật lại danh sách sau khi xóa
      setSavedAddresses((prev) => prev.filter((addr) => addr.id !== addressId));
      alert("Đã xóa địa chỉ thành công!");
    } catch (error) {
      console.error("Lỗi khi xóa địa chỉ:", error);
      alert("Không thể xóa địa chỉ. Vui lòng thử lại!");
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold mb-3">Địa chỉ đã lưu</h2>

      {savedAddresses.length === 0 ? (
        <p className="text-gray-500 text-sm">Chưa có địa chỉ nào được lưu.</p>
      ) : (
        savedAddresses.map((addr, idx) => (
          <div
            key={idx}
            className="flex justify-between items-start border rounded-lg p-4 shadow-sm hover:shadow-md transition cursor-pointer"
          >
            <div className="flex-1">
              <h3 className="font-semibold">
                {addr.firstName} {addr.lastName}
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                {addr.streetAddress}, {addr.city}, {addr.state} {addr.zip}
              </p>
              <p className="text-gray-800 text-sm mt-1">
                <span className="font-medium">SĐT:</span> {addr.mobile}
              </p>
            </div>

            <div className="ml-4 d-flex gap-2">
              <button
                className="px-4 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                onClick={() => onSelectAddress(addr)}
              >
                Giao hàng tại đây
              </button>
              <button
                className="px-4 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                onClick={() => handleDeleteAddress(addr.id)}
              >
                Xóa
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default AddressCard;
