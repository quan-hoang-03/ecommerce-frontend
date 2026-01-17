import React, { useState } from "react";
import { Box, Button, Rating, TextField, Typography } from "@mui/material";
import axios from "axios";
import { API_BASE_URL } from "../../../config/apiConfig";
import { useNotification } from "../../hooks/useNotification";
import NotificationContainer from "../Notification/NotificationContainer";

const ReviewForm = ({ productId, onReviewSubmitted }) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError, notifications, removeNotification } = useNotification();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!rating || rating === 0) {
      showError("Vui lòng chọn đánh giá sao");
      return;
    }

    if (!review.trim()) {
      showError("Vui lòng nhập đánh giá");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("jwt");
      if (!token) {
        showError("Vui lòng đăng nhập để đánh giá");
        setLoading(false);
        return;
      }

      // Submit rating
      await axios.post(
        `${API_BASE_URL}/api/rating/add`,
        { productId, rating },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Submit review
      await axios.post(
        `${API_BASE_URL}/api/review/add`,
        { productId, review },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      showSuccess("Đánh giá của bạn đã được gửi thành công!");
      setRating(0);
      setReview("");
      
      // Callback để refresh reviews
      if (onReviewSubmitted) {
        onReviewSubmitted();
      }
    } catch (error) {
      console.error("Lỗi khi gửi đánh giá:", error);
      showError(error.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ mb: 4, p: 3, bgcolor: "#f9fafb", borderRadius: 2, border: "1px solid #e5e7eb" }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Viết đánh giá của bạn
      </Typography>
      
      <form onSubmit={handleSubmit}>
        <Box sx={{ mb: 2 }}>
          <Typography sx={{ mb: 1, fontSize: "0.875rem", fontWeight: 500 }}>
            Đánh giá sao *
          </Typography>
          <Rating
            value={rating}
            onChange={(event, newValue) => {
              setRating(newValue);
            }}
            precision={0.5}
            size="large"
            sx={{
              "& .MuiRating-iconFilled": {
                color: "#fbbf24",
              },
            }}
          />
        </Box>

        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
            value={review}
            onChange={(e) => setReview(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                bgcolor: "#fff",
              },
            }}
          />
        </Box>

        <Button
          type="submit"
          variant="contained"
          disabled={loading}
          sx={{
            bgcolor: "#9155fd",
            "&:hover": {
              bgcolor: "#7c3aed",
            },
            px: 3,
            py: 1,
            fontWeight: 600,
          }}
        >
          {loading ? "Đang gửi..." : "Gửi đánh giá"}
        </Button>
      </form>

      <NotificationContainer 
        notifications={notifications} 
        onRemove={removeNotification} 
      />
    </Box>
  );
};

export default ReviewForm;
