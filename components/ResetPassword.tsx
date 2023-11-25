"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-toastify";

const ResetPassword = ({
  setVerified,
  code,
}: {
  setVerified: React.Dispatch<React.SetStateAction<boolean>>;
  code: string;
}) => {
  const [password, setPassword] = useState<string>("");
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await toast.promise(
        axios.patch("/api/auth/settings/update/reset-new-password", {
          password,
          code,
          // Add any other necessary data for verification (e.g., user ID)
        }),
        {
          pending: "در حال تغییر...",
        }
      );
      // Handle the response from the API after code verification
      if (response.status === 200) {
        toast.success("با موفقیت وارد شدید!", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        setVerified(false);
        router.push("/");
      } else {
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
      }
      setPassword("");
      // Perform any necessary actions after successful verification
    } catch (error) {
      console.error("Verification error:", error);
      // Handle the error, e.g., display an error message to the user
      setPassword("");
    }
  };
  return (
    <form className="mt-6" onSubmit={handleSubmit}>
      <div className="relative">
        <input
          required
          className="right-dir appearance-none bg-transparent border-2 pr-12 border-gray-600 shadow-sm focus:shadow-md focus:border-nsgsco focus:placeholder-gray-600  transition  rounded-md w-full py-3 text-gray-300 leading-tight focus:outline-none focus:ring-nsgsco focus:shadow-outline"
          type="password"
          value={password}
          placeholder="کلمه عبور جدید"
          onChange={(e) => setPassword(e.target.value)}
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
        <button className="text-white py-2 px-4 uppercase rounded bg-nsgsco hover:bg-[#093e3b] text-sm tracking-wider transition">
          تغییر کلمه عبور
        </button>
      </div>
    </form>
  );
};

export default ResetPassword;
