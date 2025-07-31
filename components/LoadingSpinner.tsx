/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */

// components/LoadingSpinner.tsx
interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  color?: "primary" | "secondary" | "success" | "danger" | "warning";
  className?: string;
  fullScreen?: boolean;
  text?: string;
  textPosition?: "top" | "bottom" | "left" | "right";
}

export default function LoadingSpinner({
  size = "md",
  color = "primary",
  className = "",
  fullScreen = false,
  text,
  textPosition = "bottom",
}: LoadingSpinnerProps) {
  // Size classes
  const sizeClasses = {
    sm: "h-6 w-6 border-2",
    md: "h-8 w-8 border-2",
    lg: "h-12 w-12 border-[3px]",
    xl: "h-16 w-16 border-[3px]",
  };

  // Color classes
  const colorClasses = {
    primary: "border-t-blue-500 border-b-blue-500",
    secondary: "border-t-gray-500 border-b-gray-500",
    success: "border-t-green-500 border-b-green-500",
    danger: "border-t-red-500 border-b-red-500",
    warning: "border-t-yellow-500 border-b-yellow-500",
  };

  // Text position classes
  const textPositionClasses = {
    top: "flex-col-reverse",
    bottom: "flex-col",
    left: "flex-row-reverse",
    right: "flex-row",
  };

  // Combine classes manually
  const spinnerClasses = [
    "animate-spin rounded-full border-transparent",
    sizeClasses[size],
    colorClasses[color],
    className
  ].join(' ');

  const spinner = (
    <div className={spinnerClasses} />
  );

  if (text) {
    return (
      <div
        className={[
          "flex items-center justify-center gap-2",
          textPositionClasses[textPosition],
          fullScreen ? "h-screen w-screen" : "h-full w-full"
        ].join(' ')}
      >
        {spinner}
        <span className="text-sm text-gray-500">{text}</span>
      </div>
    );
  }

  return (
    <div
      className={[
        "flex items-center justify-center",
        fullScreen ? "h-screen w-screen" : "h-full w-full"
      ].join(' ')}
    >
      {spinner}
    </div>
  );
}