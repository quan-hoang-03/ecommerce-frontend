import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import React from 'react'

const Footer = () => {
  return (
    <div>
      <Grid
        className="bg-black text-white text-center mt-10"
        container
        sx={{ bgcolor: "black", color: "white", py: 3 }}
      >
        <Grid item xs={12} sm={6} md={3}>
          <Typography className="pb-5" variant="h6">
            {" "}
            Company
          </Typography>
          <div>
            <Button className="pb-5" variant="h6">
                {" "}
              About
            </Button>
          </div>
          <div>
            <Button className="pb-5" variant="h6">
                {" "}
              Blog
            </Button>
          </div>
          <div>
            <Button className="pb-5" variant="h6">
                {" "}
              Press
            </Button>
          </div>
          <div>
            <Button className="pb-5" variant="h6">
                {" "}
              Jobs
            </Button>
          </div>
          <div>
            <Button className="pb-5" variant="h6">
                {" "}
              Partners
            </Button>
          </div>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Typography className="pb-5" variant="h6">
            {" "}
            Company
          </Typography>
          <div>
            <Button className="pb-5" variant="h6">
                {" "}
              About
            </Button>
          </div>
          <div>
            <Button className="pb-5" variant="h6">
                {" "}
              Blog
            </Button>
          </div>
          <div>
            <Button className="pb-5" variant="h6">
                {" "}
              Press
            </Button>
          </div>
          <div>
            <Button className="pb-5" variant="h6">
                {" "}
              Jobs
            </Button>
          </div>
          <div>
            <Button className="pb-5" variant="h6">
                {" "}
              Partners
            </Button>
          </div>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Typography className="pb-5" variant="h6">
            {" "}
            Company
          </Typography>
          <div>
            <Button className="pb-5" variant="h6">
                {" "}
              About
            </Button>
          </div>
          <div>
            <Button className="pb-5" variant="h6">
                {" "}
              Blog
            </Button>
          </div>
          <div>
            <Button className="pb-5" variant="h6">
                {" "}
              Press
            </Button>
          </div>
          <div>
            <Button className="pb-5" variant="h6">
                {" "}
              Jobs
            </Button>
          </div>
          <div>
            <Button className="pb-5" variant="h6">
                {" "}
              Partners
            </Button>
          </div>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Typography className="pb-5" variant="h6">
            {" "}
            Company
          </Typography>
          <div>
            <Button className="pb-5" variant="h6">
                {" "}
              About
            </Button>
          </div>
          <div>
            <Button className="pb-5" variant="h6">
                {" "}
              Blog
            </Button>
          </div>
          <div>
            <Button className="pb-5" variant="h6">
                {" "}
              Press
            </Button>
          </div>
          <div>
            <Button className="pb-5" variant="h6">
                {" "}
              Jobs
            </Button>
          </div>
          <div>
            <Button className="pb-5" variant="h6">
                {" "}
              Partners
            </Button>
          </div>
        </Grid>
      </Grid>
      <Grid className="pt-5 pb-5" item xs={12}>
        <Typography className="body2" component="p" align='center'>
            &copy;2025 All rights reserved | Designed by Hoang Minh Quan
        </Typography>
      </Grid>
    </div>
  );
}

export default Footer