import React, { useState } from "react";
import { Check } from "lucide-react"; // icon từ lucide-react (npm install lucide-react)

const Checkout = () => {
  const [step, setStep] = useState(2); // đang ở bước Delivery Address

  const steps = ["Login", "Delivery Address", "Order Summary", "Payment"];

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-2xl p-8">
        {/* --- Progress Steps --- */}
        <div className="flex items-center justify-between mb-10">
          {steps.map((label, index) => {
            const isCompleted = step > index + 1;
            const isCurrent = step === index + 1;

            return (
              <div key={index} className="flex items-center w-full">
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

        {/* --- Nội dung bước (ví dụ: Delivery Address form) --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Saved Addresses */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold mb-3">Saved Addresses</h2>
            {[
              {
                name: "Raam Shah",
                address:
                  "mumbai, gokuldham market, new shivam building, 400001 mumbai maharastra",
                phone: "9038429384",
              },
              {
                name: "Dev Dixit",
                address:
                  "mumbai, chincholi bandar, mind space, 400001 mumbai maharastra",
                phone: "9087356787",
              },
            ].map((addr, idx) => (
              <div
                key={idx}
                className="border rounded-lg p-4 shadow-sm hover:shadow-md transition cursor-pointer"
              >
                <h3 className="font-semibold">{addr.name}</h3>
                <p className="text-gray-600 text-sm mt-1">{addr.address}</p>
                <p className="text-gray-800 text-sm mt-1">
                  Phone: {addr.phone}
                </p>
                <button className="mt-3 px-4 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
                  Deliver Here
                </button>
              </div>
            ))}
          </div>

          {/* New Address Form */}
          <div>
            <h2 className="text-lg font-semibold mb-3">Add New Address</h2>
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="First Name *"
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
                />
                <input
                  type="text"
                  placeholder="Last Name *"
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>
              <textarea
                placeholder="Address *"
                rows="3"
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="City *"
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
                />
                <input
                  type="text"
                  placeholder="State/Province/Region *"
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Zip / Postal Code *"
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
                />
                <input
                  type="text"
                  placeholder="Phone Number *"
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition"
              >
                Save & Deliver Here
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
