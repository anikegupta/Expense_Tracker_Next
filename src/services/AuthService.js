export const loginUser = async (loginData) => {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(loginData),
  });

  if (!res.ok) throw await res.json();

  return res.json();
};