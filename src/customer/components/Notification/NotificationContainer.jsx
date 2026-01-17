import React from "react";
import Notification from "./Notification";

const NotificationContainer = ({ notifications, onRemove }) => {
  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50" style={{ maxWidth: '400px' }}>
      <div className="space-y-2">
        {notifications.map((notification, index) => (
          <div
            key={notification.id}
            style={{
              transform: `translateY(${index * 10}px)`,
              zIndex: 50 - index,
            }}
          >
            <Notification
              message={notification.message}
              type={notification.type}
              onClose={() => onRemove(notification.id)}
              duration={notification.duration}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationContainer;
