import { useEffect, useState } from "react";

export default function DebugUser() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState("");

  useEffect(() => {
    // Direct localStorage check - NO authService needed!
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    setToken(savedToken || "No token");

    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);

      // Decode JWT
      if (savedToken) {
        try {
          const payload = JSON.parse(atob(savedToken.split(".")[1]));
          console.log("🔓 TOKEN DECODED:", payload);
        } catch (e) {
          console.log("Token decode failed");
        }
      }
    }
  }, []);

  return (
    <div
      style={{
        padding: "20px",
        background: "#f0f8ff",
        borderRadius: "8px",
        fontFamily: "monospace",
        margin: "20px 0",
        border: "2px solid #0066cc",
      }}
    >
      <h2 style={{ color: "#0066cc", marginBottom: "15px" }}>
        🔍 DEBUG: Auth Status
      </h2>

      <div style={{ display: "grid", gap: "10px", fontSize: "14px" }}>
        <div>
          <strong>Token:</strong>{" "}
          {token ? `✅ ${token.slice(0, 20)}...` : "❌ NO TOKEN"}
        </div>
        <div>
          <strong>User Data:</strong>
        </div>
        <pre
          style={{
            background: "white",
            padding: "15px",
            borderRadius: "4px",
            maxHeight: "300px",
            overflow: "auto",
            fontSize: "12px",
          }}
        >
          {JSON.stringify(user, null, 2) || "👻 No user data in localStorage"}
        </pre>

        <button
          onClick={() => {
            console.clear();
            console.table({ token: token ? "YES" : "NO", user });
            console.log("Full localStorage:", { ...localStorage });
          }}
          style={{
            padding: "8px 16px",
            background: "#0066cc",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          📋 Log Everything to Console
        </button>
      </div>
    </div>
  );
}
