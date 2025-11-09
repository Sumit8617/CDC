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
}) => {
  console.log("Card Height", height);
  console.log("Card Width", width);

  const baseStyles =
    "rounded-2xl p-6 flex flex-col justify-center items-center text-center transition-all duration-300";

  const variants = {
    default: "bg-white shadow-md hover:shadow-lg",
    outlined:
      "border border-gray-200 bg-white hover:shadow-md hover:border-gray-300",
    hover:
      "bg-white shadow-sm hover:shadow-lg hover:-translate-y-1 hover:scale-[1.01]",
    gradient:
      "bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-lg hover:shadow-xl hover:brightness-105",
  };

  return (
    <div
      className={clsx(baseStyles, variants[variant], className)}
      style={{
        height:
          height.includes("rem") || height.includes("px")
            ? height
            : `${height}rem`,
        width:
          width.includes("rem") || width.includes("px") ? width : `${width}rem`,
      }}
    >
      {(icon || title) && (
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

      {description ? (
        <p
          className={clsx(
            "text-gray-600 text-sm leading-relaxed",
            variant === "gradient" && "text-indigo-100"
          )}
        >
          {description}
        </p>
      ) : (
        <div className="flex-1">{children}</div>
      )}

      {footer && <div className="mt-4">{footer}</div>}
    </div>
  );
};

export default Card;
