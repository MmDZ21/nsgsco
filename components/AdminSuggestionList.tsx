"use client";
import { SuggestionModel } from "@/types/prisma";
import { toPersianDigits } from "@/utils/Clock";
import moment from "jalali-moment";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const AdminSuggestionList = ({
  suggestions,
}: {
  suggestions: SuggestionModel[];
}) => {
  const router = useRouter();
  const [filter, setFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);

  // Function to generate a range of page numbers
  const getPageRange = () => {
    const range = [];
    const maxVisiblePages = 10; // Adjust this value as needed

    if (totalPages <= maxVisiblePages) {
      // If there are fewer pages than the max visible, show all pages
      for (let i = 1; i <= totalPages; i++) {
        range.push(i);
      }
    } else {
      // Determine which pages to show when there are many pages
      const halfVisible = Math.floor(maxVisiblePages / 2);
      const lowerBound = Math.max(page - halfVisible, 1);
      const upperBound = Math.min(page + halfVisible, totalPages);

      if (lowerBound > 1) {
        range.push(1); // Always show page 1
        if (lowerBound > 2) {
          range.push("..."); // Add "..." if there's a gap
        }
      }

      for (let i = lowerBound; i <= upperBound; i++) {
        range.push(i);
      }

      if (upperBound < totalPages) {
        if (upperBound < totalPages - 1) {
          range.push("..."); // Add "..." if there's a gap
        }
        range.push(totalPages); // Always show the last page
      }
    }

    return range;
  };

  useEffect(() => {
    // Scroll to the top of the page when the page changes
    window.scrollTo(0, 0);
  }, [page]);

  // Iterate through suggestions and store unique users in the map
  const usersMap = new Map();
  suggestions.forEach((suggestion) => {
    const userId = suggestion.user.id;
    if (!usersMap.has(userId)) {
      usersMap.set(userId, suggestion.user);
    }
  });

  // Extract unique users from the map
  const users = Array.from(usersMap.values());

  // Filter suggestions based on the selected filter
  const filteredSuggestions = suggestions.filter((suggestion) => {
    if (filter === "all") return true;
    if (filter === "unread") {
      return suggestion.unread === true;
    }
    if (filter === "read") {
      return suggestion.unread === false;
    }
    return true; // Default to showing all suggestions
  });

  // Search for suggestions based on the search query
  const searchedSuggestions = () => {
    if (searchQuery === "") {
      return filteredSuggestions;
    } else {
      return filteredSuggestions.filter((suggestion) => {
        if (!suggestion.user.name) {
          return false;
        }
        return (
          suggestion.user.name.includes(searchQuery) ||
          suggestion.user.username.includes(searchQuery) ||
          suggestion.title.includes(searchQuery)
        );
      });
    }
  };

  const foundSuggestions = searchedSuggestions();
  const totalPages = Math.ceil(foundSuggestions.length / pageSize);
  // Calculate the start and end indexes based on pagination
  const startIndex = (page - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, foundSuggestions.length);
  const displayedSuggestions = foundSuggestions.slice(startIndex, endIndex);

  return (
    <div className="relative right-dir overflow-x-scroll">
      {/* Filter and search controls */}
      <div className="flex justify-between mb-4">
        <div className="flex items-center space-x-2">
          <label className="text-white px-2">فیلتر: </label>
          <select
            className="border text-sm rounded-lg p-1 bg-gray-950 bg-opacity-40 border-gray-600 placeholder-gray-400 text-white focus:ring-nsgsco focus:border-nsgsco"
            onChange={(e) => setFilter(e.target.value)}
            value={filter}
          >
            <option value="all">همه</option>
            <option value="unread">خوانده نشده</option>
            <option value="read">خوانده شده</option>
            {/* Add more status options if needed */}
          </select>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            className="right-dir appearance-none bg-transparent border-2  border-gray-600 shadow-sm focus:shadow-md focus:border-nsgsco focus:placeholder-gray-600 placeholder:text-xs pr-3 transition  rounded-md py-2 text-gray-300 leading-tight focus:outline-none focus:ring-gray-600 focus:shadow-outline"
            placeholder="جستجو با کد ملی، نام یا عنوان..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Suggestion table */}
      <table className="w-full text-sm text-gray-400">
        <thead className="text-xs bg-gray-950 bg-opacity-40 text-gray-300">
          <tr>
            <th scope="col" className="px-6 py-3 text-center">
              عنوان پیشنهاد
            </th>
            <th scope="col" className="px-6 py-3 text-center">
              ایجاد کننده
            </th>
            <th scope="col" className="px-6 py-3 text-center">
              تاریخ ارسال
            </th>
            <th scope="col" className="px-6 py-3 text-center">
              عملیات
            </th>
          </tr>
        </thead>
        <tbody>
          {displayedSuggestions.length > 0 ? (
            displayedSuggestions.map((suggestion) => (
              <tr
                key={suggestion.id}
                className=" border-b bg-transparent border-gray-700 hover:bg-gray-600"
              >
                <th
                  scope="row"
                  className="flex justify-center items-center px-6 py-4 font-medium whitespace-nowrap text-center text-white"
                >
                  {suggestion.title}
                </th>
                <td className="px-6 py-4 text-center">
                  {suggestion.user.name}
                </td>
                <td className="px-6 py-4 text-center">
                  {moment(suggestion.uploadDate).format(
                    "jYYYY-jMM-jDD HH:mm:ss"
                  )}
                </td>
                <td className="px-6 py-4 text-center">
                  <button
                    className="text-white py-2 px-4 rounded bg-nsgsco  hover:bg-[#093e3b] text-sm tracking-wider transition"
                    onClick={() =>
                      router.push(
                        `/dashboard/admin/suggestions/${suggestion.id}`
                      )
                    }
                  >
                    مشاهده
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <th className="text-center py-4">پیشنهادی موجود نیست</th>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <nav dir="ltr" aria-label="Page navigation example" className="pt-6">
        <ul className="inline-flex -space-x-px text-sm">
          <li>
            <a
              onClick={() => setPage((prev) => (prev > 1 ? prev - 1 : prev))}
              className="flex items-center justify-center cursor-pointer px-3 h-8 ml-0 leading-tight border rounded-l-lg  bg-transparent  border-gray-700  text-gray-400  hover:bg-nsgsco hover:text-white"
            >
              قبلی
            </a>
          </li>
          {getPageRange().map((pageNum, index) => (
            <li key={index}>
              {pageNum === "..." ? (
                <span className="flex items-center justify-center px-3 h-8 ml-0 leading-tight border  bg-transparent  border-gray-700  text-gray-400  hover:bg-nsgsco hover:text-white">
                  {"..."}
                </span>
              ) : (
                <a
                  onClick={() => setPage(pageNum as number)}
                  className={`${
                    pageNum === page
                      ? "bg-nsgsco text-white"
                      : "bg-transparent text-gray-400 hover:bg-nsgsco hover:text-white"
                  } flex items-center cursor-pointer justify-center px-3 h-8 ml-0 leading-tight border  border-gray-700`}
                >
                  {pageNum === "..." ? "..." : pageNum}
                </a>
              )}
            </li>
          ))}
          <li>
            <a
              onClick={() =>
                setPage((prev) => (prev < totalPages ? prev + 1 : prev))
              }
              className="flex items-center justify-center px-3 h-8 cursor-pointer leading-tight border  rounded-r-lg  bg-transparent  border-gray-700  text-gray-400  hover:bg-nsgsco  hover:text-white"
            >
              بعدی
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default AdminSuggestionList;
