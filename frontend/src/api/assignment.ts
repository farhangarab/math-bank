const API = "http://127.0.0.1:5000/api/assignments";


// Get assignments by class
export async function getAssignments(classId: number) {
  const res = await fetch(`${API}?class_id=${classId}`);
  
  const data = await res.json();
  
  if (!res.ok) {
    throw new Error(data.error || "Failed to load assignments");
  }

  return data;
}


// Create assignment
export async function createAssignment(
  title: string,
  classId: number,
  dueDate?: string
) {
  const res = await fetch(`${API}/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title,
      class_id: classId,
      due_date: dueDate,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Create assignment failed");
  }

  return data;
}

