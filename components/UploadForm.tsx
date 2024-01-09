"use client";
import React, { useContext, useState } from "react";
import axios from "axios";
import { Id, toast } from "react-toastify";
import { UserContext } from "@/context/UserContext";
import { fiveYears, persianMonths, persianYears } from "@/utils/PersianDate";

const UploadForm = () => {
  const [file, setFile] = useState<File | null>(null);
  const { fetchPayslips } = useContext(UserContext);
  const toastId = React.useRef<Id | null>(null);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setFile(selectedFile || null);
  };
  const [month, setMonth] = useState<string | undefined>(undefined);
  const [year, setYear] = useState<string | undefined>(undefined);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !month || !year) {
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    formData.append("month", month);
    formData.append("year", year);

    try {
      const response = await toast.promise(
        axios.post("/api/payslips/upload", formData),
        {
          pending: "در حال بارگزاری",
          success: "با موفقیت بارگزاری شد",
          error: "بارگزاری ناموفق",
        }
      );
      console.log(response.data);
      await fetchPayslips();
    } catch (error) {
      console.error("An error occurred while uploading the file:", error);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div className="p-8 mx-auto">
        <div className="bg-gray-950 bg-opacity-40 py-6 md:px-24 px-8 shadow-md rounded-3xl">
          <form className="mt-6" onSubmit={handleSubmit}>
            <div className="pb-4 flex justify-center">
              <p className="text-white">انتخاب تاریخ فیش</p>
            </div>
            <div className="flex flex-col md:flex-row-reverse gap-4 justify-center items-center pb-8">
              <select
                id="month"
                className="border text-center text-sm rounded-lg block md:w-1/3 p-4 bg-gray-950 bg-opacity-40 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                onChange={(e) => setMonth(e.target.value)}
                defaultValue={undefined}
              >
                {persianMonths.map((month) => (
                  <option className="bg-gray-900" value={month} key={month}>
                    {month}
                  </option>
                ))}
              </select>

              <select
                id="year"
                className="border text-center text-sm rounded-lg block md:w-1/3 p-4 bg-gray-950 bg-opacity-40 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                onChange={(e) => setYear(e.target.value)}
                defaultValue={undefined}
              >
                {fiveYears().map((year) => (
                  <option className="bg-gray-900" value={year} key={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            {/* File input */}
            <label
              className="block mb-2 text-sm font-medium text-gray-300 right-dir"
              htmlFor="file_input"
            >
              بارگزاری فایل
            </label>
            <input
              className="block my-5 w-full border rounded-lg cursor-pointer text-gray-400 focus:outline-none bg-gray-700 border-gray-600 placeholder-gray-400"
              aria-describedby="file_input_help"
              id="file_input"
              type="file"
              onChange={handleFileChange}
            />
            <p
              className="mt-1 text-sm text-gray-300 right-dir"
              id="file_input_help"
            >
              فقط فایل فشرده با فرمت zip.
            </p>

            <div className="flex items-center justify-center mt-8">
              <button
                type="submit"
                className="text-white py-2 px-4 rounded bg-nsgsco  hover:bg-[#093e3b] text-sm tracking-wider transition"
              >
                بارگزاری
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UploadForm;
