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