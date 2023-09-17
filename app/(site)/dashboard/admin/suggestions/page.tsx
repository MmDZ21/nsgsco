"use client";
import AdminSuggestionList from "@/components/AdminSuggestionList";
import { UserContext } from "@/context/UserContext";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useContext } from "react";

export default function page() {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("sign-in");
    },
  });
  const suggestions = useContext(UserContext).suggestions;
  return (
    <div dir="rtl">
      <AdminSuggestionList suggestions={suggestions} />
    </div>
  );
}
