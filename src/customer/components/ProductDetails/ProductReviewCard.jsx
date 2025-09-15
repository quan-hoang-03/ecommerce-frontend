import { Avatar, Box, Grid, Rating } from '@mui/material'
import React from 'react'

const ProductReviewCard = () => {
  return (
    <div>
      <Grid container spacing={2} gap={3}>
        <Grid item xs={3}>
          <Box>
            <Avatar
              className="text-white"
              sx={{ width: 56, height: 56, bgcolor: "#9155fd" }}
            ></Avatar>
          </Box>
        </Grid>
        <Grid item xs={9}>
          <div className="space-y-2">
            <div>
              <p className='font-semibold text-lg'>Test</p>
              <p className='opacity-70'>15/9/2025</p>
            </div>
          </div>
          <Rating value={4.5} name="half-rating" readOnly precision={.5}/>
          <p>
            Nước Tẩy Trang L'Oréal là dòng sản phẩm tẩy trang dạng nước đến từ
            thương hiệu L'Oreal Paris, được ứng dụng công nghệ Micellar dịu nhẹ
            giúp làm sạch da, lấy đi bụi bẩn, dầu thừa và cặn trang điểm chỉ
            trong một bước, mang lại làn da thông thoáng, mềm mượt mà không hề
            khô căng.
          </p>
        </Grid>
      </Grid>
    </div>
  );
}

export default ProductReviewCard