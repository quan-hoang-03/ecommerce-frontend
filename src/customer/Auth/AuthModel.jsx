import React from "react";
import { Modal, Box } from "@mui/material";
import { motion } from "framer-motion";
import RegisterForm from "./RegisterForm";
import LoginForm from "./LoginForm";
import { useLocation } from "react-router-dom";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  outline: "none",
  borderRadius: "16px",
  overflow: "hidden",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.25)",
};

const AuthModal = ({ handleClose, open }) => {
    const location = useLocation();
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={modalStyle}>
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: -50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          transition={{
            duration: 0.5,
            ease: [0.25, 0.1, 0.25, 1],
          }}
        >
          {location.pathname === "/register" ? <RegisterForm /> : <LoginForm />}
        </motion.div>
      </Box>
    </Modal>
  );
};

export default AuthModal;
