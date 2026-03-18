const API_BASE = "http://127.0.0.1:5000/api";

export async function loginUser(
  username: string,
  password: string
) {
  const res = await fetch(
    `${API_BASE}/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    }
  );

  const data = await res.json();

  console.log("LOGIN RESPONSE:", data); 

  if (!res.ok) {
    throw new Error(data.error || "Login failed");
  }

  return data;
}



export async function registerUser(
  username: string,
  full_name: string,
  email: string,
  password: string,
  role: string,
  teacher_code?: string
) {
  const response = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      username,
      full_name,
      email,
      password,
      role,
      teacher_code,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Register failed");
  }

  return data;
}