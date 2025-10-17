import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LabelList } from "recharts";
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
    <div className="p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Thống kê số lượng bán theo tháng
      </h2>

      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis
            label={{
              value: "Số lượng bán",
              angle: -90,
              position: "insideLeft",
            }}
          />
          <Tooltip />
          <Bar
            dataKey="quantity"
            name="Số lượng bán"
            fill="#3b82f6"
            barSize={50}
          >
            <LabelList dataKey="quantity" position="top" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Statistical;
