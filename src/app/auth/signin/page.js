'use client';

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import toast from "react-hot-toast";

export default function SignInPage() {
  const { data: session, status } = useSession();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      toast.success('Welcome back! 👋');
      router.replace('/');
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <AiOutlineLoading3Quarters className="animate-spin text-4xl text-indigo-600" />
      </div>
    );
  }

  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const loadingToast = toast.loading("Checking your email...");

    try {
      // 1. Validate the email against the API route
      const validationResponse = await fetch('/api/auth/validate-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!validationResponse.ok) {
        throw new Error('Failed to validate email');
      }

      const { allowed } = await validationResponse.json();

      if (!allowed) {
        // Notify the user
        toast.success("Your email and details have been forwarded to the administrator. You'll be granted access soon.",
          { id: loadingToast });

        // Send request to notify admin
        await fetch("/api/auth/notify-admin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });

        setIsLoading(false);
        router.push("/auth/error?error=UnauthorizedEmail");
        return;
      }

      // 2. If email is in the allowed list, try direct login
      toast.loading("Signing you in...", { id: loadingToast });

      // Use the email-login provider ID to match the ID in route.js
      const result = await signIn("email-login", {
        email,
        redirect: false,
      });

      if (result?.error) {
        // If direct login fails, fall back to email link
        toast.loading("Sending connection link...", { id: loadingToast });

        const emailResult = await signIn("email", {
          email,
          redirect: false,
        });

        if (emailResult?.error) {
          throw new Error(emailResult.error || 'Failed to send verification email');
        }

        toast.success("Check your email for the login link!", { id: loadingToast });
        router.push("/auth/verify-request");
      } else {
        // Direct login successful
        toast.success("Successfully signed in!", { id: loadingToast });

        // Force a full page reload to ensure session is recognized
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Error signing in:", error);
      toast.error(`Sign in failed: ${error.message}`, { id: loadingToast });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignIn = async (provider) => {
    try {
      await signIn(provider, { callbackUrl: "/" });
    } catch (error) {
      console.error("Error signing in with provider:", error);
      toast.error("Failed to sign in with provider.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-indigo-200 px-4 py-12">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-xl transition duration-300">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
          <p className="mt-2 text-sm text-gray-500">Sign in to your account</p>
        </div>

        <form onSubmit={handleEmailSignIn} className="space-y-5">
          <div>
            <label
              htmlFor="email-address"
              className="block text-sm font-medium text-gray-700"
            >
              Email address
            </label>
            <input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="mt-1 block w-full rounded-lg border border-gray-300 p-3 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <AiOutlineLoading3Quarters className="animate-spin text-lg" />
                Signing in...
              </>
            ) : (
              "Sign in with Email"
            )}
          </button>
        </form>

        <div className="relative mt-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center bg-white px-2 text-sm text-gray-500">
            Or continue with
          </div>
        </div>

        <div className="grid mt-6">
          <button
            type="button"
            onClick={() => handleSocialSignIn("google")}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white py-3 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-100"
          >
            <FcGoogle className="text-xl" />
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
}