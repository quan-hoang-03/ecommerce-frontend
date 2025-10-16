import { Avatar, Button, Card, CardHeader, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import React, { useEffect } from 'react'
import { findProduct } from '../../customer/State/Products/Action';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

const ProductsTable = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const decodedQueryString = decodeURIComponent(location.search);
    const searchParams = new URLSearchParams(decodedQueryString);
    const priceValue = searchParams.get("price");
    const pageNumber = Number(searchParams.get("page")) || 1;
    const {products} = useSelector((state) => state);
    console.log(products,"1111");
    useEffect(() => {
        const [minPrice, maxPrice] =
          priceValue === null ? [0, 0] : priceValue.split("-").map(Number);
      const data = {
        category: "mens_kurta",
        colors: "",
        size: "",
        minPrice,
        maxPrice,
        minDiscount: 0,
        sort: "price_low",
        pageNumber: pageNumber - 1,
        pageSize: 1,
        stock: "",
      };

      dispatch(findProduct(data));
    }, []);
    
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
              <TableCell sx={{ fontWeight: 600 }}>Ảnh</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Sản phẩm</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Danh mục</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Giá</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Số lượng</TableCell>
              <TableCell align='center' sx={{ fontWeight: 600 }}>Xóa</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {products.product?.content?.map((item) => (
              <TableRow
                key={item.name}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  "&:hover": { bgcolor: "#f9fafb" },
                  transition: "0.2s ease",
                }}
              >
                <TableCell align="center">
                  <Avatar
                    src={item.imageUrl}
                    alt={item.title}
                    sx={{
                      width: 50,
                      height: 50,
                      borderRadius: 2,
                      boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                    }}
                  />
                </TableCell>

                <TableCell align="left" scope="row">
                  <span className="font-medium text-gray-800">
                    {item.title}
                  </span>
                </TableCell>

                <TableCell align="left">
                  <span className="text-gray-600">{item.category.name}</span>
                </TableCell>

                <TableCell align="left">
                  <span className="text-green-600 font-semibold">
                    {item.price.toLocaleString("vi-VN")}
                  </span>
                </TableCell>

                <TableCell align="left">
                  <span className="text-gray-700">{item.quantity}</span>
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

export default ProductsTable