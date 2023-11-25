"use client";
import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import VerificationCode from "./VerificationCode";
import Link from "next/link";
const ResetForm = ({
  setCodeSent,
}: {
  setCodeSent: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const formData = new FormData();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent the form from submitting and triggering a page reload
    formData.append("phoneNumber", phoneNumber);
    try {
      // Call the sign-in function with the provided data
      const result = await toast.promise(
        axios.patch("/api/auth/settings/update/resetPassword", formData),
        {
          pending: "در حال ارسال...",
        }
      );
      if (result.status === 200) {
        setCodeSent(true);
        toast.success(result.data, {
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
        toast.error(result.data, {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        setCodeSent(false);
      }
    } catch (error) {
      toast.error("کاربر یافت نشد", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      setCodeSent(false);
      console.error("verification error: ", error);
    }
  };

  return (
    <form className="mt-6" onSubmit={(e) => handleSubmit(e)}>
      <div className="relative">
        <input
          required
          className="right-dir appearance-none bg-transparent border-2 pr-12 border-gray-600 shadow-sm focus:shadow-md focus:border-nsgsco focus:placeholder-gray-600  transition  rounded-md w-full py-3 text-gray-300 leading-tight focus:outline-none focus:ring-nsgsco focus:shadow-outline"
          id="phone"
          type="text"
          value={phoneNumber}
          placeholder="شماره همراه"
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
        <div className="absolute right-0 inset-y-0 flex items-center">
          <svg
            className="h-7 w-7 mr-3 text-gray-400 p-1"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 14 20"
          >
            <path d="M12 0H2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2ZM7.5 17.5h-1a1 1 0 0 1 0-2h1a1 1 0 0 1 0 2ZM12 13H2V4h10v9Z" />
          </svg>
        </div>
      </div>
      <div className="flex items-center justify-center mt-8">
        <button className="text-white py-2 px-4 uppercase rounded bg-nsgsco hover:bg-[#093e3b] text-sm tracking-wider transition">
          ارسال کد تایید
        </button>
      </div>
      <div className="flex justify-center pt-6">
        <Link
          href={"/"}
          className="text-xs text-gray-400 hover:text-white cursor-pointer"
        >
          بازگشت به صفحه ورود
        </Link>
      </div>
    </form>
  );
};

export default ResetForm;
