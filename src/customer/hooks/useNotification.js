import { useState, useCallback } from "react";

let notificationId = 0;

export const useNotification = () => {
  const [notifications, setNotifications] = useState([]);

  const showNotification = useCallback((message, type = "info", duration = 3000) => {
    const id = ++notificationId;
    const notification = { id, message, type, duration };
    
    setNotifications((prev) => [...prev, notification]);
    
    return id;
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const showSuccess = useCallback((message, duration = 3000) => {
    return showNotification(message, "success", duration);
  }, [showNotification]);

  const showError = useCallback((message, duration = 4000) => {
    return showNotification(message, "error", duration);
  }, [showNotification]);

  const showWarning = useCallback((message, duration = 3000) => {
    return showNotification(message, "warning", duration);
  }, [showNotification]);

  const showInfo = useCallback((message, duration = 3000) => {
    return showNotification(message, "info", duration);
  }, [showNotification]);

  return {
    notifications,
    showNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    removeNotification,
  };
};
