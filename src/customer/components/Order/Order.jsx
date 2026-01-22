import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getOderHistory } from "../../State/Order/Action";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../../config/apiConfig";
import axios from "axios";
import { useNotification } from "../../hooks/useNotification";
import NotificationContainer from "../Notification/NotificationContainer";
import ConfirmModal from "../Modal/ConfirmModal";
import { formatPrice } from "../../../utils/formatPrice";
import "bootstrap/dist/css/bootstrap.min.css";

const OrdersPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { order } = useSelector((state) => state);
  const [filterStatus, setFilterStatus] = useState([]);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [cancellationRequests, setCancellationRequests] = useState([]);
  const { notifications, showSuccess, showError, removeNotification } = useNotification();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);

  useEffect(() => {
    dispatch(getOderHistory());
    loadCancellationRequests();
  }, [dispatch]);

  const loadCancellationRequests = async () => {
    try {
      const token = localStorage.getItem("jwt");
      const response = await axios.get(`${API_BASE_URL}/api/orders/cancel-requests`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCancellationRequests(response.data || []);
    } catch (error) {
      console.error("Lỗi khi load cancellation requests:", error);
    }
  };

  const handleCancelOrder = (orderId) => {
    setSelectedOrderId(orderId);
    setShowCancelModal(true);
  };

  const submitCancelRequest = async () => {
    if (!cancelReason.trim()) {
      showError("Vui lòng nhập lý do hủy đơn hàng");
      return;
    }

    try {
      const token = localStorage.getItem("jwt");
      await axios.post(
        `${API_BASE_URL}/api/orders/${selectedOrderId}/cancel-request`,
        { reason: cancelReason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showSuccess("Đã gửi yêu cầu hủy đơn hàng. Vui lòng chờ admin xử lý.");
      setShowCancelModal(false);
      setCancelReason("");
      setSelectedOrderId(null);
      loadCancellationRequests();
      dispatch(getOderHistory()); // Reload orders
    } catch (error) {
      console.error("Lỗi khi gửi yêu cầu hủy:", error);
      showError(error.response?.data?.message || "Không thể gửi yêu cầu hủy. Vui lòng thử lại!");
    }
  };

  const handleDeleteOrder = (orderId) => {
    setOrderToDelete(orderId);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteOrder = async () => {
    if (!orderToDelete) return;

    try {
      const token = localStorage.getItem("jwt");
      await axios.delete(`${API_BASE_URL}/api/orders/${orderToDelete}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showSuccess("Đã xóa đơn hàng thành công!");
      dispatch(getOderHistory());
      setOrderToDelete(null);
    } catch (error) {
      console.error("Lỗi khi xóa đơn hàng:", error);
      showError(error.response?.data?.message || "Không thể xóa đơn hàng. Vui lòng thử lại!");
      setOrderToDelete(null);
    }
  };

  const getCancellationStatus = (orderId) => {
    const request = cancellationRequests.find(r => r.order?.id === orderId);
    if (!request) return null;
    return request.status;
  };

  // Debug: Log order data
  useEffect(() => {
    if (order.orders && order.orders.length > 0) {
      console.log("Orders data:", order.orders);
      order.orders.forEach((o, idx) => {
        const firstItem = o.orderItems?.[0];
        console.log(`Order ${idx + 1} (ID: ${o.id}):`, {
          orderItemsCount: o.orderItems?.length,
          firstItemId: firstItem?.id,
          productId: firstItem?.product?.id,
          productTitle: firstItem?.product?.title,
          imageUrl: firstItem?.product?.imageUrl,
          productFull: firstItem?.product
        });
      });
    }
  }, [order.orders]);

  // Lọc đơn hàng theo status
  const filteredOrders = order.orders?.filter((o) => {
    if (filterStatus.length === 0) return true;
    return filterStatus.some((status) => 
      o.orderStatus?.toLowerCase().includes(status.toLowerCase())
    );
  }) || [];

  const handleFilterChange = (status) => {
    if (filterStatus.includes(status)) {
      setFilterStatus(filterStatus.filter((s) => s !== status));
    } else {
      setFilterStatus([...filterStatus, status]);
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'PENDING': { label: 'Chờ xử lý', class: 'bg-warning text-dark' },
      'PLACED': { label: 'Đã đặt', class: 'bg-info text-white' },
      'CONFIRMED': { label: 'Đã xác nhận', class: 'bg-primary' },
      'SHIPPED': { label: 'Đang giao', class: 'bg-info' },
      'DELIVERED': { label: 'Đã giao', class: 'bg-success' },
      'CANCELLED': { label: 'Đã hủy', class: 'bg-danger' },
    };
    return statusMap[status] || { label: status || 'Không xác định', class: 'bg-secondary' };
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


  const getImageUrl = (imageUrl) => {
    if (!imageUrl || imageUrl.trim() === '') return null;
    // Nếu là URL đầy đủ (http/https), dùng trực tiếp
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }
    // Nếu là relative path, thêm API_BASE_URL
    return `${API_BASE_URL}${imageUrl.startsWith('/') ? imageUrl : '/' + imageUrl}`;
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4 font-bold" style={{ color: '#7c3aed' }}>Đơn hàng của tôi</h2>
      
      <div className="row align-items-stretch">
        {/* Bộ lọc */}
        <div className="col-md-3 mb-4 mb-md-0">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h5 className="card-title mb-4">Lọc đơn hàng</h5>

              <h6 className="fw-bold text-muted">Trạng thái</h6>
              <div className="form-check mb-2">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="pending"
                  checked={filterStatus.includes("PENDING")}
                  onChange={() => handleFilterChange("PENDING")}
                />
                <label className="form-check-label" htmlFor="pending">
                  Chờ xử lý
                </label>
              </div>
              <div className="form-check mb-2">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="placed"
                  checked={filterStatus.includes("PLACED")}
                  onChange={() => handleFilterChange("PLACED")}
                />
                <label className="form-check-label" htmlFor="placed">
                  Đã thanh toán
                </label>
              </div>
              <div className="form-check mb-2">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="shipped"
                  checked={filterStatus.includes("SHIPPED")}
                  onChange={() => handleFilterChange("SHIPPED")}
                />
                <label className="form-check-label" htmlFor="shipped">
                  Đang giao
                </label>
              </div>
              <div className="form-check mb-2">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="delivered"
                  checked={filterStatus.includes("DELIVERED")}
                  onChange={() => handleFilterChange("DELIVERED")}
                />
                <label className="form-check-label" htmlFor="delivered">
                  Đã giao
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Danh sách đơn hàng */}
        <div className="col-md-9">
          {order.loading ? (
            <div className="text-center py-5">
              <div className="spinner-border" style={{ color: '#7c3aed' }} role="status">
                <span className="visually-hidden">Đang tải...</span>
              </div>
              <p className="mt-2 text-muted">Đang tải đơn hàng...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="card shadow-sm">
              <div className="card-body text-center py-5">
                <div className="mb-3" style={{ fontSize: '48px' }}>📦</div>
                <p className="text-muted mb-3">Bạn chưa có đơn hàng nào</p>
                <button 
                  className="btn text-white"
                  style={{ backgroundColor: '#7c3aed' }}
                  onClick={() => navigate("/")}
                >
                  Mua sắm ngay
                </button>
              </div>
            </div>
          ) : (
            <div>
              {filteredOrders.map((orderItem) => (
                <div 
                  key={orderItem.id} 
                  className="card shadow-sm mb-3"
                  style={{ cursor: 'pointer', transition: 'box-shadow 0.2s' }}
                  onClick={() => navigate(`/account/order/${orderItem.id}`)}
                  onMouseOver={(e) => e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.15)'}
                  onMouseOut={(e) => e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'}
                >
                  <div className="card-header d-flex justify-content-between align-items-center bg-white">
                    <div>
                      <span className="fw-bold">Đơn hàng #{orderItem.id}</span>
                      <span className="text-muted ms-3">
                        {formatDate(orderItem.orderDate || orderItem.createdAt)}
                      </span>
                    </div>
                    <span className={`badge ${getStatusBadge(orderItem.orderStatus).class}`}>
                      {getStatusBadge(orderItem.orderStatus).label}
                    </span>
                  </div>
                  <div className="card-body">
                    <div className="row g-3">
                      {orderItem.orderItems?.slice(0, 2).map((item, index) => (
                        <div className="col-md-6" key={item.id || index}>
                          <div className="d-flex align-items-center">
                            <div className="me-3">
                              <div 
                                className="rounded d-flex align-items-center justify-content-center"
                                style={{ 
                                  width: "80px", 
                                  height: "80px",
                                  backgroundColor: '#f3f4f6',
                                  position: 'relative',
                                  overflow: 'hidden',
                                  border: '1px solid #e5e7eb'
                                }}
                              >
                                {(() => {
                                  const imageUrl = getImageUrl(item.product?.imageUrl);
                                  return imageUrl ? (
                                    <img
                                      src={imageUrl}
                                      alt={item.product?.title || 'Sản phẩm'}
                                      className="rounded"
                                      style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover"
                                      }}
                                      onError={(e) => {
                                        e.target.style.display = 'none';
                                        const container = e.target.parentElement;
                                        if (container) {
                                          const placeholder = container.querySelector('.image-placeholder');
                                          if (placeholder) placeholder.style.display = 'flex';
                                        }
                                      }}
                                    />
                                  ) : null;
                                })()}
                                <div 
                                  className="image-placeholder d-flex flex-column align-items-center justify-content-center"
                                  style={{ 
                                    width: "100%",
                                    height: "100%",
                                    fontSize: '10px',
                                    color: '#6b7280',
                                    display: getImageUrl(item.product?.imageUrl) ? 'none' : 'flex',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0
                                  }}
                                >
                                  <span style={{ fontSize: '20px' }}>📦</span>
                                  <span style={{ fontSize: '8px', marginTop: '2px' }}>Không có ảnh</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex-grow-1">
                              <h6 className="fw-bold mb-1" style={{ 
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                maxWidth: '200px'
                              }}>
                                {item.product?.title || "Sản phẩm"}
                              </h6>
                              <p className="text-muted mb-1 small">
                                Kích cỡ: {item.size || 'N/A'} | Số lượng: {item.quantity || 1}
                              </p>
                              <span className="fw-bold" style={{ color: '#7c3aed' }}>
                                {formatPrice(item.discountedPrice || item.price || item.product?.discountedPrice || item.product?.price)}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                      {orderItem.orderItems?.length > 2 && (
                        <div className="col-12">
                          <p className="text-muted small mb-0">
                            +{orderItem.orderItems.length - 2} sản phẩm khác
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="card-footer bg-white d-flex justify-content-between align-items-center">
                    <div>
                      <span className="text-muted">Tổng tiền: </span>
                      <span className="fw-bold fs-5" style={{ color: '#059669' }}>
                        {formatPrice(orderItem.totalDiscountedPrice || orderItem.totalPrice)}
                      </span>
                    </div>
                    <div className="d-flex gap-2">
                      {(() => {
                        const canCancel = ['PENDING', 'PLACED', 'CONFIRMED'].includes(orderItem.orderStatus);
                        const cancelStatus = getCancellationStatus(orderItem.id);
                        const isCancelled = orderItem.orderStatus === 'CANCELLED';
                        
                        if (isCancelled && cancelStatus === 'APPROVED') {
                          return (
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteOrder(orderItem.id);
                              }}
                            >
                              Xóa đơn hàng
                            </button>
                          );
                        }
                        
                        if (canCancel && !cancelStatus) {
                          return (
                            <button
                              className="btn btn-sm"
                              style={{ 
                                border: '1px solid #dc2626',
                                color: '#dc2626',
                                marginRight: '8px'
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCancelOrder(orderItem.id);
                              }}
                            >
                              Hủy đơn hàng
                            </button>
                          );
                        }
                        
                        if (cancelStatus === 'PENDING') {
                          return (
                            <span className="badge bg-warning text-dark">
                              Đang chờ duyệt hủy
                            </span>
                          );
                        }
                        
                        if (cancelStatus === 'APPROVED') {
                          return (
                            <span className="badge bg-success">
                              Đã hủy thành công
                            </span>
                          );
                        }
                        
                        return null;
                      })()}
                      <button 
                        className="btn btn-sm"
                        style={{ 
                          border: '1px solid #7c3aed',
                          color: '#7c3aed'
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/account/order/${orderItem.id}`);
                        }}
                      >
                        Xem chi tiết →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Notification Container */}
      <NotificationContainer 
        notifications={notifications} 
        onRemove={removeNotification} 
      />

      {/* Modal hủy đơn hàng */}
      {showCancelModal && (
        <div 
          className="modal show d-block" 
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={() => setShowCancelModal(false)}
        >
          <div 
            className="modal-dialog modal-dialog-centered"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Hủy đơn hàng</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => {
                    setShowCancelModal(false);
                    setCancelReason("");
                    setSelectedOrderId(null);
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <p className="mb-3">Vui lòng nhập lý do hủy đơn hàng:</p>
                <textarea
                  className="form-control"
                  rows="4"
                  placeholder="Ví dụ: Thay đổi ý định, không còn nhu cầu..."
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                />
                <small className="text-muted mt-2 d-block">
                  Yêu cầu hủy đơn hàng sẽ được gửi đến admin để xử lý.
                </small>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowCancelModal(false);
                    setCancelReason("");
                    setSelectedOrderId(null);
                  }}
                >
                  Hủy
                </button>
                <button 
                  type="button" 
                  className="btn btn-danger"
                  onClick={submitCancelRequest}
                  disabled={!cancelReason.trim()}
                >
                  Gửi yêu cầu hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setOrderToDelete(null);
        }}
        onConfirm={confirmDeleteOrder}
        title="Xóa đơn hàng"
        message="Bạn có chắc muốn xóa đơn hàng này không?"
        confirmText="Xóa"
        cancelText="Hủy"
        type="danger"
      />
    </div>
  );
};

export default OrdersPage;
