import React from "react";
import { NavLink } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";

const Sidebar = ({ onClose }) => {
  const navigation = [
    { name: "Dashboard", href: "/", icon: "LayoutDashboard" },
    { name: "Brief", href: "/brief", icon: "FileText" },
    { name: "Proposals", href: "/proposals", icon: "PresentationChart" },
    { name: "Timeline", href: "/timeline", icon: "Calendar" },
    { name: "Calendar", href: "/calendar", icon: "CalendarDays" },
    { name: "Tickets", href: "/tickets", icon: "AlertTriangle" },
    { name: "Documents", href: "/documents", icon: "FolderOpen" },
    { name: "Messages", href: "/messages", icon: "MessageSquare" },
    { name: "Payments", href: "/payments", icon: "CreditCard" },
  ];

  return (
    <div className="flex h-full w-64 flex-col bg-white border-r border-gray-200">
      {/* Logo */}
      <div className="flex h-16 items-center justify-between px-6 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-terracotta to-orange-500 rounded-lg flex items-center justify-center">
            <ApperIcon name="Home" className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-display font-bold text-midnight">RoomCraft</span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            <ApperIcon name="X" className="h-5 w-5 text-gray-600" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
{navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 space-x-3 ${
                isActive
                  ? "bg-gradient-to-r from-terracotta to-orange-500 text-white shadow-lg"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`
            }
          >
            <ApperIcon name={item.icon} className="h-5 w-5" />
            <span className="font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-700">
        <div className="bg-slate-700/50 rounded-lg p-3 text-center">
          <p className="text-xs text-slate-300">Need help?</p>
          <button className="text-sm text-terracotta hover:text-orange-300 transition-colors">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;