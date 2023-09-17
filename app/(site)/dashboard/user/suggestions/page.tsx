"use client";
import SuggestionList from "@/components/SuggestionList";
import { UserContext } from "@/context/UserContext";
import { Suggestion } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";

export default function page() {
  const [mySuggestions, setMySuggestions] = useState<Suggestion[]>([]);
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("sign-in");
    },
  });
  const suggestions = useContext(UserContext).suggestions;
  useEffect(() => {
    const mySuggestions = suggestions.filter(
      (suggestion) => suggestion.userId === session?.user.id
    );
    setMySuggestions(mySuggestions);
  }, [suggestions]);
  return (
    <div dir="rtl">
      <div className="pb-4">
        <button
          onClick={() => router.push("/dashboard/user/suggestions/new")}
          className="text-white py-2 px-4 rounded bg-nsgsco  hover:bg-[#093e3b] text-sm tracking-wider transition"
        >
          پیشنهاد جدید
        </button>
      </div>
      <SuggestionList suggestions={mySuggestions} />
    </div>
  );
}
