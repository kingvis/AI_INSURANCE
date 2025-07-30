"use client";

import { useSupabase } from "@/hooks/useSupabase";
import { Button } from "@/components/ui/Button";

export function AuthButton() {
  const { user, supabase } = useSupabase();

  const handleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) console.error("Error:", error);
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error("Error:", error);
  };

  return (
    <Button
      onClick={user ? handleSignOut : handleSignIn}
      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
    >
      {user ? "Sign Out" : "Sign In with GitHub"}
    </Button>
  );
} 