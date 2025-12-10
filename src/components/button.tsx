import React from "react";
import { cn } from "./utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonProps) {
  const variants = {
    primary: "bg-[#4F46E5] text-white hover:bg-[#4338CA]",
    secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300",
    outline: "border border-gray-300 text-gray-800 hover:bg-gray-100",
    ghost: "text-gray-700 hover:bg-gray-100",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      className={cn(
        "rounded-lg font-medium transition-all duration-200",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
}
