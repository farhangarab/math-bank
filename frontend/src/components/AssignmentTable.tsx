type Assignment = {
  id: number;
  title: string;
  due_date?: string;
  score?: number;
};

type Props = {
  assignments: Assignment[];
  role: "STUDENT" | "TEACHER";
  onOpen?: (id: number) => void; // submissions or start
  onEdit?: (id: number) => void; // edit assignment
};

// ✅ format date like: Feb 8 by 11:59pm
function formatDueDate(dateStr?: string) {
  if (!dateStr) return "-";

  const d = new Date(dateStr);

  const month = d.toLocaleString("en-US", {
    month: "short",
  });

  const day = d.getDate();

  let hours = d.getHours();
  const minutes = d.getMinutes().toString().padStart(2, "0");

  const ampm = hours >= 12 ? "pm" : "am";

  hours = hours % 12;
  if (hours === 0) hours = 12;

  return `${month} ${day} by ${hours}:${minutes}${ampm}`;
}

function AssignmentTable({ assignments, role, onOpen, onEdit }: Props) {
  return (
    <div className="w-full">
      {/* HEADER */}
      <div
        className="grid border-b border-[#354254] pb-2 font-semibold text-[#354254]"
        style={{
          gridTemplateColumns:
            role === "STUDENT" ? "2fr 2fr 1fr 1fr" : "2fr 2fr 1fr 1fr",
        }}
      >
        <div>Name</div>

        <div>Due</div>

        {role === "STUDENT" && (
          <>
            {/* <div>Submitted</div> */}
            {/* <div>Status</div> */}
            <div>Score</div>
            <div></div>
          </>
        )}

        {role === "TEACHER" && (
          <>
            <div></div>
            <div></div>
          </>
        )}
      </div>

      {/* ROWS */}
      {assignments.map((a) => (
        <div
          key={a.id}
          className="grid border-b border-gray-300 py-3 items-center"
          style={{
            gridTemplateColumns:
              role === "STUDENT" ? "2fr 2fr 1fr 1fr" : "2fr 2fr 1fr 1fr",
          }}
        >
          {/* NAME */}
          <div className="text-[#354254]">{a.title}</div>

          {/* DUE */}
          <div>{formatDueDate(a.due_date)}</div>

          {/* STUDENT */}
          {role === "STUDENT" && (
            <>
              {/* <div>Feb 4</div> */}
              {/* <div>✓</div> */}

              <div>{a.score ?? "-"}</div>

              <div className="flex justify-end">
                <button
                  onClick={() => onOpen?.(a.id)}
                  className="
                    bg-[#354254]
                    text-white
                    px-4
                    py-1
                    rounded
                    hover:bg-[#2b3645]
                  "
                >
                  Start
                </button>
              </div>
            </>
          )}

          {/* TEACHER */}
          {role === "TEACHER" && (
            <>
              <div className="flex justify-end">
                <button
                  onClick={() => onEdit?.(a.id)}
                  className="
                    border
                    border-[#354254]
                    text-[#354254]
                    px-3
                    py-1
                    rounded
                    hover:bg-gray-100
                  "
                >
                  Edit
                </button>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => onOpen?.(a.id)}
                  className="
                    bg-[#354254]
                    text-white
                    px-3
                    py-1
                    rounded
                    hover:bg-[#2b3645]
                  "
                >
                  Submissions
                </button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default AssignmentTable;
