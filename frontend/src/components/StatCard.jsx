import React from "react";

/**
 * StatCard Component
 * Displays a statistic with label and value
 */
const StatCard = ({ icon: Icon, label, value, color = "blue" }) => {
  const colorMap = {
    blue: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      text: "text-blue-700",
      badge: "bg-blue-100",
    },
    green: {
      bg: "bg-green-50",
      border: "border-green-200",
      text: "text-green-700",
      badge: "bg-green-100",
    },
    red: {
      bg: "bg-red-50",
      border: "border-red-200",
      text: "text-red-700",
      badge: "bg-red-100",
    },
    purple: {
      bg: "bg-purple-50",
      border: "border-purple-200",
      text: "text-purple-700",
      badge: "bg-purple-100",
    },
  };

  const styles = colorMap[color] || colorMap.blue;

  return (
    <div
      className={`${styles.bg} rounded-xl border ${styles.border} p-4 shadow-sm hover:shadow-md transition-shadow`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-600 font-medium mb-1">{label}</p>
          <p className={`text-2xl font-bold ${styles.text}`}>{value}</p>
        </div>
        {Icon && (
          <div className={`${styles.badge} p-2 rounded-lg`}>
            <Icon className={`w-5 h-5 ${styles.text}`} />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
