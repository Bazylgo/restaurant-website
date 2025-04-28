//error page.js
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const [error, setError] = useState('');

  useEffect(() => {
    // Get error message from URL query parameter
    const errorMessage = searchParams.get('error');
    let displayError = 'An error occurred during authentication';

    // Map error codes to user-friendly messages
    switch (errorMessage) {
      case 'OAuthSignin':
        displayError = 'Error starting the OAuth sign-in process';
        break;
      case 'OAuthCallback':
        displayError = 'Error during the OAuth callback';
        break;
      case 'OAuthCreateAccount':
        displayError = 'Error creating an OAuth provider account';
        break;
      case 'EmailCreateAccount':
        displayError = 'Error creating an email provider account';
        break;
      case 'Callback':
        displayError = 'Error during the OAuth callback';
        break;
      case 'OAuthAccountNotLinked':
        displayError = 'This email is already associated with another account. Please use the same sign-in method you used previously.';
        break;
      case 'EmailSignin':
        displayError = 'Error sending the email sign-in link';
        break;
      case 'CredentialsSignin':
        displayError = 'Invalid sign-in credentials';
        break;
      case 'SessionRequired':
        displayError = 'You must be signed in to access this page';
        break;
      case 'UnauthorizedEmail':
        displayError = 'Unauthorized email. Please contact the administrator to gain access to this application.';
        break;
      default:
        if (errorMessage) {
          displayError = errorMessage;
        }
    }

    setError(displayError);
  }, [searchParams]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 text-center">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Authentication Error
          </h2>
          <div className="mt-6 rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error Details</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4">
          <Link
            href="/auth/signin"
            className="inline-flex w-full justify-center rounded-md bg-orange-600 py-2 px-4 text-white shadow-sm hover:bg-orange-700"
          >
            Return to sign in
          </Link>
          <div className="mt-4">
            <Link
              href="/"
              className="text-sm font-medium text-orange-600 hover:text-orange-500"
            >
              Return to home page
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}