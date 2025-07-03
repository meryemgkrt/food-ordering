import React from "react";

const LoginInput = (props) => {
  const { type, errorMessage, touched, placeholder, value, ...inputProps } =
    props;

  return (
    <div className="w-full">
      <label className="relative block w-full cursor-text">
        <input
          type={type}
          value={value}
          className={`h-14 w-full border-2 rounded-md px-4 text-base outline-none peer transition-all duration-200
    ${type !== "datetime-local" && "pt-6"}
    ${
      touched && errorMessage
        ? "border-red-500 focus:border-red-500"
        : "border-gray-300 focus:border-primary"
    }
    focus:outline-none focus:ring-0
  `}
          placeholder=" "
          required
          {...inputProps}
        />

        {type !== "datetime-local" && (
          <span
            className={`absolute left-4 text-gray-500 text-sm transition-all duration-200 
              peer-placeholder-shown:top-[20px]
              peer-placeholder-shown:text-base 
              peer-placeholder-shown:text-gray-400 
              peer-focus:top-2 
              peer-focus:text-xs 
              peer-focus:text-primary
              ${value ? "top-2 text-xs text-primary" : ""}
            `}
          >
            {placeholder}
          </span>
        )}
      </label>

      {touched && errorMessage && (
        <p className="text-xs text-red-500 mt-1">{errorMessage}</p>
      )}
    </div>
  );
};

export default LoginInput;
