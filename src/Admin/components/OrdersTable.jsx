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

  // Hàm export ra Excel
  const handleExportToExcel = () => {
    // Lấy dữ liệu từ Redux store (đã được load từ API trong useEffect)
    const orders = adminOrder?.orders || [];
    
    if (!orders || orders.length === 0) {
      setSnackbar({
        open: true,
        message: "Không có dữ liệu để xuất!",
        severity: "warning",
      });
      return;
    }

    // Chuyển đổi dữ liệu đơn hàng thành định dạng Excel
    const excelData = [];
    
    adminOrder.orders.forEach((order) => {
      // Nếu đơn hàng có nhiều sản phẩm, mỗi sản phẩm là một dòng
      if (order.orderItems && order.orderItems.length > 0) {
        order.orderItems.forEach((orderItem, itemIndex) => {
          excelData.push({
            "Mã đơn hàng": order.id || "",
            "Tên người mua": `${order.user?.firstName || ""} ${order.user?.lastName || ""}`.trim() || "",
            "Sản phẩm": orderItem?.product?.title || "",
            "Giá đơn hàng (VND)": order.totalPrice || 0,
            "Số lượng": orderItem?.product?.quantity || 0,
            "Trạng thái": order.orderStatus || "",
            "Ghi chú": itemIndex === 0 ? "" : "Sản phẩm thêm trong đơn hàng"
          });
        });
      } else {
        // Nếu không có orderItems, vẫn tạo một dòng với thông tin đơn hàng
        excelData.push({
          "Mã đơn hàng": order.id || "",
          "Tên người mua": `${order.user?.firstName || ""} ${order.user?.lastName || ""}`.trim() || "",
          "Sản phẩm": "",
          "Giá đơn hàng (VND)": order.totalPrice || 0,
          "Số lượng": 0,
          "Trạng thái": order.orderStatus || "",
          "Ghi chú": ""
        });
      }
    });

    // Tạo worksheet từ dữ liệu
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    
    // Thiết lập độ rộng cột
    const columnWidths = [
      { wch: 15 }, // Mã đơn hàng
      { wch: 25 }, // Tên người mua
      { wch: 30 }, // Sản phẩm
      { wch: 18 }, // Giá đơn hàng
      { wch: 12 }, // Số lượng
      { wch: 15 }, // Trạng thái
      { wch: 30 }, // Ghi chú
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
              <TableCell align="center" sx={{ fontWeight: 600 }}>
                Ảnh
              </TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Sản phẩm</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Tên người mua</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Giá</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Số lượng</TableCell>
              <TableCell align="center" sx={{ fontWeight: 600 }}>
                Trạng thái
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 600 }}>
                Cập nhật trạng thái
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 600 }}>
                Thao tác
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {adminOrder?.orders?.map((item, index) => (
              <TableRow
                key={item.name}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  "&:hover": { bgcolor: "#f9fafb" },
                  transition: "0.2s ease",
                }}
              >
                <TableCell align="center" sx={{display:"flex",gap:"10px"}}>
                  {item?.orderItems?.map((orderItem) => (
                    <Avatar
                      src={orderItem.imageUrl}
                      alt={orderItem.title}
                      sx={{
                        width: 50,
                        height: 50,
                        borderRadius: 2,
                        boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                      }}
                    />
                  ))}
                </TableCell>

                <TableCell align="left" scope="row">
                  <span className="font-medium text-gray-800">
                    {item?.orderItems?.map((orderItem) => (
                      <p>{orderItem?.product?.title}</p>
                    ))}
                  </span>
                </TableCell>

                <TableCell align="left">
                  <span className="text-gray-600">
                    {item?.user?.firstName} {item?.user?.lastName}
                  </span>
                </TableCell>

                <TableCell align="left">
                  <span className="text-green-600 font-semibold">
                    {item?.totalPrice != null
                      ? item.totalPrice.toLocaleString("vi-VN")
                      : "0"}
                  </span>
                </TableCell>
                <TableCell align="center">
                  <span className="text-gray-700">
                    {item?.orderItems?.map((orderItem) => (
                      <p>{orderItem?.product?.quantity}</p>
                    ))}
                  </span>
                </TableCell>
                <TableCell align="left">
                  <span
                    className={`text-white px-5 py-2 rounded-full ${
                      item.orderStatus === "CONFIRMED"
                        ? "bg-[#369236]"
                        : item.orderStatus === "SHIPPED"
                        ? "bg-[#4141ff]"
                        : item.orderStatus === "PLACED"
                        ? "bg-[#02B290]"
                        : item.orderStatus === "PENDING"
                        ? "bg-gray-400"
                        : "bg-[#025720]"
                    }`}
                  >
                    {item.orderStatus}
                  </span>
                </TableCell>

                <TableCell align="center">
                  <Button
                    id="basic-button"
                    aria-haspopup="true"
                    onClick={(event) => handleClick(event, index)}
                    aria-controls={`basic-menu-${item.id}`}
                    aria-expanded={Boolean(anchorEl[index])}
                  >
                    Trạng thái
                  </Button>
                  <Menu
                    id={`basic-menu-${item.id}`}
                    anchorEl={anchorEl[index]}
                    open={Boolean(anchorEl[index])}
                    onClose={() => handleClose(index)}
                    slotProps={{
                      list: {
                        "aria-labelledby": "basic-button",
                      },
                    }}
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
                </TableCell>

                <TableCell align="center">
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    sx={{
                      borderRadius: "12px",
                      textTransform: "none",
                      fontWeight: 500,
                    }}
                    onClick={() => handleDeleteOrder(item.id)}
                  >
                    Xóa
                  </Button>
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