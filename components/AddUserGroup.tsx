"use client";
import { DepartmentModel } from "@/types/prisma";
import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { read, utils } from "xlsx";

interface FinalData {
  name: string;
  username: string;
  phone: string;
}
const AddUserGroup = ({ department }: { department: DepartmentModel }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [data, setData] = useState<any[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [name, setName] = useState<string>("none");
  const [username, setUsername] = useState<string>("none");
  const [phone, setPhone] = useState<string>("none");

  const handleFileUpload = async (file: File) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const fileContent = event.target?.result as string;

      if (fileContent) {
        // Use xlsx library to parse Excel data to JSON
        const workbook = read(fileContent, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const excelData = utils.sheet_to_json(worksheet, { header: 0 });
        // Filter out rows with all empty or null values
        const filteredData = excelData.filter((row: any) =>
          Object.values(row).some((value) => value !== null && value !== "")
        );

        setData(filteredData);
        if (filteredData.length > 0) {
          const obj = filteredData[0] as object;
          const headers = Object.keys(obj);

          setHeaders(headers);
          setLoading(false);
          setLoaded(true);
          // Implement logic for further processing or display
        } else {
          // No valid data found
          setLoading(false);
          setLoaded(false);
        }
        // Implement logic for further processing or display
      }
    };

    reader.readAsBinaryString(file);
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setLoading(true);
      handleFileUpload(e.target.files[0]);
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (name !== "none" && username !== "none") {
      const users: FinalData[] = data.map((user) => {
        return {
          name: user[name],
          username: user[username],
          phone: phone !== "none" ? user[phone] : null,
        };
      });
      console.log(users);
      const response = await toast.promise(
        axios.post(`/api/users/newGroup`, {
          users,
          departmentId: department.id,
        }),
        {
          pending: "در حال انجام",
          success: "کاربران با موفقیت ثبت شدند",
        }
      );
      console.log("response: ", response.data);
      // Handle the response and display a success message or error
      if (response.status == 200) {
        setName("");
        setPhone("");
        setUsername("");
        setData([]);
        setHeaders([]);
      } else if (response.status == 400) {
        toast.error(response.data, {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        setName("");
        setPhone("");
        setUsername("");
        setData([]);
        setHeaders([]);
      }
    }
  };
  return (
    <div className="flex flex-col gap-6">
      <div dir="rtl" className="flex flex-col gap-4">
        <label
          className="block text-sm font-medium text-gray-300"
          htmlFor="file_input"
        >
          بارگزاری فایل اکسل
        </label>
        <input
          className="block border w-1/3 rounded-lg cursor-pointer text-gray-400 focus:outline-none bg-gray-700 border-gray-600 placeholder-gray-400"
          id="xlsx"
          type="file"
          accept=".xlsx"
          onChange={handleInputChange}
        />
      </div>
      <div className="bg-gray-950 bg-opacity-40 py-6 md:px-24 px-8 shadow-md rounded-3xl">
        {loaded ? (
          <form
            className="flex flex-col gap-6"
            dir="rtl"
            onSubmit={handleSubmit}
          >
            <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
              <div
                id="select-name"
                className="flex flex-col gap-3 justify-center items-center"
              >
                <label className="text-white text-sm" htmlFor="name">
                  نام
                </label>
                <select
                  className="border text-center p-1 text-sm rounded-lg block bg-gray-950 bg-opacity-40 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                  id="name"
                  onChange={(e) => setName(e.target.value)}
                  required
                  defaultValue="none"
                >
                  <option className="bg-gray-950" value="none">
                    انتخاب
                  </option>
                  {headers.map((header) => (
                    <option className="bg-gray-950" key={header} value={header}>
                      {header}
                    </option>
                  ))}
                </select>
              </div>
              <div
                id="select-username"
                className="flex flex-col gap-3 justify-center items-center"
              >
                <label className="text-white text-sm" htmlFor="username">
                  کد ملی
                </label>
                <select
                  className="border p-1 text-center text-sm rounded-lg block bg-gray-950 bg-opacity-40 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                  id="username"
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  defaultValue="none"
                >
                  <option className="bg-gray-950" value="none">
                    انتخاب
                  </option>
                  {headers.map((header) => (
                    <option className="bg-gray-950" key={header} value={header}>
                      {header}
                    </option>
                  ))}
                </select>
              </div>
              <div
                id="select-phone"
                className="flex flex-col gap-3 justify-center items-center"
              >
                <label className="text-white text-sm" htmlFor="phone">
                  تلفن
                </label>
                <select
                  className="border text-center p-1 text-sm rounded-lg block  bg-gray-950 bg-opacity-40 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                  id="phone"
                  onChange={(e) => setPhone(e.target.value)}
                  defaultValue="none"
                >
                  <option className="bg-gray-950" value="none">
                    انتخاب
                  </option>
                  {headers.map((header) => (
                    <option className="bg-gray-950" key={header} value={header}>
                      {header}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex justify-center items-center">
              <button
                type="submit"
                className="text-white h-10 px-2 rounded bg-nsgsco  hover:bg-[#093e3b] text-sm tracking-wider transition"
              >
                ثبت کاربر
              </button>
            </div>
          </form>
        ) : loading ? (
          <div>
            <p className="text-gray-400 text-center">در حال پردازش...</p>
          </div>
        ) : (
          <div>
            <p className="text-gray-400 text-center">محتوایی یافت نشد</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddUserGroup;
