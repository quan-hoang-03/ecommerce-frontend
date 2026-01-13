import { Grid, Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import Achievement from "./Achivement";
import MonthlyOverview from "./MonthlyOverview";
import Statistical from "../views/Statistical";
import { API_BASE_URL } from "../../config/apiConfig";
import axios from "axios";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalProducts: 0,
    totalRevenue: 0,
    totalSalesQuantity: 0,
    totalSalesValue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("jwt");
        const response = await axios.get(`${API_BASE_URL}/api/admin/overview-statistics`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setStats({
          totalCustomers: response.data.totalCustomers || 0,
          totalProducts: response.data.totalProducts || 0,
          totalRevenue: response.data.totalRevenue || 0,
          totalSalesQuantity: response.data.totalSalesQuantity || 0,
          totalSalesValue: response.data.totalSalesValue || 0,
        });
      } catch (error) {
        console.error("Lỗi khi tải thống kê:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <Box sx={{ p: 4 }}>
      <Grid sx={{display:"flex",gap:"20px"}}>
        <Grid
          className="shadow-lg shadow-gray-600"
          item
          xs={12}
          md={4}
          sx={{ display: "flex" }}
        >
          <Box sx={{ flexGrow: 1 }}>
            <Achievement stats={stats} loading={loading} />
          </Box>
        </Grid>
        <Grid
          className="shadow-lg shadow-gray-600"
          item
          xs={12}
          md={8}
          sx={{ display: "flex",flex:1 }}
        >
          <Box sx={{ flexGrow: 1 }}>
            <MonthlyOverview stats={stats} loading={loading} />
          </Box>
        </Grid>
      </Grid>
      <Grid
        className="shadow-lg shadow-gray-600 mt-4"
      >
        <Statistical />
      </Grid>
    </Box>
  );
};

export default AdminDashboard;
