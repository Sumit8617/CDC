import React from "react";
import { useFormContext } from "react-hook-form";

const Input = ({
  name,
  label,
  type = "text",
  placeholder,
  rules = {},
  className = "",
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = errors[name]?.message;

  return (
    <div className="flex flex-col gap-1 mb-4">
      {label && (
        <label
          htmlFor={name}
          className={`text-sm font-medium text-gray-700 ${className}`}
        >
          {label}
        </label>
      )}

      <input
        id={name}
        type={type}
        placeholder={placeholder}
        {...register(name, rules)}
        className={`border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${error ? "border-red-500" : "border-gray-300"} ${className}`}
      />

      {error && <span className="text-sm text-red-500">{error}</span>}
    </div>
  );
};

export default Input;
