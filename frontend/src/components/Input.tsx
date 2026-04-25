type InputProps = {
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
};

function Input({ type = "text", placeholder, value, onChange, error }: InputProps) {
  return (
    <div className="w-full">
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        aria-invalid={Boolean(error)}
        className={`w-full rounded-md border-2 px-4 py-3 text-lg focus:outline-none ${
          error
            ? "border-red-500 bg-red-50"
            : "border-[#354254] bg-white"
        }`}
      />
      {error && <p className="mt-1 text-left text-sm text-red-600">{error}</p>}
    </div>
  );
}

export default Input;
