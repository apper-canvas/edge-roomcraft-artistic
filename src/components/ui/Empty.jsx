import React from "react";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No items found", 
  description = "Get started by creating your first item",
  actionLabel = "Get Started",
  onAction,
  icon = "Package"
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="bg-gradient-to-br from-sky-100 to-sky-200 rounded-full p-6 mb-6">
        <ApperIcon name={icon} className="h-12 w-12 text-sky-600" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      <p className="text-gray-600 mb-6 text-center max-w-md">
        {description}
      </p>
      {onAction && (
        <Button onClick={onAction} variant="primary">
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default Empty;