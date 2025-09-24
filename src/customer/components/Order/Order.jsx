import React from "react";
import OrderCard from "./OrderCard";
import "bootstrap/dist/css/bootstrap.min.css";


const OrdersPage = () => {
  return (
    <div className="container py-4">
      <div className="row align-items-stretch">
        {/* Filter Sidebar */}
        <div className="col-md-3 mb-4 mb-md-0">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h5 className="card-title mb-4">Filter</h5>

              <h6 className="fw-bold text-muted">Order Status</h6>
              <div className="form-check mb-2">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="onTheWay"
                />
                <label className="form-check-label" htmlFor="onTheWay">
                  On The Way
                </label>
              </div>
              <div className="form-check mb-2">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="delivered"
                />
                <label className="form-check-label" htmlFor="delivered">
                  Delivered
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="col-md-9">
          <div className="space-y-4">
            {[1,1].map((item)=> <OrderCard />)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
