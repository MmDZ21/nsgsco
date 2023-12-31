"use client";
import { UserContext } from "@/context/UserContext";
import { PayslipModel } from "@/types/prisma";
import axios from "axios";
import moment from "jalali-moment";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
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
import Image from "next/image";
import PayslipSMS from "./PayslipSMS";
const PayslipList = () => {
  const router = useRouter();
  const [filter, setFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);
  const { departments } = useContext(UserContext);
  const payslips = useContext(UserContext).payslips;
  const { fetchPayslips } = useContext(UserContext);
  const usersMap = new Map();
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const handleRowSelect = (id: string) => {
    const selectedIndex = selectedRows.indexOf(id);
    let updatedSelectedRows: string[] = [];

    if (selectedIndex === -1) {
      updatedSelectedRows = [...selectedRows, id];
    } else {
      updatedSelectedRows = selectedRows.filter((rowId) => rowId !== id);
    }

    setSelectedRows(updatedSelectedRows);
  };

  const handleSelectAll = () => {
    if (!selectAll) {
      const allIds = displayedPayslips.map((payslip) => payslip.id);
      setSelectedRows(allIds);
    } else {
      setSelectedRows([]);
    }
    setSelectAll(!selectAll);
  };
  // Iterate through payslips and store unique users in the map
  payslips.forEach((payslip) => {
    const userId = payslip.user.id;
    if (!usersMap.has(userId)) {
      usersMap.set(userId, payslip.user);
    }
  });
  // Extract unique users from the map
  const users = Array.from(usersMap.values());
  // Filter payslips based on the selected filter
  const filteredPayslips = payslips.filter((payslip) => {
    if (filter === "all") return true;
    return payslip.user.departmentId === filter;
  });
  // Search for payslips based on the search query
  const searchedPayslips = () => {
    let finalPayslips = [];
    if (searchQuery === "") {
      finalPayslips = filteredPayslips;
    } else {
      finalPayslips = filteredPayslips.filter((payslip) => {
        if (!payslip.user.name) {
          return false;
        }
        return (
          payslip.user.name.includes(searchQuery) ||
          payslip.user.username.includes(searchQuery) ||
          payslip.month.includes(searchQuery) ||
          payslip.year.includes(searchQuery)
        );
      });
    }
    return finalPayslips;
  };
  // Pagination
  const totalPages = Math.ceil(searchedPayslips().length / pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const [displayedPayslips, setDisplayedPayslips] =
    useState<PayslipModel[]>(payslips);
  useEffect(() => {
    setDisplayedPayslips(searchedPayslips().slice(startIndex, endIndex));
  }, [
    payslips,
    filter,
    searchQuery,
    page,
    pageSize,
    startIndex,
    endIndex,
    departments,
  ]);

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
  const handleDownload = (fileId: string | undefined, fileName: string) => {
    if (fileId !== undefined) {
      const downloadLink = document.createElement("a");
      downloadLink.href = `/api/payslips/download/${fileId}`; // Replace with your download API endpoint
      downloadLink.target = "_blank";
      downloadLink.download = fileName;
      downloadLink.click();

      toast.success("آماده سازی دریافت", {
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
  };
  const handleDelete = async (fileId: string | undefined) => {
    if (fileId !== undefined) {
      const res = await axios.delete(`/api/payslips/delete/${fileId}`);
      if (res.status === 200) {
        setDisplayedPayslips((prev) => prev.filter((p) => p.id !== fileId));
        await fetchPayslips();
      } else {
        console.log(res);
      }
    }
  };
  const handleDeleteMany = async (ids: String[]) => {
    if (ids.length >= 1) {
      const res = await axios.delete("/api/payslips/deleteMany", {
        data: ids,
      });
      if (res.status === 200) {
        setDisplayedPayslips((prev) => prev.filter((p) => !ids.includes(p.id)));
        setSelectedRows([]);
        await fetchPayslips();
      } else {
        console.log(res);
      }
    }
  };

  function printImg(url: string) {
    const win = window.open("");
    win?.document.write(
      '<img src="' +
        url +
        '" width="100%" onload="window.print();window.close()" />'
    );
    win?.focus();
  }
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
            {departments.map((department) => {
              if (department.active)
                return (
                  <option key={department.id} value={department.id}>
                    {department.name}
                  </option>
                );
            })}
            {/* Add more status options if needed */}
          </select>
          <div>
            <PayslipSMS />
          </div>
        </div>
        <div className="flex items-center space-x-2 gap-6">
          <div className="flex items-center">
            <Dialog>
              <DialogTrigger
                disabled={selectedRows.length > 0 ? false : true}
                className="text-white py-[6px] px-4 flex items-center justify-center gap-1 uppercase rounded bg-red-700 hover:bg-[#3e0909] text-sm tracking-wider transition disabled:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <svg
                  className="w-4 h-4 text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 18 20"
                >
                  <path d="M17 4h-4V2a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v2H1a1 1 0 0 0 0 2h1v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6h1a1 1 0 1 0 0-2ZM7 2h4v2H7V2Zm1 14a1 1 0 1 1-2 0V8a1 1 0 0 1 2 0v8Zm4 0a1 1 0 0 1-2 0V8a1 1 0 0 1 2 0v8Z" />
                </svg>
                <p>حذف</p>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle className="font-IranSansBold flex justify-center">
                    از حذف فیش حقوقی های انتخاب شده مطمئنید؟
                  </DialogTitle>
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
                      onClick={() => handleDeleteMany(selectedRows)}
                      className="text-white py-2 px-4 flex flex-col items-center justify-center gap-1 uppercase rounded bg-nsgsco hover:bg-[#093e3b] text-sm tracking-wider transition"
                    >
                      بله
                    </button>
                  </DialogTrigger>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <input
            type="text"
            className="right-dir appearance-none bg-transparent border-2  border-gray-600 shadow-sm focus:shadow-md focus:border-nsgsco focus:placeholder-gray-600 placeholder:text-xs pr-3 transition  rounded-md py-2 text-gray-300 leading-tight focus:outline-none focus:ring-gray-600 focus:shadow-outline"
            placeholder="جستجو با کد ملی، نام، تاریخ..."
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
              <input
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAll}
              />
            </th>
            <th scope="col" className="px-6 py-3 text-center w-1/12">
              ردیف
            </th>
            <th scope="col" className="px-6 py-3 text-center w-1/6">
              تاریخ فیش
            </th>
            <th scope="col" className="px-6 py-3 text-center w-1/6">
              دریافت کننده
            </th>
            <th scope="col" className="px-6 py-3 text-center w-1/6">
              کارگاه
            </th>
            <th scope="col" className="px-6 py-3 text-center w-1/6">
              تاریخ ارسال
            </th>
            <th scope="col" className="px-6 py-3 text-center w-1/6">
              تاریخ مشاهده
            </th>
            <th scope="col" className="px-6 py-3 text-center w-1/6">
              عملیات
            </th>
          </tr>
        </thead>
        <tbody>
          {displayedPayslips.length > 0 ? (
            displayedPayslips.map((payslip, index) => (
              <tr
                key={payslip.id}
                className=" border-b bg-transparent border-gray-700 hover:bg-gray-600"
              >
                <td scope="row" className="px-2 py-4 text-center">
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(payslip.id)}
                    onChange={() => handleRowSelect(payslip.id)}
                  />
                </td>
                <td scope="row" className="px-2 py-4 text-center">
                  {pageSize * (page - 1) + index + 1}
                </td>
                <td
                  scope="row"
                  className=" flex justify-center items-center px-6 py-4 font-medium whitespace-nowrap text-center text-white"
                >
                  {payslip.year} - {payslip.month}
                </td>
                <td className="px-2 py-4 text-center">{payslip.user.name}</td>
                <td className="px-2 py-4 text-center">
                  {payslip.user.department.name}
                </td>
                <td className="px-6 py-4 text-center text-xs">
                  {moment(payslip.updatedAt).format("jYYYY-jMM-jDD HH:mm:ss")}
                </td>
                <td className="px-6 py-4 text-center text-xs">
                  {payslip.seen ? payslip.firstSeen : "مشاهده نشده"}
                </td>
                <td className="px-6 py-4 text-center flex gap-2">
                  <Dialog>
                    <DialogTrigger className="text-white py-2 px-4 flex flex-col items-center justify-center gap-1 uppercase rounded bg-nsgsco hover:bg-[#093e3b] text-sm tracking-wider transition">
                      مشاهده
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle dir="rtl" className="flex justify-center">
                          <div className="font-IranSansBold mx-2">
                            {payslip.user.name}
                          </div>
                          -
                          <div className="font-IranSansBold mx-2">
                            {payslip.year} - {payslip.month}
                          </div>
                        </DialogTitle>
                        <DialogDescription>
                          <Image
                            src={`/api/payslips/download/${payslip.id}`}
                            alt={payslip.id}
                            width="1654"
                            height="1166"
                            id="payslip"
                          ></Image>
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter className="flex gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            printImg(`/api/payslips/download/${payslip.id}`)
                          }
                          className="text-white py-2 px-4 flex flex-col items-center justify-center gap-1 uppercase rounded bg-nsgsco hover:bg-[#093e3b] text-sm tracking-wider transition"
                        >
                          <svg
                            className="w-5 h-5 text-white"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M5 20h10a1 1 0 0 0 1-1v-5H4v5a1 1 0 0 0 1 1Z" />
                            <path d="M18 7H2a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2v-3a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2Zm-1-2V2a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v3h14Z" />
                          </svg>
                          <p>پرینت</p>
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            handleDownload(payslip.id, payslip.filename)
                          }
                          className="text-white py-2 px-4 flex flex-col items-center justify-center gap-1 uppercase rounded bg-nsgsco hover:bg-[#093e3b] text-sm tracking-wider transition"
                        >
                          <svg
                            className="w-5 h-5 text-white"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M14.707 7.793a1 1 0 0 0-1.414 0L11 10.086V1.5a1 1 0 0 0-2 0v8.586L6.707 7.793a1 1 0 1 0-1.414 1.414l4 4a1 1 0 0 0 1.416 0l4-4a1 1 0 0 0-.002-1.414Z" />
                            <path d="M18 12h-2.55l-2.975 2.975a3.5 3.5 0 0 1-4.95 0L4.55 12H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2Zm-3 5a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z" />
                          </svg>
                          <p>دریافت</p>
                        </button>

                        <Dialog>
                          <DialogTrigger className="text-white py-2 px-4 flex flex-col items-center justify-center gap-1 uppercase rounded bg-red-700 hover:bg-[#3e0909] text-sm tracking-wider transition">
                            <svg
                              className="w-5 h-5 text-white"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="currentColor"
                              viewBox="0 0 18 20"
                            >
                              <path d="M17 4h-4V2a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v2H1a1 1 0 0 0 0 2h1v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6h1a1 1 0 1 0 0-2ZM7 2h4v2H7V2Zm1 14a1 1 0 1 1-2 0V8a1 1 0 0 1 2 0v8Zm4 0a1 1 0 0 1-2 0V8a1 1 0 0 1 2 0v8Z" />
                            </svg>
                            <p>حذف</p>
                          </DialogTrigger>
                          <DialogContent className="max-w-md">
                            <DialogHeader>
                              <DialogTitle className="font-IranSansBold flex justify-center">
                                از حذف فیش حقوقی زیر مطمئنید؟
                              </DialogTitle>
                              <DialogDescription className="flex flex-col">
                                <div>{payslip.user.name}</div>
                                <div>
                                  {payslip.year} - {payslip.month}
                                </div>
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
                                  onClick={() => handleDelete(payslip.id)}
                                  className="text-white py-2 px-4 flex flex-col items-center justify-center gap-1 uppercase rounded bg-nsgsco hover:bg-[#093e3b] text-sm tracking-wider transition"
                                >
                                  بله
                                </button>
                              </DialogTrigger>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="text-center py-4">
                فیشی موجود نیست
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

export default PayslipList;
