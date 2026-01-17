import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Avatar, IconButton, CircularProgress } from "@mui/material";
import { deepPurple } from "@mui/material/colors";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import { getUser } from "../../State/Auth/Action";
import axios from "axios";
import { API_BASE_URL } from "../../../config/apiConfig";
import { useNotification } from "../../hooks/useNotification";
import NotificationContainer from "../Notification/NotificationContainer";
import "bootstrap/dist/css/bootstrap.min.css";

const UserProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { auth } = useSelector((store) => store);
  const jwt = localStorage.getItem("jwt");
  const fileInputRef = useRef(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const { notifications, showSuccess, showError, showWarning, removeNotification } = useNotification();

  useEffect(() => {
    if (!jwt) {
      navigate("/");
      return;
    }
    if (jwt && !auth.user) {
      dispatch(getUser(jwt));
    }
  }, [jwt, auth.user, dispatch, navigate]);

  // Load ảnh đại diện từ localStorage hoặc từ user object
  useEffect(() => {
    if (auth.user) {
      const savedAvatar = localStorage.getItem(`avatar_${auth.user.id}`);
      if (savedAvatar) {
        setAvatarPreview(savedAvatar);
      } else if (auth.user.avatar) {
        // Backend trả về path như /uploads/avatars/filename.jpg
        const avatarUrl = auth.user.avatar.startsWith('http') 
          ? auth.user.avatar 
          : `${API_BASE_URL}${auth.user.avatar}`;
        setAvatarPreview(avatarUrl);
      }
    }
  }, [auth.user]);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      showWarning("Vui lòng chọn file ảnh!");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showWarning("Kích thước ảnh không được vượt quá 5MB!");
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Upload to server
    await uploadAvatar(file);
  };

  const uploadAvatar = async (file) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("avatar", file); // Đổi từ "image" thành "avatar" để khớp với backend

      // Upload to API endpoint
      const response = await axios.post(
        `${API_BASE_URL}/users/profile/avatar`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Backend trả về avatarUrl trong response.data
      if (response.data?.avatarUrl) {
        // Tạo full URL từ path trả về
        const fullAvatarUrl = `${API_BASE_URL}${response.data.avatarUrl}`;
        setAvatarPreview(fullAvatarUrl);
        
        // Lưu vào localStorage để dùng lại
        if (auth.user?.id) {
          localStorage.setItem(`avatar_${auth.user.id}`, fullAvatarUrl);
        }
        
        // Refresh user data từ server để cập nhật cả Navigation
        // Sử dụng setTimeout nhỏ để đảm bảo state được cập nhật
        setTimeout(() => {
          dispatch(getUser(jwt));
        }, 100);
        
        showSuccess("Đã cập nhật ảnh đại diện thành công!");
      } else {
        throw new Error("Không nhận được avatarUrl từ server");
      }
    } catch (error) {
      console.error("Lỗi khi upload ảnh:", error);
      const errorMessage = error.response?.data?.message || error.message || "Có lỗi xảy ra khi upload ảnh";
      showError(`Lỗi: ${errorMessage}`);
    } finally {
      setUploading(false);
    }
  };

  if (!auth.user) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </div>
        </div>
      </div>
    );
  }

  const user = auth.user;

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-sm">
            <div className="card-header bg-white border-bottom-0 pt-4 pb-3">
              <div className="text-center">
                <div className="position-relative d-inline-block">
                  <Avatar
                    src={avatarPreview}
                    sx={{
                      bgcolor: avatarPreview ? "transparent" : deepPurple[500],
                      color: "white",
                      width: 100,
                      height: 100,
                      fontSize: "2.5rem",
                      margin: "0 auto",
                      cursor: "pointer",
                      border: "3px solid #e0e0e0",
                    }}
                    onClick={handleAvatarClick}
                  >
                    {!avatarPreview && (user.firstName?.[0]?.toUpperCase() || "U")}
                  </Avatar>
                  <IconButton
                    onClick={handleAvatarClick}
                    disabled={uploading}
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      bgcolor: deepPurple[500],
                      color: "white",
                      width: 36,
                      height: 36,
                      border: "2px solid white",
                      "&:hover": {
                        bgcolor: deepPurple[700],
                      },
                    }}
                  >
                    {uploading ? (
                      <CircularProgress size={20} sx={{ color: "white" }} />
                    ) : (
                      <CameraAltIcon fontSize="small" />
                    )}
                  </IconButton>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                  />
                </div>
                <h3 className="mt-3 mb-1 fw-bold">
                  {user.firstName} {user.lastName}
                </h3>
                <p className="text-muted mb-0">Thông tin tài khoản</p>
                <p className="text-muted small mt-1">
                  Click vào ảnh để đổi ảnh đại diện
                </p>
              </div>
            </div>

            <div className="card-body px-4 py-4">
              <div className="row mb-4">
                <div className="col-12">
                  <h5 className="fw-bold mb-4 text-primary">Thông tin cá nhân</h5>
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label text-muted small mb-1">
                  Họ và tên đệm
                </label>
                <div className="form-control-plaintext border-bottom pb-2">
                  {user.firstName || "Chưa cập nhật"}
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label text-muted small mb-1">
                  Tên
                </label>
                <div className="form-control-plaintext border-bottom pb-2">
                  {user.lastName || "Chưa cập nhật"}
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label text-muted small mb-1">
                  Email
                </label>
                <div className="form-control-plaintext border-bottom pb-2">
                  {user.email || "Chưa cập nhật"}
                </div>
              </div>

              {user.mobile && (
                <div className="mb-4">
                  <label className="form-label text-muted small mb-1">
                    Số điện thoại
                  </label>
                  <div className="form-control-plaintext border-bottom pb-2">
                    {user.mobile}
                  </div>
                </div>
              )}

              {user.role && (
                <div className="mb-4">
                  <label className="form-label text-muted small mb-1">
                    Vai trò
                  </label>
                  <div className="form-control-plaintext border-bottom pb-2">
                    <span className="badge bg-primary">
                      {user.role === "ROLE_ADMIN" ? "Quản trị viên" : "Khách hàng"}
                    </span>
                  </div>
                </div>
              )}

              <div className="mt-5 pt-3 border-top">
                <div className="d-grid gap-2">
                  <button
                    className="btn btn-outline-primary"
                    onClick={() => navigate("/account/order")}
                  >
                    Xem đơn hàng
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={() => navigate("/")}
                  >
                    Về trang chủ
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <NotificationContainer 
        notifications={notifications} 
        onRemove={removeNotification} 
      />
    </div>
  );
};

export default UserProfile;

