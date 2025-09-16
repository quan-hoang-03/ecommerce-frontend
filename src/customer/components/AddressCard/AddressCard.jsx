import React from "react";

const AddressCard = ({ onSelectAddress = () => {} }) => {
  const savedAddresses = [
    {
      name: "Raam Kapoor",
      address: "Mumbai, gokul dham market, 40001",
      phone: "9167459820",
    },
    {
      name: "Dev Dixit",
      address: "Mumbai, chincholi bandar, mind space, 400001",
      phone: "9087356787",
    },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold mb-3">Địa chỉ đã lưu</h2>
      {savedAddresses.map((addr, idx) => (
        <div
          key={idx}
          className="flex justify-between items-start border rounded-lg p-4 shadow-sm hover:shadow-md transition cursor-pointer"
        >
          <div className="flex-1">
            <h3 className="font-semibold">{addr.name}</h3>
            <p className="text-gray-600 text-sm mt-1">{addr.address}</p>
            <p className="text-gray-800 text-sm mt-1">
              <span className="font-medium">Phone Number</span>: {addr.phone}
            </p>
          </div>

          <div className="ml-4">
            <button
              className="px-4 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
              onClick={() => onSelectAddress(addr)}
            >
              Giao hàng tại đây
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AddressCard;
