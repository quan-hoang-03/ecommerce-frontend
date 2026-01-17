import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../../config/apiConfig";
import { useNotification } from "../../hooks/useNotification";
import NotificationContainer from "../Notification/NotificationContainer";
import ConfirmModal from "../Modal/ConfirmModal";

const AddressCard = ({ onSelectAddress = () => {}, refetchTrigger = 0, address = null }) => {
  const [savedAddresses, setSavedAddresses] = useState([]);
  const { notifications, showSuccess, showError, removeNotification } = useNotification();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState(null);

  const fetchAddresses = async () => {
    try {
      const token = localStorage.getItem("jwt");
      if (!token) {
        console.warn("No JWT token found");
        return;
      }
      const response = await axios.get(`${API_BASE_URL}/api/address`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Fetched addresses:", response.data);
      setSavedAddresses(response.data || []);
    } catch (error) {
      console.error("Lỗi khi load danh sách địa chỉ:", error);
      setSavedAddresses([]);
    }
  };

  // Fetch addresses on mount and when refetchTrigger changes
  useEffect(() => {
    fetchAddresses();
  }, [refetchTrigger]);

  const handleDeleteAddress = (addressId) => {
    setAddressToDelete(addressId);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteAddress = async () => {
    if (!addressToDelete) return;

    try {
      const token = localStorage.getItem("jwt");
      await axios.post(
        `${API_BASE_URL}/api/address/${addressToDelete}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json; charset=UTF-8",
          },
        }
      );

      // Cập nhật lại danh sách sau khi xóa
      setSavedAddresses((prev) => prev.filter((addr) => addr.id !== addressToDelete));
      showSuccess("Đã xóa địa chỉ thành công!");
      setAddressToDelete(null);
    } catch (error) {
      console.error("Lỗi khi xóa địa chỉ:", error);
      showError("Không thể xóa địa chỉ. Vui lòng thử lại!");
      setAddressToDelete(null);
    }
  };

  // Nếu có address được truyền vào (từ order), hiển thị nó
  if (address) {
    return (
      <>
        <div className="space-y-4">
          {/* <h2 className="text-lg font-semibold mb-3">Địa chỉ giao hàng</h2> */}
          <div className="border rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold">
              {address.firstName} {address.lastName}
            </h3>
            <p className="text-gray-600 text-sm mt-1">
              {address.streetAddress}, {address.city}, {address.state} {address.zip}
            </p>
            <p className="text-gray-800 text-sm mt-1">
              <span className="font-medium">SĐT:</span> {address.mobile}
            </p>
          </div>
        </div>
        <NotificationContainer 
          notifications={notifications} 
          onRemove={removeNotification} 
        />
        <ConfirmModal
          isOpen={showDeleteConfirm}
          onClose={() => {
            setShowDeleteConfirm(false);
            setAddressToDelete(null);
          }}
          onConfirm={confirmDeleteAddress}
          title="Xóa địa chỉ"
          message="Bạn có chắc muốn xóa địa chỉ này không?"
          confirmText="Xóa"
          cancelText="Hủy"
          type="danger"
        />
      </>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold mb-3">Địa chỉ đã lưu</h2>

      {savedAddresses.length === 0 ? (
        <p className="text-gray-500 text-sm">Chưa có địa chỉ nào được lưu.</p>
      ) : (
        savedAddresses.map((addr, idx) => (
          <div
            key={addr.id || idx}
            className="flex justify-between items-start border rounded-lg p-4 shadow-sm hover:shadow-md transition"
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

            <div className="ml-4 flex gap-2">
              <button
                className="px-4 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                onClick={() => {
                  console.log("Selected address:", addr);
                  onSelectAddress(addr);
                }}
              >
                Giao hàng tại đây
              </button>
              <button
                className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                onClick={() => handleDeleteAddress(addr.id)}
              >
                Xóa
              </button>
            </div>
          </div>
        ))
      )}

      <NotificationContainer 
        notifications={notifications} 
        onRemove={removeNotification} 
      />

      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setAddressToDelete(null);
        }}
        onConfirm={confirmDeleteAddress}
        title="Xóa địa chỉ"
        message="Bạn có chắc muốn xóa địa chỉ này không?"
        confirmText="Xóa"
        cancelText="Hủy"
        type="danger"
      />
    </div>
  );
};

export default AddressCard;
