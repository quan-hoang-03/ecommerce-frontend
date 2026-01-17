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
  InputBase,
  Box,
} from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
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
    return `${dateStr}${timeStr}-${orderId.toString().padStart(6, '0')}`;
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

  const paidOrders = getPaidOrders();
  
  // Tính toán summary
  const totalRevenue = paidOrders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
  const totalOrders = paidOrders.length;
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  return (
    <div className="p-6 bg-gray-50 min-h-full">
      {/* Title Section */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Thống kê đơn hàng</h1>
        <p className="text-gray-600">Quản lý các đơn hàng đã thanh toán</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Số dư ví / Tổng đơn hàng */}
        <Card className="shadow-md rounded-xl border border-gray-100">
          <Box className="p-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-blue-100 rounded-full -mr-10 -mt-10 opacity-50"></div>
            <div className="relative">
              <p className="text-sm text-gray-600 mb-1">Tổng đơn hàng</p>
              <p className="text-2xl font-bold text-gray-800">{totalOrders}</p>
            </div>
          </Box>
        </Card>

        {/* Tổng thu */}
        <Card className="shadow-md rounded-xl border border-gray-100">
          <Box className="p-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-green-100 rounded-full -mr-10 -mt-10 opacity-50"></div>
            <div className="relative">
              <p className="text-sm text-gray-600 mb-1">Tổng thu</p>
              <p className="text-2xl font-bold text-green-600">
                {totalRevenue.toLocaleString("vi-VN")} ₫
              </p>
            </div>
          </Box>
        </Card>

        {/* Tổng chi / Giá trị trung bình */}
        <Card className="shadow-md rounded-xl border border-gray-100">
          <Box className="p-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-red-100 rounded-full -mr-10 -mt-10 opacity-50"></div>
            <div className="relative">
              <p className="text-sm text-gray-600 mb-1">Giá trị trung bình</p>
              <p className="text-2xl font-bold text-gray-800">
                {averageOrderValue.toLocaleString("vi-VN")} ₫
              </p>
            </div>
          </Box>
        </Card>
      </div>

      {/* Search and Filter Section */}
      <Card className="shadow-md rounded-xl mb-6" sx={{ bgcolor: "white" }}>
        <Box className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 w-full md:w-auto">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SearchIcon className="h-5 w-5 text-gray-400" />
                </div>
                <InputBase
                  placeholder="Tìm theo mã, mô tả, người đóng..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg border border-gray-200"
                  sx={{
                    "& .MuiInputBase-input": {
                      padding: "8px 12px",
                    },
                  }}
                />
              </div>
            </div>
            <div className="flex gap-3 items-center">
              <Button
                variant="outlined"
                size="small"
                startIcon={<FilterListIcon />}
                sx={{ textTransform: "none" }}
              >
                Hiện bộ lọc nâng cao
              </Button>
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
            </div>
          </div>
        </Box>
      </Card>

      {/* Table Card */}
      <Card className="shadow-md rounded-xl" sx={{ bgcolor: "white" }}>
        <CardHeader
          title="Giao dịch thu"
          titleTypographyProps={{
            sx: {
              fontSize: "1.2rem",
              fontWeight: 600,
              color: "#1f2937",
            },
          }}
          subheader="Quản lý các khoản thu học phí, tài trợ, quyên góp, doanh thu kinh doanh"
          action={
            <Button
              variant="contained"
              sx={{
                bgcolor: "#1976d2",
                textTransform: "none",
                "&:hover": {
                  bgcolor: "#1565c0",
                },
              }}
            >
              + Thêm khoản thu
            </Button>
          }
        />
        <TableContainer
          component={Paper}
          className="overflow-hidden"
          sx={{ maxHeight: "calc(100vh - 500px)" }}
        >
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead sx={{ bgcolor: "#f8fafc" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, color: "#475569" }}>Mã GD</TableCell>
              <TableCell sx={{ fontWeight: 600, color: "#475569" }}>Ngày GD</TableCell>
              <TableCell sx={{ fontWeight: 600, color: "#475569" }}>Mô tả</TableCell>
              <TableCell sx={{ fontWeight: 600, color: "#475569" }}>Nguồn thu</TableCell>
              <TableCell sx={{ fontWeight: 600, color: "#475569" }}>Người đóng</TableCell>
              <TableCell sx={{ fontWeight: 600, color: "#475569" }}>Người tạo</TableCell>
              <TableCell sx={{ fontWeight: 600, color: "#475569" }}>Số tiền</TableCell>
              <TableCell align="center" sx={{ fontWeight: 600, color: "#475569" }}>
                Trạng thái
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 600, color: "#475569" }}>
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
                    className={`inline-flex items-center gap-1 text-white px-3 py-1 rounded-full text-xs font-medium ${
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
                    {item.orderStatus === "DELIVERED" && (
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                    {item.orderStatus === "DELIVERED" ? "Hoàn thành" : item.orderStatus}
                  </span>
                </TableCell>

                <TableCell align="center">
                  <IconButton
                    size="small"
                    sx={{
                      color: "#64748b",
                      "&:hover": {
                        bgcolor: "#f1f5f9",
                      },
                    }}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      </Card>

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