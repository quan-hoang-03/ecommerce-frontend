import React, { useState, useEffect } from "react";
import { Check } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import DeliveryAddressForm from "./DeliveryAddressForm";
import OrderSummary from "./OrderSummary";

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const querySearch = new URLSearchParams(location.search);
  const stepFromUrl = parseInt(querySearch.get("step")) || 1;

  const [step, setStep] = useState(stepFromUrl);

  // Thêm state lưu địa chỉ
  const [selectedAddress, setSelectedAddress] = useState("");

  const steps = ["Login", "Delivery Address", "Order Summary", "Payment"];

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set("step", step);
    navigate({ search: searchParams.toString() }, { replace: true });
  }, [step, location.search, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-2xl p-8">
        {/* Steps */}
        <div className="flex items-center justify-between mb-10">
          {steps.map((label, index) => {
            const isCompleted = step > index + 1;
            const isCurrent = step === index + 1;

            return (
              <div
                className="flex items-center w-full cursor-pointer"
                key={index}
              >
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full text-white font-semibold ${
                    isCompleted
                      ? "bg-green-500"
                      : isCurrent
                      ? "bg-purple-600"
                      : "bg-gray-300"
                  }`}
                >
                  {isCompleted ? <Check size={20} /> : index + 1}
                </div>
                <span
                  className={`ml-2 text-sm font-medium ${
                    isCompleted
                      ? "text-green-600"
                      : isCurrent
                      ? "text-purple-600"
                      : "text-gray-500"
                  }`}
                >
                  {label}
                </span>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${
                      step > index + 1 ? "bg-green-500" : "bg-gray-300"
                    }`}
                  ></div>
                )}
              </div>
            );
          })}
        </div>

        {/* Nội dung bước */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {step === 2 && (
            <DeliveryAddressForm
              onAddressSelected={(addr) => {
                setSelectedAddress(addr); // lưu lại địa chỉ
                setStep(3); // nhảy sang bước Order Summary
              }}
            />
          )}

          {step === 3 && <OrderSummary address={selectedAddress} />}
        </div>
      </div>
    </div>
  );
};

export default Checkout;
