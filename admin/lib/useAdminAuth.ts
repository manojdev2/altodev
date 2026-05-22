"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function useAdminAuth() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.replace("/login");
      return;
    }
    // This state flip only happens on the client after we confirm the token exists.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setChecking(false);
  }, [router]);

  return { checking };
}
