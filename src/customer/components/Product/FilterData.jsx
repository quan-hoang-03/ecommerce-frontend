// Filters dùng checkbox (chọn nhiều)
export const filters = [
  {
    id: "colors",
    name: "Màu sắc",
    options: [
      { value: "Đen", label: "Đen" },
      { value: "Trắng", label: "Trắng" },
      { value: "Đỏ", label: "Đỏ" },
      { value: "Xanh dương", label: "Xanh dương" },
      { value: "Xanh lá", label: "Xanh lá" },
      { value: "Vàng", label: "Vàng" },
      { value: "Hồng", label: "Hồng" },
      { value: "Cam", label: "Cam" },
      { value: "Tím", label: "Tím" },
      { value: "Nâu", label: "Nâu" },
    ],
  },
  {
    id: "size",
    name: "Kích cỡ",
    options: [
      { value: "XS", label: "XS" },
      { value: "S", label: "S" },
      { value: "M", label: "M" },
      { value: "L", label: "L" },
      { value: "XL", label: "XL" },
      { value: "XXL", label: "XXL" },
      { value: "Free Size", label: "Free Size" },
    ],
  },
];

// Single filters dùng radio (chọn một)
export const singleFilters = [
  {
    id: "price",
    name: "Mức giá",
    options: [
      { value: "0-100000", label: "Dưới 100.000đ" },
      { value: "100000-300000", label: "100.000đ - 300.000đ" },
      { value: "300000-500000", label: "300.000đ - 500.000đ" },
      { value: "500000-1000000", label: "500.000đ - 1.000.000đ" },
      { value: "1000000-2000000", label: "1.000.000đ - 2.000.000đ" },
      { value: "2000000-5000000", label: "2.000.000đ - 5.000.000đ" },
      { value: "5000000-100000000", label: "Trên 5.000.000đ" },
    ],
  },
  {
    id: "discount",
    name: "Khuyến mãi",
    options: [
      { value: "10", label: "Giảm từ 10%" },
      { value: "20", label: "Giảm từ 20%" },
      { value: "30", label: "Giảm từ 30%" },
      { value: "40", label: "Giảm từ 40%" },
      { value: "50", label: "Giảm từ 50%" },
    ],
  },
];

// Sort options
export const sortOptions = [
  { name: "Giá: Thấp đến Cao", value: "price_low" },
  { name: "Giá: Cao đến Thấp", value: "price_high" },
  { name: "Mới nhất", value: "newest" },
  { name: "Bán chạy", value: "best_seller" },
];
