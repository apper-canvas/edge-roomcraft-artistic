import React from "react";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ message = "Something went wrong", onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="bg-red-100 rounded-full p-4 mb-6">
        <ApperIcon name="AlertTriangle" className="h-8 w-8 text-red-600" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        Oops! Something went wrong
      </h3>
      <p className="text-gray-600 mb-6 text-center max-w-md">
        {message}
      </p>
      {onRetry && (
        <Button onClick={onRetry} variant="primary">
          <ApperIcon name="RotateCcw" className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      )}
    </div>
  );
};

export default Error;