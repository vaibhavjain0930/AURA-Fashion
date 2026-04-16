import { forwardRef, InputHTMLAttributes } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", label, error, fullWidth = true, ...props }, ref) => {
    return (
      <div className={`flex flex-col space-y-1 ${fullWidth ? "w-full" : ""}`}>
        {label && (
          <label className="text-xs font-semibold tracking-widest uppercase text-gray-500 dark:text-gray-400">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`bg-transparent border-b border-gray-300 dark:border-gray-700 focus:border-black dark:focus:border-white outline-none py-2 px-1 transition-colors ${
            error ? "border-red-500 focus:border-red-500" : ""
          } ${className}`}
          {...props}
        />
        {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
