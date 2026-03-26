"use client";

import { useSession, signOut } from "next-auth/react";

const Dashboard = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p className="p-6 text-center">Loading...</p>;
  }

  if (!session) {
    return <p className="p-6 text-center text-red-500">You are not logged in.</p>;
  }

  const { user } = session;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md space-y-3">
        <p>
          <strong>ID:</strong> {user.id}
        </p>
        <p>
          <strong>Name:</strong> {user.name}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Role:</strong> {user.role}
        </p>
      </div>

      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="mt-6 btn-accent px-4 py-2 rounded"
      >
        Sign Out
      </button>
    </div>
  );
};

export default Dashboard;