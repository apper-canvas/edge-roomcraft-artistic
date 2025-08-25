import React from "react";
import { NavLink } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";

const Sidebar = ({ onClose }) => {
const navigation = [
    { name: "Dashboard", href: "/", icon: "Home" },
    { name: "Project Brief", href: "/brief", icon: "FileText" },
    { name: "Design Proposals", href: "/proposals", icon: "Palette" },
    { name: "Project Timeline", href: "/timeline", icon: "Calendar" },
    { name: "Site Visit Calendar", href: "/calendar", icon: "CalendarDays" },
    { name: "Messages", href: "/messages", icon: "MessageSquare" },
    { name: "Documents", href: "/documents", icon: "Folder" },
    { name: "Payments", href: "/payments", icon: "CreditCard" },
  ];

  return (
    <div className="w-64 h-full bg-gradient-to-b from-midnight to-slate-800 text-white flex flex-col shadow-xl">
      {/* Header */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-terracotta to-orange-500 rounded-lg">
              <ApperIcon name="Home" className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-display font-bold">RoomCraft</h1>
              <p className="text-xs text-slate-300">Interior Design</p>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden p-1 hover:bg-slate-700 rounded"
            >
              <ApperIcon name="X" className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-terracotta to-orange-500 text-white shadow-lg"
                  : "text-slate-300 hover:bg-slate-700 hover:text-white"
              }`
            }
            onClick={onClose}
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