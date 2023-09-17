"use client";

import SuggestionDetails from "@/components/SuggestionDetails";
import { UserContext } from "@/context/UserContext";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";

const page = () => {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("sign-in");
    },
  });
  const suggestions = useContext(UserContext).suggestions;
  const params = useParams();
  const suggestionId = params.suggestionId as string;
  const suggestion = suggestions.find(
    (suggestion) => suggestion.id === suggestionId
  );
  return (
    <div>{suggestion && <SuggestionDetails suggestion={suggestion} />}</div>
  );
};

export default page;
