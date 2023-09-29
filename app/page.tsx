"use client";
import { useEffect } from "react";
import SignInForm from "@/components/SignInForm";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    // Check if the user is signed in
    if (session) {
      // Redirect based on user role
      redirectToDashboard(session.user.role);
    }
  }, [session]);

  const redirectToDashboard = (role: string) => {
    if (role === "ADMIN") {
      router.push("/dashboard/admin");
    } else {
      router.push("/dashboard/user");
    }
  };

  return (
    <main className="bg-gray-900">
      <SignInForm />
    </main>
  );
}
