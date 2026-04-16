import { ReactNode, forwardRef } from "react";
import { motion, HTMLMotionProps } from "framer-motion";

export interface ButtonProps extends Omit<HTMLMotionProps<"button">, "ref" | "children"> {
  children?: ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "glass";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = "",
      variant = "primary",
      size = "md",
      isLoading = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseVariantStyles = {
      primary:
        "bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 border border-transparent shadow-[0_4px_14px_0_rgba(0,0,0,0.39)] dark:shadow-[0_4px_14px_0_rgba(255,255,255,0.39)]",
      secondary:
        "bg-gray-100 dark:bg-gray-800 text-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 border border-transparent",
      outline:
        "bg-transparent text-black dark:text-white border border-gray-300 dark:border-gray-700 hover:border-black dark:hover:border-white",
      ghost:
        "bg-transparent text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 border border-transparent",
      glass:
        "bg-white/20 dark:bg-black/20 backdrop-blur-md border border-white/20 dark:border-white/10 text-black dark:text-white shadow-lg hover:bg-white/30 dark:hover:bg-black/30",
    };

    const sizeStyles = {
      sm: "px-4 py-2 text-xs",
      md: "px-6 py-3 text-sm",
      lg: "px-8 py-4 text-base",
      icon: "p-3",
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
        whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
        className={`inline-flex items-center justify-center rounded-full font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none uppercase tracking-widest ${baseVariantStyles[variant]} ${sizeStyles[size]} ${className}`}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <svg
            className="animate-spin -ml-1 mr-3 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        ) : null}
        {children}
      </motion.button>
    );
  }
);

Button.displayName = "Button";
export default Button;
