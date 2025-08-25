import React from "react";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const StatusCard = ({ 
  title, 
  value, 
  description, 
  status, 
  icon, 
  variant = "default" 
}) => {
  const variants = {
    default: "bg-gradient-to-br from-white to-gray-50",
    primary: "bg-gradient-to-br from-sky-50 to-sky-100",
    success: "bg-gradient-to-br from-green-50 to-green-100",
    warning: "bg-gradient-to-br from-yellow-50 to-yellow-100",
  };

  return (
    <Card className={`p-6 ${variants[variant]}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {icon && (
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <ApperIcon name={icon} className="h-5 w-5 text-midnight" />
            </div>
          )}
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <p className="text-2xl font-bold text-midnight">{value}</p>
          </div>
        </div>
        {status && (
          <Badge variant={status.type}>
            {status.label}
          </Badge>
        )}
      </div>
      {description && (
        <p className="mt-3 text-sm text-gray-600">{description}</p>
      )}
    </Card>
  );
};

export default StatusCard;