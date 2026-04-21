import type { Assignment } from "../types/assignment";

const API = "http://127.0.0.1:5000/api/assignments";


// Get assignments by class
export async function getAssignments(
  classId: number,
  studentId?: number
): Promise<Assignment[]> {
  let url = `${API}/?class_id=${classId}`;

  if (studentId) {
    url += `&student_id=${studentId}`;
  }
  
  const res = await fetch(url);
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

//Get assignment by id
export async function getAssignmentById(id: number) {
  const res = await fetch(
    `${API}/one?id=${id}`
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed");
  }

  return data;
}

//Get submission for each student
export async function getAssignmentAttempts(assignmentId: number) {
  console.log("this is the assign",assignmentId);
  
  const res = await fetch(`${API}/${assignmentId}/attempts`);
  
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to load submissions");
  }

  return data;
}