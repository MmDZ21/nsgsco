"use client";
import { TicketModel } from "@/types/prisma";
import moment from "jalali-moment";
import { useRouter } from "next/navigation";
import { useState } from "react";

const AdminTicketList = ({ tickets }: { tickets: TicketModel[] }) => {
  const router = useRouter();
  const [filter, setFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);

  const usersMap = new Map();

  // Iterate through tickets and store unique users in the map
  tickets.forEach((ticket) => {
    const userId = ticket.user.id;
    if (!usersMap.has(userId)) {
      usersMap.set(userId, ticket.user);
    }
  });

  // Extract unique users from the map
  const users = Array.from(usersMap.values());

  // Filter tickets based on the selected filter
  const filteredTickets = tickets.filter((ticket) => {
    if (filter === "all") return true;
    if (filter === "REPLIED") {
      return ticket.status === "REPLIED";
    }
    if (filter === "unreadByAdmin") {
      return ticket.unreadByAdmin === true;
    }
    if (filter === "readByAdmin") {
      return ticket.unreadByAdmin === false;
    }
    if (filter === "NOREPLY") {
      return ticket.status === "NOREPLY";
    }
  });

  // Search for tickets based on the search query
  const searchedTickets = () => {
    let finalTickets = [];
    if (searchQuery === "") {
      finalTickets = filteredTickets;
    } else {
      finalTickets = filteredTickets.filter((ticket) => {
        if (!ticket.user.name) {
          return false;
        }
        return (
          ticket.user.name.includes(searchQuery) ||
          ticket.user.username.includes(searchQuery) ||
          ticket.title.includes(searchQuery)
        );
      });
    }
    return finalTickets;
  };
  const foundTickets = searchedTickets();

  // Pagination
  const totalPages = Math.ceil(foundTickets.length / pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const displayedTickets = foundTickets.slice(startIndex, endIndex);

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

  return (
    <div className="relative right-dir overflow-x-scroll">
      {/* Filter and search controls */}
      <div className="flex flex-col md:flex-row gap-5 justify-between mb-4">
        <div className="flex items-center space-x-2">
          <label className="text-white px-2">فیلتر: </label>
          <select
            className="border text-sm rounded-lg p-1 bg-gray-950 bg-opacity-40 border-gray-600 placeholder-gray-400 text-white focus:ring-nsgsco focus:border-nsgsco"
            onChange={(e) => setFilter(e.target.value)}
            value={filter}
          >
            <option value="all">همه</option>
            <option value="REPLIED">پاسخ داده شده</option>
            <option value="NOREPLY">پاسخ داده نشده</option>
            <option value="unreadByAdmin">خوانده نشده</option>
            <option value="readByAdmin">خوانده شده</option>
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

      {/* Ticket table */}
      <table className="w-full text-sm text-gray-400">
        {/* ...Table headers... */}
        <thead className="text-xs bg-gray-950 bg-opacity-40 text-gray-300">
          <tr>
            <th scope="col" className="px-6 py-3 text-center w-1/5">
              عنوان پیام
            </th>
            <th scope="col" className="px-6 py-3 text-center w-1/5">
              ایجاد کننده
            </th>
            <th scope="col" className="px-6 py-3 text-center w-1/5">
              وضعیت
            </th>
            <th scope="col" className="px-6 py-3 text-center w-1/5">
              تاریخ ارسال
            </th>
            <th scope="col" className="px-6 py-3 text-center w-1/5">
              عملیات
            </th>
          </tr>
        </thead>
        <tbody>
          {displayedTickets.length > 0 ? (
            displayedTickets.map((ticket) => (
              <tr
                key={ticket.id}
                className=" border-b bg-transparent border-gray-700 hover:bg-gray-600"
              >
                <th
                  scope="row"
                  className=" flex justify-center items-center px-6 py-4 font-medium whitespace-nowrap text-center text-white"
                >
                  {ticket.title}
                </th>
                <td className="px-2 py-4 text-center">{ticket.user.name}</td>
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
                      router.push(`/dashboard/admin/requests/${ticket.id}`)
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
              className="flex items-center justify-center px-3 h-8 cursor-pointer leading-tight border  rounded-r-lg   bg-transparent  border-gray-700  text-gray-400  hover:bg-nsgsco  hover:text-white"
            >
              بعدی
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default AdminTicketList;
