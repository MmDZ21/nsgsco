import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const VerificationCode = ({
  setCodeSent,
  setVerified,
  setCode,
}: {
  setCodeSent: React.Dispatch<React.SetStateAction<boolean>>;
  setVerified: React.Dispatch<React.SetStateAction<boolean>>;
  setCode: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [verificationCode, setVerificationCode] = useState("");

  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await toast.promise(
        axios.post("/api/auth/settings/update/verify", {
          code: verificationCode,
          // Add any other necessary data for verification (e.g., user ID)
        }),
        { pending: "در حال صحت سنجی..." }
      );
      if (response.status === 200) {
        toast.success("کد صحیح است", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        setVerified(true);
        setCodeSent(false);
        setCode(verificationCode);
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
    } catch (error) {
      console.error("Verification error:", error);
      // Handle the error, e.g., display an error message to the user
    }
  };

  return (
    <form className="mt-6" onSubmit={handleVerificationSubmit}>
      <div className="relative">
        <input
          required
          className="right-dir appearance-none bg-transparent border-2 pr-12 border-gray-600 shadow-sm focus:shadow-md focus:border-nsgsco focus:placeholder-gray-600  transition  rounded-md w-full py-3 text-gray-300 leading-tight focus:outline-none focus:ring-nsgsco focus:shadow-outline"
          type="text"
          value={verificationCode}
          placeholder="کد دریافتی"
          onChange={(e) => setVerificationCode(e.target.value)}
        />
        <div className="absolute right-0 inset-y-0 flex items-center">
          <svg
            className="h-7 w-7 mr-3 text-gray-400 p-1"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 18 20"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 2h4a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h4m6 0a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1m6 0v3H6V2M5 5h8m-8 5h8m-8 4h8"
            />
          </svg>
        </div>
      </div>
      <div className="flex items-center justify-center mt-8">
        <button className="text-white py-2 px-4 uppercase rounded bg-nsgsco hover:bg-[#093e3b] text-sm tracking-wider transition">
          تایید
        </button>
      </div>
    </form>
  );
};

export default VerificationCode;
