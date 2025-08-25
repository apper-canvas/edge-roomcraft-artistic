import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Header = ({ onMenuClick }) => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            <ApperIcon name="Menu" className="h-5 w-5 text-gray-600" />
          </button>
          
          <div>
            <h1 className="text-2xl font-display font-bold text-midnight">
              Modern Apartment Redesign
            </h1>
            <p className="text-sm text-gray-600">
              Project ID: RC-2024-001 • Started March 15, 2024
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-green-50 px-3 py-2 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-green-700">
              Design Phase
            </span>
          </div>
          
          <Button variant="outline" size="sm">
            <ApperIcon name="Bell" className="h-4 w-4 mr-2" />
            Notifications
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;