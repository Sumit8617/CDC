import React from "react";
import clsx from "clsx";

const Card = ({
  title,
  description,
  icon,
  footer,
  height = "auto",
  width = "full",
  variant = "default",
  className = "",
  children,
  round = "md",
  layout = "vertical",
  padding = "",
  margin = "",
  onClick, // <-- added
}) => {
  // Base layout styles
  const baseStyles = clsx(
    "transition-all duration-300",
    layout === "vertical"
      ? "flex flex-col justify-center items-center text-center"
      : "flex flex-row justify-between items-center text-left",
    padding,
    margin
  );

  const variants = {
    default: "bg-white shadow-md hover:shadow-lg",
    outlined:
      "border border-gray-200 bg-white hover:shadow-md hover:border-gray-300",
    hover:
      "bg-white shadow-sm hover:shadow-lg hover:-translate-y-1 hover:scale-[1.01]",
    gradient:
      "bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-lg hover:shadow-xl hover:brightness-105",
  };

  const rounds = {
    none: "rounded-none",
    sm: "rounded-md",
    md: "rounded-xl",
    lg: "rounded-2xl",
    full: "rounded-full",
  };

  return (
    <div
      className={clsx(baseStyles, variants[variant], rounds[round], className)}
      style={{
        height:
          height.includes("rem") || height.includes("px")
            ? height
            : height === "auto"
              ? "auto"
              : `${height}rem`,
        width:
          width.includes("rem") || width.includes("px") ? width : `${width}rem`,
      }}
      onClick={onClick} // <-- forwards onClick
      role={onClick ? "button" : undefined} // accessibility
      tabIndex={onClick ? 0 : undefined} // keyboard focus
      onKeyPress={(e) => {
        if (onClick && (e.key === "Enter" || e.key === " ")) onClick();
      }}
    >
      {/* Title + Icon section */}
      {(icon || title) && layout === "vertical" && (
        <div className="flex flex-col items-center mb-3">
          {icon && <div className="text-indigo-500 text-3xl mb-2">{icon}</div>}
          {title && (
            <h3
              className={clsx(
                "text-xl font-semibold leading-snug",
                variant === "gradient" && "text-white"
              )}
            >
              {title}
            </h3>
          )}
        </div>
      )}

      {/* Description or children */}
      {description && layout === "vertical" ? (
        <p
          className={clsx(
            "text-gray-600 text-sm leading-relaxed",
            variant === "gradient" && "text-indigo-100"
          )}
        >
          {description}
        </p>
      ) : (
        <div className="flex-1 w-full">{children}</div>
      )}

      {footer && <div className="mt-4">{footer}</div>}
    </div>
  );
};

export default Card;
