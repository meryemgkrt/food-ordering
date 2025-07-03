import React from "react";

const Title = ({
  children,
  className,
  size = "default",
  variant = "primary",
  align = "left",
  ...props
}) => {
  // Size variants
  const sizeClasses = {
    xs: "text-lg md:text-xl",
    sm: "text-xl md:text-2xl",
    default: "text-2xl md:text-3xl",
    lg: "text-3xl md:text-4xl",
    xl: "text-4xl md:text-5xl",
    "2xl": "text-5xl md:text-6xl",
    "3xl": "text-6xl md:text-7xl",
  };

  // Color variants
  const colorClasses = {
    primary: "text-primary",
    secondary: "text-secondary",
    white: "text-white",
    black: "text-black",
    warning: "text-warning",
    success: "text-success",
    danger: "text-danger",
    info: "text-info",
    gray: "text-gray-600",
    dark: "text-dark",
  };

  // Text alignment
  const alignClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  // Base classes with Dancing Script font
  const baseClasses = "font-dancing font-bold leading-tight tracking-wide";

  // Combine all classes
  const combinedClasses = `
    ${baseClasses}
    ${sizeClasses[size] || sizeClasses.default}
    ${colorClasses[variant] || colorClasses.primary}
    ${alignClasses[align] || alignClasses.left}
    ${className || ""}
  `
    .trim()
    .replace(/\s+/g, " ");

  return (
    <div className={combinedClasses} {...props}>
      {children}
    </div>
  );
};

export default Title;
