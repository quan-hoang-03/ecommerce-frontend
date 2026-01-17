import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../config/apiConfig";
import { useNotification } from "../../customer/hooks/useNotification";
import NotificationContainer from "../../customer/components/Notification/NotificationContainer";
import ConfirmModal from "../../customer/components/Modal/ConfirmModal";
import "bootstrap/dist/css/bootstrap.min.css";

const OrderCancellationRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [adminNote, setAdminNote] = useState("");
  const [actionType, setActionType] = useState(""); // "approve" or "reject"
  const { notifications, showSuccess, showError, showWarning, removeNotification } = useNotification();
  const [showApproveConfirm, setShowApproveConfirm] = useState(false);
  const [requestToApprove, setRequestToApprove] = useState(null);

  useEffect(() => {
    loadPendingRequests();
  }, []);

  const loadPendingRequests = async () => {
    try {
      const token = localStorage.getItem("jwt");
      const response = await axios.get(
        `${API_BASE_URL}/api/orders/admin/cancel-requests/pending`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRequests(response.data || []);
    } catch (error) {
      console.error("Lỗi khi load requests:", error);
      showError("Không thể tải danh sách yêu cầu hủy đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = (requestId) => {
    setRequestToApprove(requestId);
    setShowApproveConfirm(true);
  };

  const confirmApprove = async () => {
    if (!requestToApprove) return;

    try {
      const token = localStorage.getItem("jwt");
      await axios.put(
        `${API_BASE_URL}/api/orders/admin/cancel-requests/${requestToApprove}/approve`,
        { adminNote: adminNote || "Đã duyệt yêu cầu hủy đơn hàng" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showSuccess("Đã duyệt yêu cầu hủy đơn hàng thành công!");
      setSelectedRequest(null);
      setAdminNote("");
      setActionType("");
      setRequestToApprove(null);
      loadPendingRequests();
    } catch (error) {
      console.error("Lỗi khi duyệt:", error);
      showError(error.response?.data?.message || "Không thể duyệt yêu cầu. Vui lòng thử lại!");
      setRequestToApprove(null);
    }
  };

  const handleReject = async (requestId) => {
    if (!adminNote.trim()) {
      showWarning("Vui lòng nhập lý do từ chối");
      return;
    }

    try {
      const token = localStorage.getItem("jwt");
      await axios.put(
        `${API_BASE_URL}/api/orders/admin/cancel-requests/${requestId}/reject`,
        { adminNote },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showSuccess("Đã từ chối yêu cầu hủy đơn hàng!");
      setSelectedRequest(null);
      setAdminNote("");
      setActionType("");
      loadPendingRequests();
    } catch (error) {
      console.error("Lỗi khi từ chối:", error);
      showError(error.response?.data?.message || "Không thể từ chối yêu cầu. Vui lòng thử lại!");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price) => {
    if (!price && price !== 0) return '0';
    return price.toLocaleString('vi-VN');
  };

  if (loading) {
    return (
      <div className="container py-4">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h2 className="mb-4">Yêu cầu hủy đơn hàng</h2>

      {requests.length === 0 ? (
        <div className="card">
          <div className="card-body text-center py-5">
            <p className="text-muted">Không có yêu cầu hủy đơn hàng nào đang chờ xử lý</p>
          </div>
        </div>
      ) : (
        <div className="row">
          {requests.map((request) => (
            <div key={request.id} className="col-md-6 mb-4">
              <div className="card shadow-sm">
                <div className="card-header bg-warning">
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="fw-bold">Yêu cầu hủy đơn hàng #{request.order?.id}</span>
                    <span className="badge bg-dark">
                      {formatDate(request.requestedAt)}
                    </span>
                  </div>
                </div>
                <div className="card-body">
                  <div className="mb-3">
                    <strong>Khách hàng:</strong> {request.user?.firstName} {request.user?.lastName}
                  </div>
                  <div className="mb-3">
                    <strong>Email:</strong> {request.user?.email}
                  </div>
                  <div className="mb-3">
                    <strong>Tổng tiền đơn hàng:</strong>{" "}
                    <span className="text-success fw-bold">
                      {formatPrice(request.order?.totalPrice)} đ
                    </span>
                  </div>
                  <div className="mb-3">
                    <strong>Lý do hủy:</strong>
                    <div className="mt-2 p-2 bg-light rounded">
                      {request.reason || "Không có lý do"}
                    </div>
                  </div>
                  <div className="mb-3">
                    <strong>Trạng thái đơn hàng:</strong>{" "}
                    <span className="badge bg-info">{request.order?.orderStatus}</span>
                  </div>
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => {
                        setSelectedRequest(request);
                        setAdminNote("");
                        setActionType("approve");
                      }}
                    >
                      Duyệt
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => {
                        setSelectedRequest(request);
                        setAdminNote("");
                        setActionType("reject");
                      }}
                    >
                      Từ chối
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal xử lý */}
      {selectedRequest && (
        <div 
          className="modal show d-block" 
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={() => {
            setSelectedRequest(null);
            setAdminNote("");
            setActionType("");
          }}
        >
          <div 
            className="modal-dialog modal-dialog-centered"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {actionType === "approve" 
                    ? 'Duyệt yêu cầu hủy đơn hàng' 
                    : 'Từ chối yêu cầu hủy đơn hàng'}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setSelectedRequest(null);
                    setAdminNote("");
                    setActionType("");
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  <strong>Đơn hàng:</strong> #{selectedRequest.order?.id}
                </p>
                <p>
                  <strong>Khách hàng:</strong> {selectedRequest.user?.firstName}{" "}
                  {selectedRequest.user?.lastName}
                </p>
                <div className="mb-3">
                  <label className="form-label">
                    {actionType === "approve" ? "Ghi chú (tùy chọn):" : "Lý do từ chối (bắt buộc):"}
                  </label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                    placeholder={actionType === "approve" 
                      ? "Nhập ghi chú cho khách hàng..." 
                      : "Vui lòng nhập lý do từ chối..."}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setSelectedRequest(null);
                    setAdminNote("");
                    setActionType("");
                  }}
                >
                  Hủy
                </button>
                {actionType === "approve" ? (
                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={() => {
                      handleApprove(selectedRequest.id);
                      setSelectedRequest(null);
                      setAdminNote("");
                      setActionType("");
                    }}
                  >
                    Duyệt
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => handleReject(selectedRequest.id)}
                    disabled={!adminNote.trim()}
                  >
                    Từ chối
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <NotificationContainer 
        notifications={notifications} 
        onRemove={removeNotification} 
      />

      <ConfirmModal
        isOpen={showApproveConfirm}
        onClose={() => {
          setShowApproveConfirm(false);
          setRequestToApprove(null);
        }}
        onConfirm={confirmApprove}
        title="Duyệt yêu cầu hủy đơn hàng"
        message="Bạn có chắc muốn duyệt yêu cầu hủy đơn hàng này không?"
        confirmText="Duyệt"
        cancelText="Hủy"
        type="warning"
      />
    </div>
  );
};

export default OrderCancellationRequests;
