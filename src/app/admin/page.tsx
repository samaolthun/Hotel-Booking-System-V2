"use client";

import { useAuth } from "@/src/hooks/use-auth";
import { useEffect } from "react";
import { OwnerDashboard } from "@/src/components/owner/owner-dashboard";

export default function AdminDashboardPage() {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && (!user || user.email !== "admin@gmail.com")) {
      window.location.href = "/";
    }
  }, [user, loading]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user || user.email !== "admin@gmail.com") {
    return null;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <OwnerDashboard />
    </div>
  );
}
