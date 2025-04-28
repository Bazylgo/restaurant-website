"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function useAuth({ required = false, redirectTo = "/auth/signin" } = {}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const loading = status === "loading";
  const authenticated = status === "authenticated";
  const unauthenticated = status === "unauthenticated";

  useEffect(() => {
    // If auth is required and user is unauthenticated, redirect to login
    if (required && unauthenticated) {
      router.push(`${redirectTo}?callbackUrl=${encodeURIComponent(window.location.href)}`);
    }
  }, [required, redirectTo, router, unauthenticated]);

  return { session, loading, authenticated, unauthenticated };
}