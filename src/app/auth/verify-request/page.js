//verify-request page.js
'use client';

import Link from 'next/link';

export default function VerifyRequest() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 text-center">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Check your email
          </h2>
          <p className="mt-6 text-center text-base text-gray-600">
            If your email is authorized, a sign in link has been sent to your email address.
            Please check your inbox (and spam folder) for an email from us.
          </p>
        </div>

        <div className="pt-8">
          <p className="text-sm text-gray-500">
            If you do not see the email, please check your spam folder. If you still do not see it, try requesting
            another verification email or contact the administrator.
          </p>
          <div className="mt-6">
            <Link
              href="/auth/signin"
              className="inline-flex w-full justify-center rounded-md bg-orange-600 py-2 px-4 text-white shadow-sm hover:bg-orange-700"
            >
              Return to sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}