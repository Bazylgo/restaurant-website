'use client'; // needed for error boundaries

import { useEffect } from 'react';

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error('Error:', error);
  }, [error]);

  return (
    <div className="text-center p-8">
      <h2 className="text-xl font-bold text-red-500">Something went wrong!</h2>
      <p className="mt-4">{error?.message || 'An unexpected error occurred.'}</p>
      <button
        onClick={() => reset()}
        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Try Again
      </button>
    </div>
  );
}