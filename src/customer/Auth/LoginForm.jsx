import React from "react";
import {
  Button,
  Grid,
  Paper,
  TextField,
  Typography,
  Box,
  InputAdornment,
  IconButton,
  Divider,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { motion } from "framer-motion";

// --- ICONS ---
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import GoogleIcon from "@mui/icons-material/Google"; // Example for social login
import { useNavigate } from "react-router-dom";

const RootContainer = styled(Box)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "100vh",
  backgroundColor: "#F8F9FA",
  fontFamily: "'Inter', sans-serif",
});

const StyledPaper = styled(Paper)(({ theme }) => ({
  width: 500,
  padding: theme.spacing(5),
  backgroundColor: "#FFFFFF",
  boxShadow: "0px 10px 40px rgba(0, 0, 0, 0.05)",
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: "12px",
    "& fieldset": {
      borderColor: "#DEE2E6",
    },
    "&:hover fieldset": {
      borderColor: "#ADB5BD",
    },
    "&.Mui-focused fieldset": {
      borderColor: theme.palette.primary.main,
      borderWidth: "1px",
    },
  },
  "& .MuiInputBase-input": {
    fontWeight: 500,
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.5),
  borderRadius: "12px",
  fontWeight: 600,
  fontSize: "0.95rem",
  textTransform: "none",
  boxShadow: "none",
  transition: "background-color 0.2s, transform 0.2s",
  "&:hover": {
    boxShadow: "none",
    transform: "translateY(-2px)",
  },
}));

const LoginForm = () => {
    const navigate = useNavigate();

  const [showPassword, setShowPassword] = React.useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = new FormData(e.currentTarget);
    const userData = {
      firstName: data.get("firstName"),
      lastName: data.get("lastName"),
      email: data.get("email"),
      password: data.get("password"),
    };
    console.log(userData, "datalogin");
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <RootContainer>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <StyledPaper>
          <Box textAlign="center" mb={3}>
            <Typography variant="h5" sx={{ fontWeight: 700, color: "#212529" }}>
               Đăng nhập tài khoản
            </Typography>
            <Typography variant="body2" sx={{ color: "#6C757D", mt: 1 }}>
              Chào mừng bạn! Vui lòng nhập thông tin.
            </Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            <Grid
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "26px",
              }}
            >
              <Grid item xs={12}>
                <StyledTextField
                  required
                  fullWidth
                  variant="outlined"
                  id="email"
                  name="email"
                  type="email"
                  label="Email"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <MailOutlineIcon sx={{ color: "#6C757D" }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <StyledTextField
                  required
                  fullWidth
                  variant="outlined"
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  label="Mật khẩu"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlinedIcon sx={{ color: "#6C757D" }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <StyledButton type="submit" variant="contained" fullWidth>
                  Đăng Nhập
                </StyledButton>
              </Grid>
            </Grid>
          </form>

          <Divider sx={{ my: 3, color: "#ADB5BD" }}>hoặc</Divider>

          <Box mt={3} textAlign="center">
            <Typography variant="body2" sx={{ color: "#6C757D" }}>
              Chưa có tài khoản?{" "}
              <Box
                              component="span"
                              sx={{
                                fontWeight: 600,
                                color: "primary.main",
                                textDecoration: "none",
                                cursor: "pointer",
                                "&:hover": { textDecoration: "underline" },
                              }}
                              onClick={() => navigate("/register")}
                            >
                              Đăng ký
                            </Box>
            </Typography>
          </Box>
        </StyledPaper>
      </motion.div>
    </RootContainer>
  );
};

export default LoginForm;
