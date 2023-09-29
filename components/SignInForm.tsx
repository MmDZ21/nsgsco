"use client";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";
import logo from "@/public/assets/img/nsgsco-logo.png";
import { toast } from "react-toastify";
const SignInForm = () => {
  const [data, setData] = useState({
    username: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent the form from submitting and triggering a page reload

    try {
      // Call the sign-in function with the provided data
      const result = await toast.promise(
        signIn("credentials", {
          redirect: false,
          // Prevent automatic redirect after sign-in
          ...data, // Include the username and password in the request
        }),
        {
          pending: "ورود...",
        }
      );
      if (result?.ok) {
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
      } else {
        toast.error(result?.error, {
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
      console.error("Sign-in error:", error);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="p-8 mx-auto">
        <div className="bg-gray-700 rounded-t-lg p-8">
          <p className="flex justify-center">
            <Image priority width={500} src={logo} alt="نیرو صنعت گستر شرق" />
          </p>
        </div>
        <div className="bg-gray-800 rounded-b-lg py-6 px-24">
          <p className="text-center text-sm text-gray-400 font-light">
            ورود به حساب کاربری
          </p>
          <form className="mt-6" onSubmit={(e) => handleSubmit(e)}>
            <div className="relative">
              <input
                className="right-dir appearance-none bg-gray-800 border-2 pr-12 border-gray-600 shadow-sm focus:shadow-md focus:border-nsgsco focus:placeholder-gray-600  transition  rounded-md w-full py-3 text-gray-300 leading-tight focus:outline-none focus:ring-nsgsco focus:shadow-outline"
                id="username"
                type="text"
                value={data.username}
                placeholder="نام کاربری"
                onChange={(e) => setData({ ...data, username: e.target.value })}
              />
              <div className="absolute right-0 inset-y-0 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7 mr-3 text-gray-400 p-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </div>
            </div>
            <div className="relative mt-3">
              <input
                className="right-dir appearance-none bg-gray-800 border-2 pr-12 border-gray-600 shadow-sm focus:shadow-md focus:border-nsgsco focus:placeholder-gray-600  transition  rounded-md w-full py-3 text-gray-300 leading-tight focus:outline-none focus:ring-nsgsco focus:shadow-outline"
                id="password"
                type="password"
                value={data.password}
                placeholder="کلمه عبور"
                onChange={(e) => setData({ ...data, password: e.target.value })}
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
                ورود
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignInForm;
