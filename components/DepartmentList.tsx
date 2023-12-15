"use client";
import { UserContext } from "@/context/UserContext";
import { DepartmentModel } from "@/types/prisma";
import moment from "jalali-moment";
import { useContext, useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
const DepartmentList = ({
  departments,
  setDepartments,
}: {
  departments: DepartmentModel[];
  setDepartments: any;
}) => {
  const [filter, setFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);

  const router = useRouter();
  // Filter tickets based on the selected filter
  const filteredDepartments = departments.filter((department) => {
    if (filter === "all") return true;
    if (filter === "active") {
      return department.active === true;
    }
    if (filter === "inactive") {
      return department.active === false;
    }
  });

  // Search for tickets based on the search query
  const searchedDepartments = () => {
    let finalDepartments = [];
    if (searchQuery === "") {
      finalDepartments = filteredDepartments;
    } else {
      finalDepartments = filteredDepartments.filter((department) => {
        if (!department.name) {
          return false;
        }
        return department.name.includes(searchQuery);
      });
    }
    return finalDepartments;
  };
  const foundDepartments = searchedDepartments();

  // Pagination
  const totalPages = Math.ceil(foundDepartments.length / pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const [displayedDepartments, setDisplayedDepartments] =
    useState<DepartmentModel[]>(departments);
  useEffect(() => {
    setDisplayedDepartments(searchedDepartments().slice(startIndex, endIndex));
  }, [departments, filter, searchQuery, page, pageSize, startIndex, endIndex]);

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
      const res = await toast.promise(
        axios.delete(`/api/departments/delete/${id}`),
        {
          pending: "در حال انجام",
          success: "کاربران با موفقیت حذف شدند",
          error: "ناموفق",
        }
      );
      if (res.status === 200) {
        setDisplayedDepartments((prev) => prev.filter((dep) => dep.id !== id));
      }
    }
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
            <option value="active">فعال</option>
            <option value="inactive">غیرفعال</option>
            {/* Add more status options if needed */}
          </select>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            className="right-dir appearance-none bg-transparent border-2  border-gray-600 shadow-sm focus:shadow-md focus:border-nsgsco focus:placeholder-gray-600 placeholder:text-xs pr-3 transition  rounded-md py-2 text-gray-300 leading-tight focus:outline-none focus:ring-gray-600 focus:shadow-outline"
            placeholder="جستجو..."
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
              عنوان کارگاه
            </th>
            <th scope="col" className="px-6 py-3 text-center w-1/5">
              تعداد کاربران
            </th>
            <th scope="col" className="px-6 py-3 text-center w-1/5">
              وضعیت
            </th>
            <th scope="col" className="px-6 py-3 text-center w-1/5">
              تاریخ ایجاد
            </th>
            <th scope="col" className="px-6 py-3 text-center w-1/5">
              عملیات
            </th>
          </tr>
        </thead>
        <tbody>
          {displayedDepartments.length > 0 ? (
            displayedDepartments.map((department) => (
              <tr
                key={department.id}
                className=" border-b bg-transparent border-gray-700 hover:bg-gray-600"
              >
                <th
                  scope="row"
                  className=" flex justify-center items-center px-6 py-4 font-medium whitespace-nowrap text-center text-white"
                >
                  {department.name}
                </th>
                <td className="px-2 py-4 text-center">
                  {department.users.length}
                </td>
                <td className="px-2 py-4 text-center flex justify-center">
                  <div
                    className={
                      department.active === true
                        ? "bg-green-700 text-white text-xs py-2 w-1/2"
                        : "bg-red-700 text-white text-xs py-2 w-1/2"
                    }
                  >
                    {department.active === true ? "فعال" : "غیرفعال"}
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  {moment(department.updatedAt).format(
                    "jYYYY-jMM-jDD HH:mm:ss"
                  )}
                </td>
                <td className="px-6 py-4 text-center">
                  <Dialog>
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <svg
                          className="w-4 h-4 text-gray-300 dark:text-white"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 4 15"
                        >
                          <path d="M3.5 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 6.041a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 5.959a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
                        </svg>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-gray-900">
                        <DropdownMenuItem
                          onClick={() =>
                            router.push(
                              `/dashboard/admin/departments/${department.id}`
                            )
                          }
                        >
                          مشاهده
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            router.push(
                              `/dashboard/admin/departments/edit/${department.id}`
                            )
                          }
                        >
                          ویرایش
                        </DropdownMenuItem>
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger className="data-[state=open]:text-black">
                            <p className="ml-4">اضافه کردن</p>
                          </DropdownMenuSubTrigger>
                          <DropdownMenuPortal>
                            <DropdownMenuSubContent className="bg-gray-900 text-white">
                              <DropdownMenuItem
                                onClick={() =>
                                  router.push(
                                    `/dashboard/admin/departments/add/manual/${department.id}`
                                  )
                                }
                              >
                                اضافه کردن دستی
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  router.push(
                                    `/dashboard/admin/departments/add/group/${department.id}`
                                  )
                                }
                              >
                                اضافه کردن گروهی
                              </DropdownMenuItem>
                            </DropdownMenuSubContent>
                          </DropdownMenuPortal>
                        </DropdownMenuSub>
                        <DialogTrigger className="w-full">
                          <DropdownMenuItem>حذف</DropdownMenuItem>
                        </DialogTrigger>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle className="font-IranSansBold flex justify-center">
                          <div>از حذف کارگاه زیر مطمئنید؟</div>
                        </DialogTitle>
                        <DialogDescription className="flex">
                          <div className="text-lg">{department.name}</div>
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
                            onClick={() => handleDelete(department.id)}
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
              <th className="text-center py-4">کارگاهی موجود نیست</th>
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
            className="bg-gray-900 rounded-lg p-[3px] border border-gray-700 text-gray-400 hover:bg-gray-900"
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

export default DepartmentList;
