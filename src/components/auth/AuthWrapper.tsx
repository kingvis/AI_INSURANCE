"use client";

import { useSupabase } from "@/hooks/useSupabase";
import AuthCard from "./AuthCard";
import UserProfile from "./UserProfile";
import { Loading } from "@/components/ui/Loading";

export default function AuthWrapper() {
  const { user, loading } = useSupabase();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return user ? <UserProfile /> : <AuthCard />;
} 