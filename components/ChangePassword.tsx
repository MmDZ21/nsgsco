"use client";

import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("currentPassword", currentPassword);
    formData.append("newPassword", newPassword);
    try {
      const response = await toast.promise(
        axios.patch("/api/auth/settings/update/changePassword", formData),
        {
          pending: "اعمال تغییرات",
          success: "کلمه عبور تغییر یافت",
          error: "ناموفق",
        }
      );

      console.log(await response.data);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <div className="text-gray-300 text-center pb-16">تغییر کلمه عبور</div>
      <form className="flex flex-col" onSubmit={handleSubmit}>
        <div className="relative">
          <input
            className="right-dir appearance-none text-sm bg-gray-800 border-2 pr-12 border-gray-600 shadow-sm focus:shadow-md focus:border-nsgsco focus:placeholder-gray-600  transition  rounded-md w-full py-3 text-gray-300 leading-tight focus:outline-none focus:ring-nsgsco focus:shadow-outline"
            id="currentPassword"
            type="password"
            placeholder="کلمه عبور فعلی"
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <div className="absolute right-0 inset-y-0 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7 mr-3 text-gray-400 p-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2H7V7a3 3 0 015.905-.75 1 1 0 001.937-.5A5.002 5.002 0 0010 2z" />
            </svg>
          </div>
        </div>
        <div className="relative mt-3">
          <input
            className="right-dir text-sm appearance-none bg-gray-800 border-2 pr-12 border-gray-600 shadow-sm focus:shadow-md focus:border-nsgsco focus:placeholder-gray-600  transition  rounded-md w-full py-3 text-gray-300 leading-tight focus:outline-none focus:ring-nsgsco focus:shadow-outline"
            id="newPassword"
            type="password"
            placeholder="کلمه عبور جدید"
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <div className="absolute right-0 inset-y-0 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7 mr-3 text-gray-400 p-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2H7V7a3 3 0 015.905-.75 1 1 0 001.937-.5A5.002 5.002 0 0010 2z" />
            </svg>
          </div>
        </div>
        <div className="flex items-center justify-center mt-8">
          <button
            type="submit"
            className="text-white py-2 px-4 md:w-full uppercase rounded bg-nsgsco hover:bg-[#093e3b] text-sm tracking-wider transition"
          >
            ثبت تغییرات
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;
