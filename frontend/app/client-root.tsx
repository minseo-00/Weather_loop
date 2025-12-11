"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function ClientRoot({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await axios.get("http://localhost:3001/auth/me", {
          withCredentials: true,
        });
        setUser(res.data.user);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    }
    loadUser();
  }, []);

  return <>{children}</>;
}
