import React, { Fragment, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { createProduct, updateProduct, findProductById, resetProductState } from "../../customer/State/Products/Action";
import axios from "axios";
import { API_BASE_URL } from "../../config/apiConfig";
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
  Alert,
  CircularProgress,
  IconButton,
  Card,
  CardMedia,
} from "@mui/material";
import { navigation } from "../../customer/components/Navigation/navigationData";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const initialSizes = [
  { name: "S", quantity: 0 },
  { name: "M", quantity: 0 },
  { name: "L", quantity: 0 },
];

const CreateProductForm = () => {
  const { productId } = useParams();
  const isEditMode = !!productId;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { products } = useSelector((store) => store);
  const [loading, setLoading] = useState(false);
  const [loadingProduct, setLoadingProduct] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

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

  // Reset success state when component mounts or route changes
  useEffect(() => {
    dispatch(resetProductState()); // Reset Redux state
    setSuccess(false);
    setError("");
    setLoading(false);
  }, [productId, dispatch]); // Reset when productId changes (switch between create/edit)

  // Auto calculate discount percentage
  useEffect(() => {
    if (productData.price && productData.discountedPrice) {
      const price = parseFloat(productData.price);
      const discountedPrice = parseFloat(productData.discountedPrice);
      if (price > 0 && discountedPrice < price) {
        const discount = Math.round(((price - discountedPrice) / price) * 100);
        setProductData((prev) => ({
          ...prev,
          discountPersent: discount.toString(),
        }));
      }
    }
  }, [productData.price, productData.discountedPrice]);

  // Load product data if edit mode
  useEffect(() => {
    if (isEditMode && productId) {
      setLoadingProduct(true);
      const token = localStorage.getItem("jwt");
      axios
        .get(`${API_BASE_URL}/api/products/${productId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          const product = res.data;
          
          // Tìm category IDs từ category name trong navigation
          let topCategoryId = "";
          let secondCategoryId = "";
          let thirdCategoryId = "";
          
          if (product.category) {
            // Tìm category level 3 (category hiện tại)
            const categoryName = product.category.name;
            for (const cat of navigation.categories) {
              for (const section of cat.sections || []) {
                for (const item of section.items || []) {
                  if (item.name === categoryName || item.id === categoryName) {
                    thirdCategoryId = item.id;
                    secondCategoryId = section.id;
                    topCategoryId = cat.id;
                    break;
                  }
                }
                if (thirdCategoryId) break;
              }
              if (thirdCategoryId) break;
            }
            
            // Nếu không tìm thấy bằng name, thử tìm bằng cách traverse category tree
            if (!thirdCategoryId && product.category.parentCategory) {
              const secondLevel = product.category.parentCategory;
              const firstLevel = secondLevel?.parentCategory;
              
              // Tìm trong navigation
              for (const cat of navigation.categories) {
                if (firstLevel && (cat.name === firstLevel.name || cat.id === firstLevel.name)) {
                  topCategoryId = cat.id;
                  for (const section of cat.sections || []) {
                    if (secondLevel && (section.name === secondLevel.name || section.id === secondLevel.name)) {
                      secondCategoryId = section.id;
                      for (const item of section.items || []) {
                        if (item.name === categoryName || item.id === categoryName) {
                          thirdCategoryId = item.id;
                          break;
                        }
                      }
                      break;
                    }
                  }
                  break;
                }
              }
            }
          }
          
          setProductData({
            imageUrl: product.imageUrl ? `${API_BASE_URL}${product.imageUrl}` : "",
            brand: product.brand || "",
            title: product.title || "",
            color: product.colors || "",
            discountedPrice: product.discountPrice?.toString() || "",
            price: product.price?.toString() || "",
            discountPersent: product.discountPersent?.toString() || "",
            size: product.sizes && product.sizes.length > 0 
              ? product.sizes.map(s => ({ name: s.name, quantity: s.quantity }))
              : initialSizes,
            quantity: product.quantity?.toString() || "",
            topLavelCategory: topCategoryId || product.topLavelCategory || "",
            secondLavelCategory: secondCategoryId || product.secondLavelCategory || "",
            thirdLavelCategory: thirdCategoryId || product.thirdLavelCategory || "",
            description: product.description || "",
          });
          setLoadingProduct(false);
        })
        .catch((err) => {
          console.error("Lỗi khi load sản phẩm:", err);
          setError("Không thể tải thông tin sản phẩm");
          setLoadingProduct(false);
        });
    }
  }, [isEditMode, productId]);

  // Listen to product creation/update success
  useEffect(() => {
    if (products.success) {
      setSuccess(true);
      setLoading(false);
      // Chỉ tự động chuyển hướng khi tạo mới, không chuyển khi cập nhật
      if (!isEditMode) {
        setTimeout(() => {
          navigate("/admin/products");
        }, 2000);
      }
    }
    if (products.error) {
      setError(products.error);
      setLoading(false);
    }
  }, [products.success, products.error, navigate, products, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "topLavelCategory") {
      setProductData((prevData) => ({
        ...prevData,
        topLavelCategory: value,
        secondLavelCategory: "",
        thirdLavelCategory: "",
      }));
    } else if (name === "secondLavelCategory") {
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

  const addSize = () => {
    const newSize = { name: "", quantity: 0 };
    setProductData((prevData) => ({
      ...prevData,
      size: [...prevData.size, newSize],
    }));
  };

  const removeSize = (index) => {
    if (productData.size.length > 1) {
      const sizes = productData.size.filter((_, i) => i !== index);
      setProductData((prevData) => ({
        ...prevData,
        size: sizes,
      }));
    }
  };

  const validateForm = () => {
    // Chỉ validate ảnh khi tạo mới, không bắt buộc khi edit
    if (!isEditMode && !imageFile && !productData.imageUrl) {
      setError("Vui lòng chọn ảnh sản phẩm");
      return false;
    }
    if (!productData.brand.trim()) {
      setError("Vui lòng nhập thương hiệu");
      return false;
    }
    if (!productData.title.trim()) {
      setError("Vui lòng nhập tên sản phẩm");
      return false;
    }
    if (!productData.price || parseFloat(productData.price) <= 0) {
      setError("Vui lòng nhập giá gốc hợp lệ");
      return false;
    }
    if (!productData.topLavelCategory) {
      setError("Vui lòng chọn danh mục cấp 1");
      return false;
    }
    if (!productData.secondLavelCategory) {
      setError("Vui lòng chọn danh mục cấp 2");
      return false;
    }
    if (!productData.thirdLavelCategory) {
      setError("Vui lòng chọn danh mục cấp 3");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      
      // Prepare product data
      // Xử lý imageUrl: nếu là full URL thì chỉ lấy path, nếu không có ảnh mới thì giữ nguyên
      let imageUrlToSend = productData.imageUrl;
      if (imageUrlToSend && imageUrlToSend.startsWith(API_BASE_URL)) {
        // Nếu là full URL từ server, chỉ lấy path
        imageUrlToSend = imageUrlToSend.replace(API_BASE_URL, "");
      }
      
      const productPayload = {
        ...productData,
        imageUrl: imageUrlToSend || "", // Đảm bảo có imageUrl trong payload
        price: parseInt(productData.price),
        discountedPrice: productData.discountedPrice
          ? parseInt(productData.discountedPrice)
          : parseInt(productData.price),
        discountPersent: productData.discountPersent
          ? parseInt(productData.discountPersent)
          : 0,
        quantity: productData.quantity ? parseInt(productData.quantity) : 0,
        size: productData.size.map((s) => ({
          name: s.name,
          quantity: parseInt(s.quantity) || 0,
        })),
      };

      formData.append(
        "product",
        new Blob([JSON.stringify(productPayload)], {
          type: "application/json",
        })
      );

      // Chỉ append ảnh mới nếu có, nếu không có thì backend sẽ giữ ảnh cũ
      if (imageFile) {
        formData.append("image", imageFile);
      }
      // Nếu edit mode và không có ảnh mới, vẫn cần gửi imageUrl trong product payload
      // (đã được set trong productPayload ở trên)

      if (isEditMode) {
        await dispatch(updateProduct(productId, formData));
      } else {
        await dispatch(createProduct(formData));
      }
      // Nếu không có exception, đợi Redux state update
      // useEffect sẽ xử lý success/error từ products state
    } catch (err) {
      console.error("Error in handleSubmit:", err);
      const errorMessage = err.response?.data?.message || err.message || `Có lỗi xảy ra khi ${isEditMode ? 'cập nhật' : 'tạo'} sản phẩm`;
      setError(errorMessage);
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Kích thước ảnh không được vượt quá 5MB");
        return;
      }
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("File phải là hình ảnh");
        return;
      }
      setImageFile(file);
      setProductData((prev) => ({
        ...prev,
        imageUrl: URL.createObjectURL(file),
      }));
      setError("");
    }
  };

  const handleReset = () => {
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
    setError("");
    setSuccess(false);
  };

  // Lấy danh mục
  const categoryLevel1 = navigation.categories;
  const categoryLevel2 =
    navigation.categories.find((cat) => cat.id === productData.topLavelCategory)
      ?.sections || [];
  const categoryLevel3 =
    categoryLevel2.find((sec) => sec.id === productData.secondLavelCategory)
      ?.items || [];

  return (
    <Fragment>
      <Box
        sx={{
          backgroundColor: "#f8fafc",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          py: 4,
          px: 2,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            width: "100%",
            maxWidth: 1100,
            padding: { xs: 3, md: 4 },
            borderRadius: 4,
            backgroundColor: "#fff",
            border: "1px solid #e2e8f0",
            boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
          }}
        >
          {/* Header */}
          <Box sx={{ mb: 4, pb: 3, borderBottom: "2px solid #e2e8f0" }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                mb: 0.5,
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                fontSize: { xs: "1.75rem", md: "2rem" },
              }}
            >
              <AddIcon sx={{ fontSize: 32, color: "#667eea" }} />
              {isEditMode ? "Sửa sản phẩm" : "Thêm sản phẩm mới"}
            </Typography>
            <Typography variant="body2" sx={{ color: "#64748b", mt: 1 }}>
              {isEditMode 
                ? "Chỉnh sửa thông tin sản phẩm" 
                : "Điền thông tin chi tiết để thêm sản phẩm mới vào hệ thống"}
            </Typography>
          </Box>

          {/* Alerts */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError("")}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              {isEditMode ? "Cập nhật sản phẩm thành công!" : "Thêm sản phẩm thành công! Đang chuyển hướng..."}
            </Alert>
          )}

          {loadingProduct && (
            <Alert severity="info" sx={{ mb: 3 }}>
              Đang tải thông tin sản phẩm...
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
                gap: 3,
              }}
            >
              {/* Left Column */}
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {/* Image Upload */}
                <Box>
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 600, mb: 1.5, color: "#334155" }}
                  >
                    Hình ảnh sản phẩm
                  </Typography>
                  <Card
                    sx={{
                      border: "1.5px dashed #cbd5e1",
                      borderRadius: 2,
                      p: 3,
                      textAlign: "center",
                      backgroundColor: "#f8fafc",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      "&:hover": {
                        borderColor: "#667eea",
                        backgroundColor: "#f1f5f9",
                      },
                    }}
                    onClick={() => document.getElementById("image-upload")?.click()}
                  >
                    <input
                      type="file"
                      id="image-upload"
                      hidden
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                    {!productData.imageUrl ? (
                      <Box>
                        <CloudUploadIcon sx={{ fontSize: 40, color: "#94a3b8", mb: 1 }} />
                        <Typography variant="body2" sx={{ color: "#64748b", mb: 0.5 }}>
                          {imageFile ? imageFile.name : "Click để chọn ảnh"}
                        </Typography>
                        <Typography variant="caption" sx={{ color: "#94a3b8" }}>
                          PNG, JPG, GIF tối đa 5MB
                        </Typography>
                      </Box>
                    ) : (
                      <Box>
                        <CardMedia
                          component="img"
                          image={productData.imageUrl}
                          alt="Preview"
                          sx={{
                            maxWidth: "100%",
                            maxHeight: 250,
                            borderRadius: 1.5,
                            margin: "0 auto",
                            objectFit: "cover",
                            boxShadow: 2,
                          }}
                        />
                        <Button
                          variant="text"
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            document.getElementById("image-upload")?.click();
                          }}
                          sx={{ mt: 1, textTransform: "none" }}
                        >
                          Đổi ảnh
                        </Button>
                      </Box>
                    )}
                  </Card>
                </Box>

                {/* Basic Info Table */}
                <Box>
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 600, mb: 1.5, color: "#334155" }}
                  >
                    Thông tin cơ bản
                  </Typography>
                  <Box
                    component="table"
                    sx={{
                      width: "100%",
                      borderCollapse: "collapse",
                      "& tr": {
                        borderBottom: "1px solid #e2e8f0",
                      },
                      "& tr:last-child": {
                        borderBottom: "none",
                      },
                      "& td": {
                        padding: "12px 0",
                        verticalAlign: "middle",
                      },
                      "& td:first-of-type": {
                        width: "40%",
                        fontWeight: 500,
                        color: "#475569",
                        fontSize: "0.9rem",
                      },
                    }}
                  >
                    <tbody>
                      <tr>
                        <td>Thương hiệu *</td>
                        <td>
                          <TextField
                            fullWidth
                            size="small"
                            name="brand"
                            value={productData.brand}
                            onChange={handleChange}
                            required
                            variant="outlined"
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>Tên sản phẩm *</td>
                        <td>
                          <TextField
                            fullWidth
                            size="small"
                            name="title"
                            value={productData.title}
                            onChange={handleChange}
                            required
                            variant="outlined"
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>Màu sắc</td>
                        <td>
                          <TextField
                            fullWidth
                            size="small"
                            name="color"
                            value={productData.color}
                            onChange={handleChange}
                            variant="outlined"
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>Số lượng tổng</td>
                        <td>
                          <TextField
                            fullWidth
                            size="small"
                            name="quantity"
                            type="number"
                            value={productData.quantity}
                            onChange={handleChange}
                            variant="outlined"
                            inputProps={{ min: 0 }}
                          />
                        </td>
                      </tr>
                    </tbody>
                  </Box>
                </Box>

                {/* Pricing Table */}
                <Box>
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 600, mb: 1.5, color: "#334155" }}
                  >
                    Giá cả
                  </Typography>
                  <Box
                    component="table"
                    sx={{
                      width: "100%",
                      borderCollapse: "collapse",
                      "& tr": {
                        borderBottom: "1px solid #e2e8f0",
                      },
                      "& tr:last-child": {
                        borderBottom: "none",
                      },
                      "& td": {
                        padding: "12px 0",
                        verticalAlign: "middle",
                      },
                      "& td:first-of-type": {
                        width: "40%",
                        fontWeight: 500,
                        color: "#475569",
                        fontSize: "0.9rem",
                      },
                    }}
                  >
                    <tbody>
                      <tr>
                        <td>Giá gốc (VNĐ) *</td>
                        <td>
                          <TextField
                            fullWidth
                            size="small"
                            name="price"
                            type="number"
                            value={productData.price}
                            onChange={handleChange}
                            required
                            variant="outlined"
                            inputProps={{ min: 0 }}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>Giá khuyến mãi (VNĐ)</td>
                        <td>
                          <TextField
                            fullWidth
                            size="small"
                            name="discountedPrice"
                            type="number"
                            value={productData.discountedPrice}
                            onChange={handleChange}
                            variant="outlined"
                            inputProps={{ min: 0 }}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>Giảm giá (%)</td>
                        <td>
                          <TextField
                            fullWidth
                            size="small"
                            name="discountPersent"
                            type="number"
                            value={productData.discountPersent}
                            disabled
                            variant="outlined"
                            helperText="Tự động tính"
                            sx={{
                              "& .MuiInputBase-root": {
                                backgroundColor: "#f8fafc",
                              },
                            }}
                          />
                        </td>
                      </tr>
                    </tbody>
                  </Box>
                </Box>
              </Box>

              {/* Right Column */}
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {/* Categories */}
                <Box>
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 600, mb: 1.5, color: "#334155" }}
                  >
                    Danh mục sản phẩm
                  </Typography>
                  <Box
                    component="table"
                    sx={{
                      width: "100%",
                      borderCollapse: "collapse",
                      "& tr": {
                        borderBottom: "1px solid #e2e8f0",
                      },
                      "& tr:last-child": {
                        borderBottom: "none",
                      },
                      "& td": {
                        padding: "12px 0",
                        verticalAlign: "middle",
                      },
                      "& td:first-of-type": {
                        width: "40%",
                        fontWeight: 500,
                        color: "#475569",
                        fontSize: "0.9rem",
                      },
                    }}
                  >
                    <tbody>
                      <tr>
                        <td>Danh mục cấp 1 *</td>
                        <td>
                          <FormControl fullWidth size="small" variant="outlined" required>
                            <Select
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
                        </td>
                      </tr>
                      <tr>
                        <td>Danh mục cấp 2 *</td>
                        <td>
                          <FormControl
                            fullWidth
                            size="small"
                            variant="outlined"
                            required
                            disabled={!productData.topLavelCategory}
                          >
                            <Select
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
                        </td>
                      </tr>
                      <tr>
                        <td>Danh mục cấp 3 *</td>
                        <td>
                          <FormControl
                            fullWidth
                            size="small"
                            variant="outlined"
                            required
                            disabled={!productData.secondLavelCategory}
                          >
                            <Select
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
                        </td>
                      </tr>
                    </tbody>
                  </Box>
                </Box>

                {/* Description */}
                <Box>
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 600, mb: 1.5, color: "#334155" }}
                  >
                    Mô tả sản phẩm
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={6}
                    name="description"
                    value={productData.description}
                    onChange={handleChange}
                    variant="outlined"
                    placeholder="Nhập mô tả chi tiết về sản phẩm..."
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        fontSize: "0.9rem",
                      },
                    }}
                  />
                </Box>

                {/* Sizes */}
                <Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 1.5,
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 600, color: "#334155" }}
                    >
                      Kích cỡ & Số lượng
                    </Typography>
                    <Button
                      startIcon={<AddIcon />}
                      onClick={addSize}
                      variant="outlined"
                      size="small"
                      sx={{
                        textTransform: "none",
                        fontSize: "0.85rem",
                        py: 0.5,
                      }}
                    >
                      Thêm size
                    </Button>
                  </Box>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                    {productData.size.map((size, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: "flex",
                          gap: 1.5,
                          alignItems: "center",
                          p: 1.5,
                          border: "1px solid #e2e8f0",
                          borderRadius: 1.5,
                          backgroundColor: "#f8fafc",
                        }}
                      >
                        <TextField
                          size="small"
                          label="Size"
                          name="name"
                          value={size.name}
                          onChange={(e) => handleSizeChange(e, index)}
                          sx={{ flex: 1 }}
                          placeholder="S, M, L..."
                        />
                        <TextField
                          size="small"
                          label="Số lượng"
                          name="quantity"
                          type="number"
                          value={size.quantity}
                          onChange={(e) => handleSizeChange(e, index)}
                          sx={{ flex: 1 }}
                          inputProps={{ min: 0 }}
                        />
                        <IconButton
                          onClick={() => removeSize(index)}
                          color="error"
                          size="small"
                          disabled={productData.size.length === 1}
                          sx={{
                            "&:hover": {
                              backgroundColor: "#fee2e2",
                            },
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Box>
            </Box>

            {/* Action Buttons */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: 2,
                mt: 4,
                pt: 3,
                borderTop: "2px solid #e2e8f0",
                gridColumn: "1 / -1",
              }}
            >
              <Button
                type="button"
                variant="outlined"
                onClick={() => navigate("/admin/products")}
                size="large"
                disabled={loading}
                sx={{
                  px: 5,
                  py: 1.5,
                  textTransform: "none",
                  fontSize: "1rem",
                  fontWeight: 600,
                  borderRadius: 2,
                  borderColor: "#64748b",
                  color: "#475569",
                  "&:hover": {
                    borderColor: "#475569",
                    backgroundColor: "#f1f5f9",
                  },
                }}
              >
                <ArrowBackIcon sx={{ mr: 1 }} />
                Quay lại
              </Button>
              <Button
                type="button"
                variant="outlined"
                onClick={handleReset}
                size="large"
                disabled={loading}
                sx={{
                  px: 5,
                  py: 1.5,
                  textTransform: "none",
                  fontSize: "1rem",
                  fontWeight: 600,
                  borderRadius: 2,
                  borderColor: "#cbd5e1",
                  color: "#475569",
                  "&:hover": {
                    borderColor: "#94a3b8",
                    backgroundColor: "#f8fafc",
                  },
                }}
              >
                Đặt lại
              </Button>
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                sx={{
                  px: 6,
                  py: 1.5,
                  fontSize: "1rem",
                  fontWeight: 600,
                  borderRadius: 2,
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
                  textTransform: "none",
                  "&:hover": {
                    background: "linear-gradient(135deg, #5568d3 0%, #6a4190 100%)",
                    boxShadow: "0 6px 20px rgba(102, 126, 234, 0.6)",
                    transform: "translateY(-2px)",
                  },
                  "&:disabled": {
                    background: "#cbd5e1",
                    boxShadow: "none",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                    {loading ? (
                      <>
                        <CircularProgress size={20} sx={{ mr: 1, color: "#fff" }} />
                        Đang {isEditMode ? "cập nhật" : "tạo"}...
                      </>
                    ) : (
                      <>
                        <AddIcon sx={{ mr: 1 }} />
                        {isEditMode ? "Cập nhật sản phẩm" : "Thêm sản phẩm"}
                      </>
                    )}
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
    </Fragment>
  );
};

export default CreateProductForm;
