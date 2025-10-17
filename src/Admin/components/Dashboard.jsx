import { Grid, Box } from "@mui/material";
import React from "react";
import Achievement from "./Achivement";
import MonthlyOverview from "./MonthlyOverview";
import Statistical from "../views/Statistical";

const AdminDashboard = () => {
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
            <Achievement />
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
            <MonthlyOverview />
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
