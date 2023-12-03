"use client";
import { UserContext } from "@/context/UserContext";
import { SuggestionModel } from "@/types/prisma";
import { Suggestion } from "@prisma/client";
import axios from "axios";
import { useContext, useEffect } from "react";

const SuggestionDetails = ({ suggestion }: { suggestion: SuggestionModel }) => {
  const { fetchSuggestions } = useContext(UserContext);
  const updateUnread = async () => {
    await axios.patch(`/api/suggestions/updateUnread/${suggestion.id}`);
    await fetchSuggestions();
  };
  useEffect(() => {
    updateUnread();
  }, []);
  return (
    <div className="bg-gray-950 bg-opacity-40 rounded-xl right-dir p-8">
      <div className="w-5/6 mx-auto">
        <div className="pb-6 font-IranSansBold text-center text-lg text-white flex justify-between">
          <div>{suggestion.title}</div>
          <div>{suggestion.user.name}</div>
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
