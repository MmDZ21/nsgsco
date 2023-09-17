"use client";
import { UserContext } from "@/context/UserContext";
import { Suggestion } from "@prisma/client";
import axios from "axios";
import { useContext, useEffect } from "react";

const SuggestionDetails = ({ suggestion }: { suggestion: Suggestion }) => {
  const { fetchSuggestions } = useContext(UserContext);
  const updateUnread = async () => {
    await axios.patch(`/api/suggestions/updateUnread/${suggestion.id}`);
    await fetchSuggestions();
  };
  useEffect(() => {
    updateUnread();
  }, []);
  return (
    <div className="bg-gray-900 rounded-xl right-dir p-8">
      <div className="w-5/6 mx-auto">
        <div className="pb-6 font-IranSansBold text-center text-lg text-white">
          {suggestion.title}
        </div>
        <div className="h-[1px] bg-gray-400 mb-6"></div>
        <div className="text-gray-400 break-words text-sm leading-8">
          {suggestion.body}
        </div>
      </div>
    </div>
  );
};

export default SuggestionDetails;
