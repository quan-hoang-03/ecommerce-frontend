// OrderCard.tsx
import { Grid } from "@mui/material";
import React from "react";
import nuochoa from "../../../assets/img/nuochoa.png";
import AdjustIcon from "@mui/icons-material/Adjust";
const orders = [
  {
    id: 1,
    name: "Men Slim Mid Rise Black Jeans",
    size: "M",
    color: "Black",
    price: 1099,
    status: "Delivered",
    date: "March 03, 2024",
  },
  {
    id: 2,
    name: "Blue T-Shirt",
    size: "L",
    color: "Blue",
    price: 799,
    status: "On the way",
    date: "March 05, 2024",
  },
  {
    id: 3,
    name: "Blue T-Shirt",
    size: "L",
    color: "Blue",
    price: 799,
    status: "On the way",
    date: "March 05, 2024",
  },
  {
    id: 4,
    name: "Blue T-Shirt",
    size: "L",
    color: "Blue",
    price: 799,
    status: "On the way",
    date: "March 05, 2024",
  },
];
const OrderCard = () => {
    return (
      <div className="card shadow-sm h-100">
        <div className="card-body">
          <div className="row g-4">
            {orders.map((order) => (
              <div className="col-md-6" key={order.id}>
                <div className="card shadow-sm h-100">
                  <div
                    className="d-flex align-items-center"
                    style={{ padding: "10px 15px" }}
                  >
                    {/* Ảnh sản phẩm */}
                    <div className="me-3">
                      <img
                        src={nuochoa}
                        alt={order.name}
                        className="img-fluid rounded"
                        style={{
                          width: "100px",
                          height: "100px",
                          objectFit: "cover",
                        }}
                      />
                    </div>

                    {/* Thông tin chi tiết */}
                    <div className="flex-grow-1">
                      <h6 className="fw-bold mb-1">{order.name}</h6>
                      <p className="text-muted mb-1">
                        Size: {order.size} | Color: {order.color}
                      </p>
                      <p className="text-muted mb-2">{order.date}</p>

                      <div className="d-flex justify-content-between align-items-center">
                        <span className="fw-bold text-primary">
                          ₹{order.price}
                        </span>
                        <span
                          className={`badge ${
                            order.status === "Delivered"
                              ? "bg-success"
                              : "bg-warning text-dark"
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
};

export default OrderCard;
