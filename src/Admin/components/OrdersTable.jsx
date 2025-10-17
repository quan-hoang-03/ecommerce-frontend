import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { confirmOrder, deleteOrder, deliveredOrder, getOrders, shipOrder } from '../../customer/State/Admin/Order/Action';
import {
  Avatar,
  AvatarGroup,
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
} from "@mui/material";
const OrdersTable = () => {
  const dispatch = useDispatch();

  const {adminOrder} = useSelector(store => store);
  console.log(adminOrder?.orders?.product,"dataaaaaa");

  useEffect(() => {
    dispatch(getOrders());
  }, [adminOrder.confirmed, adminOrder.shipped, adminOrder.delivered]);
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

   const [anchorEl, setAnchorEl] = React.useState(null);
   const open = Boolean(anchorEl);

   const handleClick = (event)=>{
    setAnchorEl(event.currentTarget);
   }

   const handleClose = () => {
     setAnchorEl(null);
   };
  return (
    <div className="p-5 bg-gray-50 min-h-screen">
      <Card className="mt-2 shadow-md rounded-2xl" sx={{ bgcolor: "white" }}>
        <CardHeader
          title="Danh sách sản phẩm"
          titleTypographyProps={{
            sx: {
              fontSize: "1.4rem",
              fontWeight: 600,
              color: "#1f2937",
            },
          }}
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
            {adminOrder?.orders?.map((item) => (
              <TableRow
                key={item.name}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  "&:hover": { bgcolor: "#f9fafb" },
                  transition: "0.2s ease",
                }}
              >
                <TableCell align="center">
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
                    aria-controls={open ? "basic-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? "true" : undefined}
                    onClick={handleClick}
                  >
                    Trạng thái
                  </Button>
                  <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
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
    </div>
  );
}

export default OrdersTable