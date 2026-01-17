import { Avatar, Box, Grid, Rating } from '@mui/material'
import React from 'react'

const ProductReviewCard = ({ review, rating }) => {
  // Combine review and rating data
  const userName = review?.user?.firstName 
    ? `${review.user.firstName} ${review.user.lastName || ""}`.trim()
    : review?.user?.email?.split("@")[0] || "Người dùng";
  
  const reviewText = review?.review || "";
  const reviewDate = review?.createdAt 
    ? new Date(review.createdAt).toLocaleDateString("vi-VN")
    : "";
  
  const ratingValue = rating?.rating || review?.rating || 0;
  
  // Get first letter for avatar
  const avatarLetter = userName.charAt(0).toUpperCase();

  return (
    <div className="border-b border-gray-200 pb-6 last:border-b-0">
      <Grid container spacing={2}>
        <Grid item xs={2}>
          <Box>
            <Avatar
              className="text-white"
              sx={{ width: 56, height: 56, bgcolor: "#9155fd" }}
            >
              {avatarLetter}
            </Avatar>
          </Box>
        </Grid>
        <Grid item xs={10}>
          <div className="space-y-2">
            <div>
              <p className='font-semibold text-lg'>{userName}</p>
              <p className='opacity-70 text-sm'>{reviewDate}</p>
            </div>
            <Rating 
              value={ratingValue} 
              name="half-rating" 
              readOnly 
              precision={0.5}
              sx={{
                "& .MuiRating-iconFilled": {
                  color: "#fbbf24",
                },
              }}
            />
            <p className="text-gray-700 mt-2">
              {reviewText}
            </p>
          </div>
        </Grid>
      </Grid>
    </div>
  );
}

export default ProductReviewCard