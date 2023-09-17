"use client";
import { TicketModel } from "@/types/prisma";
import { toPersianDigits } from "@/utils/Clock";
import moment from "jalali-moment";
import { useRouter } from "next/navigation";
import { useState } from "react";

const TicketList = ({ tickets }: { tickets: TicketModel[] }) => {
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);
  const totalPages = Math.ceil(tickets.length / pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  const router = useRouter();

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
  const displayedTickets = tickets.slice(startIndex, endIndex);

  // No need for useEffect, data is already available in the 'tickets' prop

  return (
    <div className="relative right-dir overflow-x-scroll">
      <table className="w-full text-sm text-gray-400">
        <thead className="text-xs bg-gray-900 text-gray-300">
          <tr>
            <th scope="col" className="px-6 py-3 text-center w-1/4">
              عنوان پیام
            </th>
            <th scope="col" className="px-6 py-3 text-center w-1/4">
              وضعیت
            </th>
            <th scope="col" className="px-6 py-3 text-center w-1/4">
              تاریخ ارسال
            </th>
            <th scope="col" className="px-6 py-3 text-center w-1/4">
              عملیات
            </th>
          </tr>
        </thead>
        <tbody>
          {displayedTickets.length > 0 ? (
            displayedTickets.map((ticket) => (
              <tr
                key={ticket.id}
                className={`border-b ${
                  ticket.unreadByUser ? "bg-gray-700" : "bg-gray-800"
                } border-gray-700 hover:bg-gray-600`}
              >
                <th
                  scope="row"
                  className=" flex justify-center items-center px-6 py-4 font-medium whitespace-nowrap text-center text-white"
                >
                  {ticket.title}
                </th>
                <td className="px-2 py-4 text-center">
                  <div
                    className={
                      ticket.status === "REPLIED"
                        ? "bg-green-700 text-white py-2"
                        : "bg-yellow-700 text-white py-2"
                    }
                  >
                    {ticket.status === "REPLIED"
                      ? "پاسخ داده شده"
                      : " در حال بررسی"}
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  {moment(ticket.updatedAt).format("jYYYY-jMM-jDD HH:mm:ss")}
                </td>
                <td className="px-6 py-4 text-center">
                  <button
                    className="text-white py-2 px-4 rounded bg-nsgsco  hover:bg-[#093e3b] text-sm tracking-wider transition"
                    onClick={() =>
                      router.push(`/dashboard/user/requests/${ticket.id}`)
                    }
                  >
                    مشاهده
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <th className="text-center py-4">پیامی موجود نیست</th>
            </tr>
          )}
        </tbody>
      </table>
      <nav dir="ltr" aria-label="Page navigation example" className="pt-6">
        <ul className="inline-flex -space-x-px text-sm">
          <li>
            <a
              onClick={() => setPage((prev) => (prev > 1 ? prev - 1 : prev))}
              className="flex items-center justify-center cursor-pointer px-3 h-8 ml-0 leading-tight border rounded-l-lg  bg-gray-800  border-gray-700  text-gray-400  hover:bg-nsgsco hover:text-white"
            >
              قبلی
            </a>
          </li>
          {getPageRange().map((pageNum, index) => (
            <li key={index}>
              {pageNum === "..." ? (
                <span className="flex items-center justify-center px-3 h-8 ml-0 leading-tight border  bg-gray-800  border-gray-700  text-gray-400   hover:bg-nsgsco hover:text-white">
                  {"..."}
                </span>
              ) : (
                <a
                  onClick={() => setPage(pageNum as number)}
                  className={`${
                    pageNum === page
                      ? "bg-nsgsco text-white"
                      : "bg-gray-800 text-gray-400 hover:bg-nsgsco hover:text-white"
                  } flex items-center cursor-pointer justify-center px-3 h-8 ml-0 leading-tight border  border-gray-700`}
                >
                  {toPersianDigits(pageNum as number)}
                </a>
              )}
            </li>
          ))}
          <li>
            <a
              onClick={() =>
                setPage((prev) => (prev < totalPages ? prev + 1 : prev))
              }
              className="flex items-center justify-center px-3 h-8 cursor-pointer leading-tight border  rounded-r-lg   bg-gray-800  border-gray-700  text-gray-400   hover:bg-nsgsco  hover:text-white"
            >
              بعدی
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default TicketList;
