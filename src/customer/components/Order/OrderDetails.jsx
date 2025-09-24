import React from "react";
import AddressCard from "../AddressCard/AddressCard";
import OrderTraker from "./OrderTraker";
import { Box, Grid } from "@mui/material";
import nuochoa from "../../../assets/img/nuochoa.png";
import { deepPurple } from "@mui/material/colors";
import StarBorderIcon from "@mui/icons-material/StarBorder";

const OrderDetails = () => {
  return (
    <div className="px-5 lg:px-20">
      {/* Header */}
      <div>
        <h1 className="font-bold text-2xl py-7 text-gray-800">
          Chi tiết đơn hàng
        </h1>
        <AddressCard />
      </div>

      {/* Order tracker */}
      <div className="py-14">
        <OrderTraker activeStep={3} />
      </div>

      {/* Product list */}
      <Grid spacing={3} className="mb-4">
        {[1, 2, 3, 4, 5].map((item, index) => (
          <Grid item xs={12} key={index} className="py-3">
            <div className="flex items-center justify-between p-5 rounded-2xl border shadow-md hover:shadow-lg transition-all bg-white">
              {/* Product info */}
              <div className="flex items-center space-x-5">
                <img
                  className="w-20 h-20 object-cover rounded-lg border"
                  src={nuochoa}
                  alt="Nước hoa"
                />
                <div className="space-y-1">
                  <p className="font-semibold text-gray-800">
                    Nước hoa Dior Sauvage
                  </p>
                  <p className="text-sm text-gray-500">Dung tích: 100ml</p>
                  <p className="text-green-600 font-bold">1.299.000₫</p>
                </div>
              </div>

              {/* Review button */}
              <Box
                className="flex items-center cursor-pointer px-4 py-2 rounded-lg hover:bg-purple-50"
                sx={{ color: deepPurple[600] }}
              >
                <StarBorderIcon sx={{ fontSize: "1.8rem" }} />
                <span className="ml-2 font-medium">Đánh giá & nhận xét</span>
              </Box>
            </div>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default OrderDetails;
