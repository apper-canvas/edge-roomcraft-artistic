import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Button = forwardRef(({ 
  children, 
  variant = "primary", 
  size = "md", 
  className,
  ...props 
}, ref) => {
  const variants = {
    primary: "bg-gradient-to-r from-terracotta to-orange-600 text-white hover:from-orange-600 hover:to-red-600 shadow-lg hover:shadow-xl",
    secondary: "bg-gradient-to-r from-sky to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl",
    outline: "border-2 border-midnight text-midnight hover:bg-midnight hover:text-white",
    ghost: "text-midnight hover:bg-gray-100",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-6 py-2.5 text-base",
    lg: "px-8 py-3.5 text-lg",
  };

  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 transform hover:scale-105",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;