"use client";

import { useEffect, useState } from "react";

export default function ClientRoot({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function loadUser() {
      const res = await fetch("http://localhost:3001/auth/me", {
        credentials: "include",
      });
      const data = await res.json();
      setUser(data.user);
    }
    loadUser();
  }, []);

  return <>{children}</>;
}
