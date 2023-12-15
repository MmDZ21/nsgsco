"use client";

import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { DepartmentModel } from "@/types/prisma";
import axios from "axios";

const DepartmentDetails = ({ department }: { department: DepartmentModel }) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);
  // Search for payslips based on the search query
  const searchedUsers = () => {
    let finalUsers = [];
    if (searchQuery === "") {
      finalUsers = department.users;
    } else {
      finalUsers = department.users.filter((user) => {
        console.log(searchQuery);
        if (!user.name) {
          console.log("User not found");
          return false;
        }
        return (
          user.name.includes(searchQuery) ||
          user.username.includes(searchQuery) ||
          user.phone?.includes(searchQuery)
        );
      });
    }
    return finalUsers;
  };
  // Pagination
  const totalPages = Math.ceil(searchedUsers().length / pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const [displayedUsers, setDisplayedUsers] = useState<any[]>(department.users);
  useEffect(() => {
    setDisplayedUsers(searchedUsers().slice(startIndex, endIndex));
  }, [department.users, searchQuery, page, pageSize, startIndex, endIndex]);

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
  const handleDelete = async (id: string) => {
    if (id !== undefined) {
      const res = await axios.delete(`/api/users/delete/${id}`);
      if (res.status === 200) {
        setDisplayedUsers((prev) => prev.filter((user) => user.id !== id));
        toast.success("کاربر مورد نظر با موفقیت حذف شد", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      } else {
        return toast.error(res.data, {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      }
    }
  };
  return (
    <div className="relative right-dir overflow-x-scroll">
      {/* Filter and search controls */}
      <div className="flex flex-col md:flex-row gap-5 justify-between mb-4">
        <div className="flex items-center space-x-2 gap-6">
          <input
            type="text"
            className="right-dir appearance-none bg-transparent border-2  border-gray-600 shadow-sm focus:shadow-md focus:border-nsgsco focus:placeholder-gray-600 placeholder:text-xs pr-3 transition  rounded-md py-2 text-gray-300 leading-tight focus:outline-none focus:ring-gray-600 focus:shadow-outline"
            placeholder="جستجو با کد ملی، نام، تلفن..."
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
            <th scope="col" className="px-6 py-3 text-center w-1/12">
              ردیف
            </th>
            <th scope="col" className="px-6 py-3 text-center w-1/6">
              نام
            </th>
            <th scope="col" className="px-6 py-3 text-center w-1/6">
              کد ملی
            </th>
            <th scope="col" className="px-6 py-3 text-center w-1/6">
              تلفن
            </th>
            <th scope="col" className="px-6 py-3 text-center w-1/6">
              عملیات
            </th>
          </tr>
        </thead>
        <tbody>
          {displayedUsers.length > 0 ? (
            displayedUsers.map((user, index) => (
              <tr
                key={user.id}
                className=" border-b bg-transparent border-gray-700 hover:bg-gray-600"
              >
                <td scope="row" className="px-2 py-4 text-center">
                  {pageSize * (page - 1) + index + 1}
                </td>
                <td
                  scope="row"
                  className=" flex justify-center items-center px-6 py-4 font-medium whitespace-nowrap text-center text-white"
                >
                  {user.name}
                </td>
                <td className="px-2 py-4 text-center">{user.username}</td>
                <td className="px-2 py-4 text-center">{user.phone}</td>
                <td className="px-6 py-4 text-center flex justify-center">
                  <Dialog>
                    <DialogTrigger className="text-white py-1 px-2 flex items-center justify-center gap-1 uppercase rounded bg-red-700 hover:bg-[#3e0909] text-sm tracking-wider transition">
                      <svg
                        className="w-3 h-3 text-white"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 18 20"
                      >
                        <path d="M17 4h-4V2a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v2H1a1 1 0 0 0 0 2h1v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6h1a1 1 0 1 0 0-2ZM7 2h4v2H7V2Zm1 14a1 1 0 1 1-2 0V8a1 1 0 0 1 2 0v8Zm4 0a1 1 0 0 1-2 0V8a1 1 0 0 1 2 0v8Z" />
                      </svg>
                      <p className="text-xs">حذف</p>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle className="font-IranSansBold flex justify-center">
                          <div>از حذف کاربر زیر مطمئنید؟</div>
                        </DialogTitle>
                        <DialogDescription className="flex">
                          <div className="text-lg">{user.name}</div>
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter className="flex gap-1 ">
                        <DialogTrigger asChild>
                          <button
                            onClick={() => {}}
                            className="text-white py-2 px-4 flex flex-col items-center justify-center gap-1 uppercase rounded bg-red-700 hover:bg-[#3e0909] text-sm tracking-wider transition"
                          >
                            خیر
                          </button>
                        </DialogTrigger>
                        <DialogTrigger asChild>
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="text-white py-2 px-4 flex flex-col items-center justify-center gap-1 uppercase rounded bg-nsgsco hover:bg-[#093e3b] text-sm tracking-wider transition"
                          >
                            بله
                          </button>
                        </DialogTrigger>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="text-center py-4">
                کاربری موجود نیست
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <nav
        dir="ltr"
        aria-label="Page navigation example"
        className="pt-6 pb-3 flex items-center gap-x-2"
      >
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
        <div>
          <select
            id="pageSize"
            value={pageSize}
            onChange={(e) => {
              setPage(1);
              setPageSize(+e.target.value);
            }}
            className="bg-gray-900 p-[3px] border border-gray-700 rounded-lg text-gray-400 hover:bg-gray-900"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
        </div>
      </nav>
    </div>
  );
};

export default DepartmentDetails;
