type ClassCardProps = {
  id: number;
  name: string;
  code?: string;
  onView?: (id: number) => void;
};

function ClassCard({ id, name, code, onView }: ClassCardProps) {
  return (
    <div className="flex items-center border border-brand-primary rounded px-4 py-3 mb-3">
      {/* name */}
      <div className="w-1/3 text-lg font-semibold text-brand-primary">
        {name}
      </div>

      {/* class code */}
      <div className="w-1/3 text-center text-m font-bold text-gray-600">
        {code && `Class code: ${code}`}
      </div>

      {/* button */}
      <div className="w-1/3 flex justify-end">
        <button
          onClick={() => onView?.(id)}
          className="
            bg-brand-primary
            text-white
            px-4
            py-1
            rounded
            hover:bg-brand-primaryHover
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
