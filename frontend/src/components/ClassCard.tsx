type ClassCardProps = {
  name: string;
  code?: string;
  onView?: () => void;
};

function ClassCard({ name, code, onView }: ClassCardProps) {
  return (
    <div className="flex items-center border border-[#354254] rounded px-4 py-3 mb-3">
      {/* LEFT — class name */}
      <div className="w-1/3 text-lg font-semibold text-[#354254]">{name}</div>

      {/* CENTER — class code */}
      <div className="w-1/3 text-center text-m font-bold text-gray-600">
        {code && `Class code: ${code}`}
      </div>

      {/* RIGHT — button */}
      <div className="w-1/3 flex justify-end">
        <button
          onClick={onView}
          className="
            bg-[#354254]
            text-white
            px-4
            py-1
            rounded
            hover:bg-[#2b3645]
            transition
          "
        >
          View
        </button>
      </div>
    </div>
  );
}

export default ClassCard;
