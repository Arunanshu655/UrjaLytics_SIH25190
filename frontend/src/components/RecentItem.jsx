import React from "react";
import { FileText } from "lucide-react";

/**
 * RecentItem Component
 * Displays a recent test entry in a list
 */
const RecentItem = ({ name, date, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer border border-gray-200"
    >
      <div className="flex items-start gap-2">
        <FileText className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
        <div className="min-w-0 flex-1">
          <div className="font-medium text-sm text-gray-800 truncate">
            {name}
          </div>
          <div className="text-xs text-gray-500">{date}</div>
        </div>
      </div>
    </div>
  );
};

export default RecentItem;
