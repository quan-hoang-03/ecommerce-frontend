import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LabelList } from "recharts";
import { Box, Typography } from "@mui/material";
import { API_BASE_URL } from "../../config/apiConfig";


const Statistical = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    fetch(`${API_BASE_URL}/api/admin/sales-statistics`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <Box>
      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          mb: 5,
          textAlign: "center",
          color: "#111827",
          fontSize: "1.75rem",
          letterSpacing: "-0.5px",
        }}
      >
        Thống kê số lượng bán theo tháng
      </Typography>

      <ResponsiveContainer width="100%" height={450}>
        <BarChart 
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="#e5e7eb" 
            vertical={false}
          />
          <XAxis 
            dataKey="month" 
            tick={{ fill: "#6b7280", fontSize: 13, fontWeight: 500 }}
            axisLine={{ stroke: "#d1d5db", strokeWidth: 1 }}
            tickLine={{ stroke: "#d1d5db" }}
          />
          <YAxis
            tick={{ fill: "#6b7280", fontSize: 13, fontWeight: 500 }}
            axisLine={{ stroke: "#d1d5db", strokeWidth: 1 }}
            tickLine={{ stroke: "#d1d5db" }}
            label={{
              value: "Số lượng bán",
              angle: -90,
              position: "insideLeft",
              style: { 
                textAnchor: "middle", 
                fill: "#6b7280",
                fontSize: "14px",
                fontWeight: 600,
              },
              offset: -10,
            }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              padding: "12px",
            }}
            cursor={{ fill: "rgba(59,130,246,0.1)" }}
          />
          <Bar
            dataKey="quantity"
            name="Số lượng bán"
            fill="url(#colorGradient)"
            radius={[12, 12, 0, 0]}
            barSize={60}
          >
            <LabelList 
              dataKey="quantity" 
              position="top" 
              fill="#374151"
              fontSize={13}
              fontWeight={600}
            />
          </Bar>
          <defs>
            <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity={1} />
              <stop offset="100%" stopColor="#2563eb" stopOpacity={1} />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default Statistical;
