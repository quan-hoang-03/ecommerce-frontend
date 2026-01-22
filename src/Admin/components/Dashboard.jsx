import { Box, Typography, Card, CardContent, Avatar, CircularProgress } from "@mui/material";
import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../../config/apiConfig";
import axios from "axios";
import { formatPrice } from "../../utils/formatPrice";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Line,
  AreaChart,
  Area,
  Legend,
} from "recharts";

// Icons
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import SpeedIcon from "@mui/icons-material/Speed";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalProducts: 0,
    totalRevenue: 0,
    totalSalesQuantity: 0,
    totalOrders: 0,
  });
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("jwt");
        const response = await axios.get(`${API_BASE_URL}/api/admin/overview-statistics`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setStats({
          totalCustomers: response.data.totalCustomers || 0,
          totalProducts: response.data.totalProducts || 0,
          totalRevenue: response.data.totalRevenue || 0,
          totalSalesQuantity: response.data.totalSalesQuantity || 0,
          totalOrders: response.data.totalOrders || 0,
        });
      } catch (error) {
        console.error("Lỗi khi tải thống kê:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchChartData = async () => {
      try {
        const token = localStorage.getItem("jwt");
        const response = await axios.get(`${API_BASE_URL}/api/admin/monthly-sales`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data && Array.isArray(response.data)) {
          // Map dữ liệu từ backend (sales là số tiền, orders là số đơn)
          const mappedData = response.data.map(item => ({
            month: item.month,
            sales: typeof item.sales === 'number' ? item.sales : 0,
            orders: typeof item.orders === 'number' ? item.orders : 0,
          }));
          
          // Sắp xếp lại theo thứ tự tháng (T1, T2, T3... T12) thay vì alphabet
          const sortedData = mappedData.sort((a, b) => {
            const monthA = parseInt(a.month.replace('T', ''));
            const monthB = parseInt(b.month.replace('T', ''));
            return monthA - monthB;
          });
          
          setChartData(sortedData);
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu biểu đồ:", error);
        // Sample data if API fails
        setChartData([
          { month: "T1", sales: 0, orders: 0 },
          { month: "T2", sales: 0, orders: 0 },
          { month: "T3", sales: 0, orders: 0 },
          { month: "T4", sales: 0, orders: 0 },
          { month: "T5", sales: 0, orders: 0 },
          { month: "T6", sales: 0, orders: 0 },
          { month: "T7", sales: 0, orders: 0 },
          { month: "T8", sales: 0, orders: 0 },
          { month: "T9", sales: 0, orders: 0 },
          { month: "T10", sales: 0, orders: 0 },
          { month: "T11", sales: 0, orders: 0 },
          { month: "T12", sales: 0, orders: 0 },
        ]);
      }
    };

    fetchStats();
    fetchChartData();
  }, []);

  const formatNumber = (num) => {
    if (!num) return "0";
    return num.toLocaleString("vi-VN");
  };

  const formatCurrency = (amount) => {
    return formatPrice(amount);
  };
  
  // Giữ lại hàm format cũ để tương thích (nếu có dùng ở đâu đó)
  const formatCurrencyOld = (amount) => {
    if (!amount) return "0đ";
    if (amount >= 1000000000) {
      return (amount / 1000000000).toFixed(1) + "B đ";
    } else if (amount >= 1000000) {
      return (amount / 1000000).toFixed(1) + "M đ";
    } else if (amount >= 1000) {
      return (amount / 1000).toFixed(1) + "K đ";
    }
    return amount.toLocaleString("vi-VN") + " đ";
  };

  // Stat cards data
  const statCards = [
    {
      title: "DOANH THU",
      value: formatPrice(stats.totalRevenue),
      icon: <TrendingUpIcon sx={{ fontSize: 24 }} />,
      iconBg: "#ef4444",
      change: "+3.48%",
      changeType: "up",
      changeText: "So với tháng trước",
    },
    {
      title: "KHÁCH HÀNG",
      value: formatNumber(stats.totalCustomers),
      icon: <PersonAddIcon sx={{ fontSize: 24 }} />,
      iconBg: "#f97316",
      change: "+2.56%",
      changeType: "up",
      changeText: "So với tuần trước",
    },
    {
      title: "ĐƠN HÀNG",
      value: formatNumber(stats.totalOrders || stats.totalSalesQuantity),
      icon: <ShoppingCartIcon sx={{ fontSize: 24 }} />,
      iconBg: "#ec4899",
      change: "+1.10%",
      changeType: "up",
      changeText: "So với hôm qua",
    },
    {
      title: "SẢN PHẨM",
      value: formatNumber(stats.totalProducts),
      icon: <SpeedIcon sx={{ fontSize: 24 }} />,
      iconBg: "#3b82f6",
      change: "+12%",
      changeType: "up",
      changeText: "So với tháng trước",
    },
  ];

  // Order chart data for bar chart - sử dụng dữ liệu thực từ chartData
  const orderChartData = chartData.length > 0 ? chartData
    .map(item => ({
      month: item.month,
      value2024: item.orders || 0, // Sử dụng orders cho năm hiện tại
      value2025: item.orders || 0,  // Có thể tính toán dựa trên dữ liệu thực tế
    }))
    .sort((a, b) => {
      const monthA = parseInt(a.month.replace('T', ''));
      const monthB = parseInt(b.month.replace('T', ''));
      return monthA - monthB;
    }) : [
    { month: "T1", value2024: 0, value2025: 0 },
    { month: "T2", value2024: 0, value2025: 0 },
    { month: "T3", value2024: 0, value2025: 0 },
    { month: "T4", value2024: 0, value2025: 0 },
    { month: "T5", value2024: 0, value2025: 0 },
    { month: "T6", value2024: 0, value2025: 0 },
    { month: "T7", value2024: 0, value2025: 0 },
    { month: "T8", value2024: 0, value2025: 0 },
    { month: "T9", value2024: 0, value2025: 0 },
    { month: "T10", value2024: 0, value2025: 0 },
    { month: "T11", value2024: 0, value2025: 0 },
    { month: "T12", value2024: 0, value2025: 0 },
  ];

  return (
    <Box sx={{ p: 3, bgcolor: "#eef2f6", minHeight: "100vh" }}>
      {/* Stats Cards */}
      <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
        {statCards.map((card, index) => (
          <Card
            key={index}
            sx={{
              bgcolor: "#fff",
              borderRadius: 2,
              boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
              border: "none",
              overflow: "visible",
              position: "relative",
              flex: "1 1 calc(25% - 12px)",
              minWidth: 220,
            }}
          >
              <CardContent sx={{ p: 3, pb: "24px !important" }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <Box>
                    <Typography
                      sx={{
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        color: "#64748b",
                        letterSpacing: "0.5px",
                        mb: 1,
                      }}
                    >
                      {card.title}
                    </Typography>
                    {loading ? (
                      <CircularProgress size={24} />
                    ) : (
                      <Typography
                        sx={{
                          fontSize: "1.5rem",
                          fontWeight: 700,
                          color: "#1e293b",
                          lineHeight: 1.2,
                        }}
                      >
                        {card.value}
                      </Typography>
                    )}
                  </Box>
                  <Avatar
                    sx={{
                      bgcolor: card.iconBg,
                      width: 48,
                      height: 48,
                      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    }}
                  >
                    {card.icon}
                  </Avatar>
                </Box>
                <Box sx={{ mt: 2, display: "flex", alignItems: "center", gap: 0.5 }}>
                  {card.changeType === "up" ? (
                    <ArrowUpwardIcon sx={{ fontSize: 16, color: "#10b981" }} />
                  ) : (
                    <ArrowDownwardIcon sx={{ fontSize: 16, color: "#ef4444" }} />
                  )}
                  <Typography
                    sx={{
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      color: card.changeType === "up" ? "#10b981" : "#ef4444",
                    }}
                  >
                    {card.change}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "0.75rem",
                      color: "#64748b",
                      ml: 0.5,
                    }}
                  >
                    {card.changeText}
                  </Typography>
                </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Charts Row */}
      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
        {/* Left Chart - Sales Value (Line Chart with dark background) */}
        <Card
          sx={{
            bgcolor: "#1e2a3a",
            borderRadius: 2,
            boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
            overflow: "hidden",
            flex: "1 1 calc(50% - 8px)",
            minWidth: 400,
          }}
        >
            <CardContent sx={{ p: 3 }}>
              <Typography
                sx={{
                  fontSize: "0.7rem",
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.6)",
                  letterSpacing: "1px",
                  mb: 0.5,
                }}
              >
                TỔNG QUAN
              </Typography>
              <Typography
                sx={{
                  fontSize: "1.25rem",
                  fontWeight: 600,
                  color: "#fff",
                  mb: 3,
                }}
              >
                Doanh số bán hàng
              </Typography>

              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={chartData.length > 0 ? chartData : orderChartData}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 12 }}
                    axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 12 }}
                    axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "8px",
                      color: "#fff",
                    }}
                  />
                  <Legend
                    wrapperStyle={{
                      paddingTop: "20px",
                    }}
                    iconType="line"
                    formatter={(value) => <span style={{ color: "rgba(255,255,255,0.8)", fontSize: "12px" }}>{value}</span>}
                  />
                  <Area
                    type="monotone"
                    dataKey="sales"
                    stroke="#818cf8"
                    strokeWidth={3}
                    fill="url(#colorSales)"
                    name="Doanh số (VNĐ)"
                  />
                  <Line
                    type="monotone"
                    dataKey="orders"
                    stroke="#fff"
                    strokeWidth={2}
                    dot={{ fill: "#fff", strokeWidth: 2, r: 4 }}
                    name="Số đơn hàng"
                  />
                </AreaChart>
              </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Right Chart - Total Orders (Bar Chart) */}
        <Card
          sx={{
            bgcolor: "#fff",
            borderRadius: 2,
            boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
            flex: "1 1 calc(50% - 8px)",
            minWidth: 400,
          }}
        >
            <CardContent sx={{ p: 3, height: "100%" }}>
              <Typography
                sx={{
                  fontSize: "0.7rem",
                  fontWeight: 600,
                  color: "#64748b",
                  letterSpacing: "1px",
                  mb: 0.5,
                }}
              >
                HIỆU SUẤT
              </Typography>
              <Typography
                sx={{
                  fontSize: "1.25rem",
                  fontWeight: 600,
                  color: "#1e293b",
                  mb: 3,
                }}
              >
                Tổng đơn hàng
              </Typography>

              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={orderChartData} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: "#64748b", fontSize: 11 }}
                    axisLine={{ stroke: "#e5e7eb" }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "#64748b", fontSize: 11 }}
                    axisLine={{ stroke: "#e5e7eb" }}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend
                    wrapperStyle={{
                      paddingTop: "10px",
                    }}
                    iconType="square"
                    formatter={(value) => <span style={{ color: "#64748b", fontSize: "12px" }}>{value}</span>}
                  />
                  <Bar
                    dataKey="value2024"
                    name="Năm 2024"
                    fill="#ec4899"
                    radius={[4, 4, 0, 0]}
                    barSize={16}
                  />
                  <Bar
                    dataKey="value2025"
                    name="Năm 2025"
                    fill="#6366f1"
                    radius={[4, 4, 0, 0]}
                    barSize={16}
                  />
                </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
