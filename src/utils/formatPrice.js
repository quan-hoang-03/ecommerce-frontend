/**
 * Format số tiền theo định dạng VNĐ
 * @param {number} amount - Số tiền cần format
 * @returns {string} - Chuỗi đã format (ví dụ: "1.234.567 VNĐ")
 */
export const formatPrice = (amount) => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return "0 VNĐ";
  }
  
  // Chuyển đổi sang số và format với dấu chấm phân cách hàng nghìn
  const formatted = Number(amount).toLocaleString("vi-VN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  
  return `${formatted} VNĐ`;
};

/**
 * Format số tiền chỉ với số, không có "VNĐ"
 * @param {number} amount - Số tiền cần format
 * @returns {string} - Chuỗi đã format (ví dụ: "1.234.567")
 */
export const formatPriceNumber = (amount) => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return "0";
  }
  
  return Number(amount).toLocaleString("vi-VN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};
