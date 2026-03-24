const API = "http://127.0.0.1:5000/api/classes";



// Get Class By ID
export async function getClassById(classId: number) {
  const res = await fetch(`${API}/one?class_id=${classId}`);

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to load class");
  }

  return data;
}