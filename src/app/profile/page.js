"use client";

import { useAuth } from "../hooks/useAuth";

export default function ProfilePage() {
  const { session, loading, authenticated } = useAuth({ required: true });

  // Guard clause against null session
  if (loading || !authenticated || !session) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Profile Page</h1>
      <div>
        <p>Email: {session.user.email}</p>
        {session.user.name && <p>Name: {session.user.name}</p>}
        {session.user.image && (
          <img
            src={session.user.image}
            alt="Profile"
            className="w-16 h-16 rounded-full mt-4"
          />
        )}
      </div>
    </div>
  );
}