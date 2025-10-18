import React, { Fragment, useState } from "react";
import { useDispatch } from "react-redux";
import { createProduct } from "../../customer/State/Products/Action";
import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Paper,
  Box,
  Divider,
} from "@mui/material";
import { navigation } from "../../customer/components/Navigation/navigationData";

const initialSizes = [
  { name: "S", quantity: 0 },
  { name: "M", quantity: 0 },
  { name: "L", quantity: 0 },
];

const CreateProductForm = () => {
  const [productData, setProductData] = useState({
    imageUrl: "",
    brand: "",
    title: "",
    color: "",
    discountedPrice: "",
    price: "",
    discountPersent: "",
    size: initialSizes,
    quantity: "",
    topLavelCategory: "",
    secondLavelCategory: "",
    thirdLavelCategory: "",
    description: "",
  });
  const [imageFile, setImageFile] = useState(null);

  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "topLavelCategory") {
      // Khi chọn cấp 1, reset cấp 2 và cấp 3
      setProductData((prevData) => ({
        ...prevData,
        topLavelCategory: value,
        secondLavelCategory: "",
        thirdLavelCategory: "",
      }));
    } else if (name === "secondLavelCategory") {
      // Khi chọn cấp 2, reset cấp 3
      setProductData((prevData) => ({
        ...prevData,
        secondLavelCategory: value,
        thirdLavelCategory: "",
      }));
    } else {
      setProductData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSizeChange = (e, index) => {
    const { name, value } = e.target;
    const sizes = [...productData.size];
    sizes[index][name] = value;
    setProductData((prevData) => ({
      ...prevData,
      size: sizes,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append(
      "product",
      new Blob([JSON.stringify(productData)], { type: "application/json" })
    );
    if (imageFile) {
      formData.append("image", imageFile);
    }

    dispatch(createProduct(formData));

    // Reset form
    setProductData({
      imageUrl: "",
      brand: "",
      title: "",
      color: "",
      discountedPrice: "",
      price: "",
      discountPersent: "",
      size: initialSizes,
      quantity: "",
      topLavelCategory: "",
      secondLavelCategory: "",
      thirdLavelCategory: "",
      description: "",
    });
    setImageFile(null);
  };


  // Lấy danh mục cấp 1
  const categoryLevel1 = navigation.categories;

  // Lấy danh mục cấp 2 dựa trên category cấp 1 đã chọn
  const categoryLevel2 =
    navigation.categories.find((cat) => cat.id === productData.topLavelCategory)
      ?.sections || [];

  // Lấy danh mục cấp 3 dựa trên category cấp 2 đã chọn
  const categoryLevel3 =
    categoryLevel2.find((sec) => sec.id === productData.secondLavelCategory)
      ?.items || [];

  return (
    <Fragment>
      <Box
        sx={{
          backgroundColor: "#f5f6fa",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          py: 6,
        }}
      >
        <Paper
          elevation={5}
          sx={{
            width: "100%",
            maxWidth: 1100,
            padding: "25px 60px",
            borderRadius: 4,
            backgroundColor: "#fff",
          }}
        >
          <Typography
            variant="h4"
            align="center"
            sx={{
              mb: 2,
              fontWeight: "bold",
              color: "#1976d2",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 1,
              marginBottom: 0,
            }}
          >
            Thêm sản phẩm mới
          </Typography>
          <Divider sx={{ mb: 4 }} />

          <form onSubmit={handleSubmit}>
            <Grid
              sx={{ display: "flex", flexDirection: "column", gap: "20px" }}
            >
              {/* Đường dẫn ảnh */}
              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  component="label"
                  fullWidth
                  sx={{ textTransform: "none" }}
                >
                  {imageFile ? imageFile.name : "Chọn ảnh sản phẩm"}
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setImageFile(file); // giữ file thật để gửi FormData
                        setProductData((prev) => ({
                          ...prev,
                          imageUrl: URL.createObjectURL(file), // chỉ để preview
                        }));
                      }
                    }}
                  />
                </Button>

                {/* Hiển thị ảnh xem trước */}
                {productData.imageUrl && (
                  <Box sx={{ mt: 2, textAlign: "center" }}>
                    <img
                      src={productData.imageUrl}
                      alt="preview"
                      style={{
                        maxWidth: "200px",
                        maxHeight: "200px",
                        borderRadius: "10px",
                        objectFit: "cover",
                      }}
                    />
                  </Box>
                )}
              </Grid>

              {/* Thương hiệu - Tên sản phẩm */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Thương hiệu"
                  name="brand"
                  value={productData.brand}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Tên sản phẩm"
                  name="title"
                  value={productData.title}
                  onChange={handleChange}
                />
              </Grid>

              {/* Màu sắc - Số lượng tổng */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Màu sắc"
                  name="color"
                  value={productData.color}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Số lượng tổng"
                  name="quantity"
                  type="number"
                  value={productData.quantity}
                  onChange={handleChange}
                />
              </Grid>

              {/* Giá gốc - Giá KM - % giảm */}
              <Grid spacing={2} sx={{ display: "flex", gap: "20px" }}>
                <div className="col-md-3">
                  <TextField
                    fullWidth
                    label="Giá gốc (VNĐ)"
                    name="price"
                    type="number"
                    value={productData.price}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-3">
                  <TextField
                    fullWidth
                    label="Giá khuyến mãi (VNĐ)"
                    name="discountedPrice"
                    type="number"
                    value={productData.discountedPrice}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-3">
                  <TextField
                    fullWidth
                    label="Phần trăm giảm giá (%)"
                    name="discountPersent"
                    type="number"
                    value={productData.discountPersent}
                    onChange={handleChange}
                  />
                </div>
              </Grid>

              {/* 3 Select: Danh mục cấp 1 - 2 - 3 */}
              <Grid spacing={2} sx={{ display: "flex", gap: "20px" }}>
                <div className="col-md-3">
                  <FormControl variant="outlined" fullWidth>
                    <InputLabel id="topLavelCategory-label">
                      Danh mục cấp 1
                    </InputLabel>
                    <Select
                      labelId="topLavelCategory-label"
                      label="Danh mục cấp 1"
                      name="topLavelCategory"
                      value={productData.topLavelCategory}
                      onChange={handleChange}
                    >
                      {categoryLevel1.map((item) => (
                        <MenuItem key={item.id} value={item.id}>
                          {item.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>

                <div className="col-md-3">
                  <FormControl variant="outlined" fullWidth>
                    <InputLabel id="secondLavelCategory-label">
                      Danh mục cấp 2
                    </InputLabel>
                    <Select
                      labelId="secondLavelCategory-label"
                      label="Danh mục cấp 2"
                      name="secondLavelCategory"
                      value={productData.secondLavelCategory}
                      onChange={handleChange}
                    >
                      {categoryLevel2.map((sec) => (
                        <MenuItem key={sec.id} value={sec.id}>
                          {sec.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>

                <div className="col-md-3">
                  <FormControl variant="outlined" fullWidth>
                    <InputLabel id="thirdLavelCategory-label">
                      Danh mục cấp 3
                    </InputLabel>
                    <Select
                      labelId="thirdLavelCategory-label"
                      label="Danh mục cấp 3"
                      name="thirdLavelCategory"
                      value={productData.thirdLavelCategory}
                      onChange={handleChange}
                    >
                      {categoryLevel3.map((item) => (
                        <MenuItem key={item.id} value={item.id}>
                          {item.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
              </Grid>

              {/* Mô tả */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Mô tả sản phẩm"
                  name="description"
                  value={productData.description}
                  onChange={handleChange}
                />
              </Grid>

              {/* Kích cỡ & số lượng */}
              <Grid item xs={12}>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, mt: 3, mb: 1, color: "#333" }}
                >
                  Kích cỡ & Số lượng
                </Typography>
              </Grid>

              {productData.size.map((size, index) => (
                <Grid
                  container
                  item
                  spacing={2}
                  key={index}
                  sx={{ pl: 2, pr: 2 }}
                >
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Size"
                      name="name"
                      value={size.name}
                      disabled
                      onChange={(e) => handleSizeChange(e, index)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Số lượng"
                      name="quantity"
                      type="number"
                      value={size.quantity}
                      onChange={(e) => handleSizeChange(e, index)}
                    />
                  </Grid>
                </Grid>
              ))}

              {/* Nút submit căn giữa */}
              <Grid item xs={12}>
                <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    sx={{
                      px: 6,
                      py: 1.8,
                      fontSize: "1rem",
                      fontWeight: 600,
                      borderRadius: 3,
                      background: "linear-gradient(90deg, #1976d2, #42a5f5)",
                      boxShadow: "0 4px 10px rgba(25,118,210,0.3)",
                      "&:hover": {
                        background: "linear-gradient(90deg, #1258a6, #1e88e5)",
                      },
                    }}
                  >
                    ➕ Thêm sản phẩm
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Box>
    </Fragment>
  );
};

export default CreateProductForm;
