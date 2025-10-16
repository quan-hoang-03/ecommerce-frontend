import { Grid, Box } from "@mui/material";
import React from "react";
import Achievement from "./Achivement";
import MonthlyOverview from "./MonthlyOverview";
import ProductsTable from "./ProductsTable";

const AdminDashboard = () => {
  return (
    <Box sx={{ p: 4 }}>
      <Grid container spacing={2} alignItems="stretch">
        <Grid item xs={12} md={4} sx={{ display: "flex" }}>
          <Box sx={{ flexGrow: 1 }}>
            <Achievement />
          </Box>
        </Grid>
        <Grid item xs={12} md={8} sx={{ display: "flex" }}>
          <Box sx={{ flexGrow: 1 }}>
            <MonthlyOverview />
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
            {/* <ProductsTable /> */}
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;
