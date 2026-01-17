import React from "react";
import { AlertTriangle, X } from "lucide-react";

const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Xác nhận", 
  message, 
  confirmText = "Xác nhận",
  cancelText = "Hủy",
  type = "warning" // warning, danger, info
}) => {
  if (!isOpen) return null;

  const getColors = () => {
    switch (type) {
      case "danger":
        return {
          bg: "bg-red-50",
          border: "border-red-200",
          icon: "text-red-500",
          button: "bg-red-600 hover:bg-red-700"
        };
      case "info":
        return {
          bg: "bg-blue-50",
          border: "border-blue-200",
          icon: "text-blue-500",
          button: "bg-blue-600 hover:bg-blue-700"
        };
      default:
        return {
          bg: "bg-yellow-50",
          border: "border-yellow-200",
          icon: "text-yellow-500",
          button: "bg-yellow-600 hover:bg-yellow-700"
        };
    }
  };

  const colors = getColors();

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={onClose}
    >
      <div 
        className={`${colors.bg} ${colors.border} border-2 rounded-lg shadow-xl max-w-md w-full mx-4`}
        onClick={(e) => e.stopPropagation()}
        style={{ animation: "fadeIn 0.2s ease-out" }}
      >
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className={`flex-shrink-0 ${colors.icon}`}>
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {title}
              </h3>
              <p className="text-gray-700">
                {message}
              </p>
            </div>
            <button
              onClick={onClose}
              className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex gap-3 mt-6 justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              {cancelText}
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`px-4 py-2 text-sm font-medium text-white ${colors.button} rounded-lg transition`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default ConfirmModal;
