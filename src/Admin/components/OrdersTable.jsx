import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { confirmOrder, deleteOrder, deliveredOrder, getOrders, shipOrder } from '../../customer/State/Admin/Order/Action';
import {
  Avatar,
  Button,
  Card,
  CardHeader,
  Menu,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
} from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import * as XLSX from 'xlsx';
const OrdersTable = () => {
  const dispatch = useDispatch();

  const {adminOrder} = useSelector(store => store);
  console.log(adminOrder?.orders?.product,"dataaaaaa");

  useEffect(() => {
    dispatch(getOrders());
  }, [adminOrder.confirmed, adminOrder.shipped, adminOrder.delivered,adminOrder.deleteOrder]);
  console.log(adminOrder,"dataaaaaaa")
  
  const handleConfirmOrder = (orderId) => {
    dispatch(confirmOrder(orderId));
    handleClose();
   }
  const handleShipOrder = (orderId) => {
    dispatch(shipOrder(orderId));
    handleClose();
   }
  const handleDeliveredOrder = (orderId) => {
    dispatch(deliveredOrder(orderId));
    handleClose();
   }
  const handleDeleteOrder = (orderId) => {
    dispatch(deleteOrder(orderId));
    handleClose();
   }

   const [anchorEl, setAnchorEl] = React.useState([]);
   const open = Boolean(anchorEl);

   // State cho Snackbar thông báo
   const [snackbar, setSnackbar] = React.useState({
     open: false,
     message: "",
     severity: "info", // 'success', 'error', 'warning', 'info'
   });

   const handleCloseSnackbar = (event, reason) => {
     if (reason === "clickaway") {
       return;
     }
     setSnackbar({ ...snackbar, open: false });
   };


   const handleClick = (event,index)=>{
    const newAnchorElArray = [...anchorEl];
    newAnchorElArray[index] = event.currentTarget;
    setAnchorEl(newAnchorElArray);
   }

   const handleClose = (index) => {
    const newAnchorElArray = [...anchorEl];
    newAnchorElArray[index] = null;
     setAnchorEl(newAnchorElArray);
   };

  // Hàm tạo mã GD tự động
  const generateTransactionId = (orderId, orderDate) => {
    if (!orderId) return "";
    const date = orderDate ? new Date(orderDate) : new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, "");
    const timeStr = date.toTimeString().slice(0, 8).replace(/:/g, "");
    return `ORDER-${dateStr}${timeStr}-${orderId.toString().padStart(6, '0')}`;
  };

  // Hàm format ngày tháng
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes} ${day}/${month}/${year}`;
  };

  // Hàm lấy phương thức thanh toán
  const getPaymentMethod = (order) => {
    if (order.paypalOrderId) return "PayPal";
    if (order.paymentDetails?.paymentMethod) {
      return order.paymentDetails.paymentMethod;
    }
    return "COD"; // Cash on Delivery
  };

  // Lọc chỉ lấy đơn hàng đã thanh toán
  const getPaidOrders = () => {
    const orders = adminOrder?.orders || [];
    return orders.filter(order => {
      const status = order.orderStatus?.toUpperCase();
      return status === "PLACED" || status === "CONFIRMED" || 
             status === "SHIPPED" || status === "DELIVERED";
    });
  };

  // Hàm export ra Excel
  const handleExportToExcel = () => {
    const paidOrders = getPaidOrders();
    
    if (!paidOrders || paidOrders.length === 0) {
      setSnackbar({
        open: true,
        message: "Không có dữ liệu để xuất!",
        severity: "warning",
      });
      return;
    }

    // Chuyển đổi dữ liệu đơn hàng thành định dạng Excel
    const excelData = [];
    
    paidOrders.forEach((order) => {
      excelData.push({
        "Mã GD": generateTransactionId(order.id, order.orderDate),
        "Ngày GD": formatDate(order.orderDate),
        "Mô tả": `Đơn hàng #${order.id} - ${order.orderItems?.map(item => item.product?.title).filter(Boolean).join(", ") || "Không có sản phẩm"}`,
        "Nguồn thu": getPaymentMethod(order),
        "Người đóng": `${order.user?.firstName || ""} ${order.user?.lastName || ""}`.trim() || "",
        "Người tạo": "Tự động",
        "Số tiền": order.totalPrice || 0,
        "Trạng thái": order.orderStatus || "",
      });
    });

    // Tạo worksheet từ dữ liệu
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    
    // Thiết lập độ rộng cột
    const columnWidths = [
      { wch: 25 }, // Mã GD
      { wch: 18 }, // Ngày GD
      { wch: 40 }, // Mô tả
      { wch: 15 }, // Nguồn thu
      { wch: 25 }, // Người đóng
      { wch: 15 }, // Người tạo
      { wch: 15 }, // Số tiền
      { wch: 15 }, // Trạng thái
    ];
    worksheet['!cols'] = columnWidths;

    // Tạo workbook và thêm worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Danh sách đơn hàng");

    // Tạo tên file với timestamp
    const date = new Date();
    const dateStr = date.toISOString().split('T')[0];
    const fileName = `Danh_sach_don_hang_${dateStr}.xlsx`;

    // Xuất file Excel
    try {
      XLSX.writeFile(workbook, fileName);
      setSnackbar({
        open: true,
        message: `Xuất Excel thành công! File: ${fileName}`,
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Có lỗi xảy ra khi xuất file Excel!",
        severity: "error",
      });
    }
  };

  return (
    <div className="p-5 bg-gray-50 min-h-screen">
      <Card className="mt-2 shadow-md rounded-2xl" sx={{ bgcolor: "white" }}>
        <CardHeader
          title="Thống kê đơn hàng"
          titleTypographyProps={{
            sx: {
              fontSize: "1.4rem",
              fontWeight: 600,
              color: "#1f2937",
            },
          }}
          subheader="Quản lý các đơn hàng đã thanh toán"
          action={
            <Tooltip title="Xuất danh sách ra Excel">
              <IconButton
                onClick={handleExportToExcel}
                sx={{
                  bgcolor: "#10b981",
                  color: "white",
                  "&:hover": {
                    bgcolor: "#059669",
                  },
                }}
              >
                <FileDownloadIcon />
              </IconButton>
            </Tooltip>
          }
        />
      </Card>

      <TableContainer
        component={Paper}
        className="mt-4 shadow-sm rounded-2xl overflow-hidden"
      >
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead sx={{ bgcolor: "#f3f4f6" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Mã GD</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Ngày GD</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Mô tả</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Nguồn thu</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Người đóng</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Người tạo</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Số tiền</TableCell>
              <TableCell align="center" sx={{ fontWeight: 600 }}>
                Trạng thái
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 600 }}>
                Thao tác
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {getPaidOrders().map((item, index) => (
              <TableRow
                key={item.id}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  "&:hover": { bgcolor: "#f9fafb" },
                  transition: "0.2s ease",
                }}
              >
                <TableCell>
                  <span className="font-mono text-sm text-gray-700">
                    {generateTransactionId(item.id, item.orderDate)}
                  </span>
                </TableCell>

                <TableCell>
                  <span className="text-gray-600">
                    {formatDate(item.orderDate)}
                  </span>
                </TableCell>

                <TableCell>
                  <span className="text-gray-800">
                    Đơn hàng #{item.id} - {item.orderItems?.map(orderItem => orderItem.product?.title).filter(Boolean).join(", ") || "Không có sản phẩm"}
                  </span>
                </TableCell>

                <TableCell>
                  <span className="text-gray-700">
                    {getPaymentMethod(item)}
                  </span>
                </TableCell>

                <TableCell>
                  <div>
                    <span className="text-gray-800 font-medium">
                      {item?.user?.firstName} {item?.user?.lastName}
                    </span>
                    {item?.user?.email && (
                      <p className="text-xs text-gray-500">{item.user.email}</p>
                    )}
                  </div>
                </TableCell>

                <TableCell>
                  <div>
                    <span className="text-gray-700">Tự động</span>
                    <p className="text-xs text-gray-500">{getPaymentMethod(item)}</p>
                  </div>
                </TableCell>

                <TableCell>
                  <span className="text-green-600 font-semibold">
                    +{item?.totalPrice != null
                      ? item.totalPrice.toLocaleString("vi-VN")
                      : "0"} ₫
                  </span>
                </TableCell>

                <TableCell align="center">
                  <span
                    className={`text-white px-3 py-1 rounded-full text-xs font-medium ${
                      item.orderStatus === "CONFIRMED"
                        ? "bg-[#369236]"
                        : item.orderStatus === "SHIPPED"
                        ? "bg-[#4141ff]"
                        : item.orderStatus === "PLACED"
                        ? "bg-[#02B290]"
                        : item.orderStatus === "DELIVERED"
                        ? "bg-[#10b981]"
                        : item.orderStatus === "PENDING"
                        ? "bg-gray-400"
                        : "bg-[#025720]"
                    }`}
                  >
                    {item.orderStatus === "DELIVERED" ? "Hoàn thành" : item.orderStatus}
                  </span>
                </TableCell>

                <TableCell align="center">
                  <div className="flex gap-2 justify-center">
                    <Button
                      id={`basic-button-${item.id}`}
                      aria-haspopup="true"
                      onClick={(event) => handleClick(event, index)}
                      aria-controls={`basic-menu-${item.id}`}
                      aria-expanded={Boolean(anchorEl[index])}
                      size="small"
                      variant="outlined"
                      sx={{
                        textTransform: "none",
                        fontSize: "0.75rem",
                      }}
                    >
                      Cập nhật
                    </Button>
                    <Menu
                      id={`basic-menu-${item.id}`}
                      anchorEl={anchorEl[index]}
                      open={Boolean(anchorEl[index])}
                      onClose={() => handleClose(index)}
                    >
                      <MenuItem onClick={() => handleConfirmOrder(item.id)}>
                        Đơn hàng đã xác nhận
                      </MenuItem>
                      <MenuItem onClick={() => handleShipOrder(item.id)}>
                        Đơn hàng đang giao
                      </MenuItem>
                      <MenuItem onClick={() => handleDeliveredOrder(item.id)}>
                        Đơn hàng đã giao
                      </MenuItem>
                    </Menu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Snackbar thông báo */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default OrdersTable