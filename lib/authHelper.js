export function getActiveUserId() {
  if (typeof window === "undefined") return "default_user";
  try {
    const sessionStr = localStorage.getItem("fullyworkout_user");
    if (sessionStr) {
      const user = JSON.parse(sessionStr);
      if (user && user.userId) {
        return user.userId;
      }
    }
  } catch (err) {
    console.error("Error reading session:", err);
  }
  return "default_user";
}