import React from "react";

const Loading = () => {
  return (
    <div className="animate-pulse space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div key={item} className="bg-gray-200 rounded-xl p-6">
            <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
            <div className="h-8 bg-gray-300 rounded w-1/2 mb-3"></div>
            <div className="h-3 bg-gray-300 rounded w-full mb-2"></div>
            <div className="h-3 bg-gray-300 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Loading;