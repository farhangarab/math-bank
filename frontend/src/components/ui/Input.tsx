import { useState } from "react";
import EyeIcon from "../icons/EyeIcon";
import EyeOffIcon from "../icons/EyeOffIcon";

type InputProps = {
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
};

function Input({ type = "text", placeholder, value, onChange, error }: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordInput = type === "password";
  const hasValue = (value?.length ?? 0) > 0;
  const inputType = isPasswordInput && hasValue && showPassword ? "text" : type;

  return (
    <div className="w-full">
      <div className="relative">
        <input
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          aria-invalid={Boolean(error)}
          className={`w-full rounded-md border-2 px-4 py-3 text-lg focus:outline-none ${
            isPasswordInput ? "pr-12" : ""
          } ${
            error
              ? "border-status-errorText bg-status-errorBg"
              : "border-brand-primary bg-white"
          }`}
        />
        {isPasswordInput && hasValue && (
          <button
            type="button"
            aria-label={showPassword ? "Hide password" : "Show password"}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-black focus:outline-none"
          >
            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        )}
      </div>
      {error && (
        <p className="mt-1 text-left text-sm text-status-errorText">{error}</p>
      )}
    </div>
  );
}

export default Input;
