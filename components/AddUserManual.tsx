import { DepartmentModel } from "@/types/prisma";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { FormEvent, useState } from "react";
import { toast } from "react-toastify";

const AddUserManual = ({ department }: { department: DepartmentModel }) => {
  const [name, setName] = useState<string>("");
  const [isAdmin, setIsAdmin] = useState<boolean>(false); // State to handle the admin checkbox
  const [username, setUsername] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Check if both title and body are non-empty
    if (name.trim() !== "" && username.trim() !== "") {
      // Create a FormData object and append the form data (title, body, file)
      const formData = new FormData();
      formData.append("name", name);
      formData.append("departmentId", department.id);
      formData.append("username", username);
      formData.append("isAdmin", String(isAdmin));
      if (phone.trim() !== "") {
        formData.append("phone", phone);
      }
      // Send a POST request to your API endpoint (e.g., /api/tickets) with formData
      const response = await toast.promise(
        axios.post(`/api/users/new`, formData),
        {
          pending: "در حال انجام",
          success: "کاربر با موفقیت ثبت شد",
          error: "ناموفق",
        }
      );

      // Handle the response and display a success message or error
      if (response.status === 200) {
        setName("");
        setPhone("");
        setUsername("");
        setIsAdmin(false);
      }
    } else {
      // If either title or body is empty, show an error message
      toast.warn("لطفا نام یا کد ملی کاربر را به درستی وارد کنید", {
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
  return (
    <div>
      <form
        dir="rtl"
        className="flex flex-col justify-center items-center gap-5"
        onSubmit={handleSubmit}
      >
        <label className="text-white px-2 pt-4" htmlFor="name">
          نام و نام خانوادگی
        </label>
        <input
          className="bg-gray-950 bg-opacity-40 border text-sm rounded-lg p-1 w-1/2 border-gray-600 placeholder-gray-400 text-white focus:ring-nsgsco focus:border-nsgsco"
          value={name}
          onChange={(e) => setName(e.target.value)}
          type="text"
          id="name"
          required
        />
        <label className="text-white px-2 pt-4" htmlFor="username">
          کد ملی
        </label>
        <input
          className="bg-gray-950 bg-opacity-40 border text-sm rounded-lg p-1 w-1/2 border-gray-600 placeholder-gray-400 text-white focus:ring-nsgsco focus:border-nsgsco"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          type="text"
          id="username"
          required
        />
        <label className="text-white px-2 pt-4" htmlFor="phone">
          شماره تلفن
        </label>
        <input
          className="bg-gray-950 bg-opacity-40 border text-sm rounded-lg p-1 w-1/2 border-gray-600 placeholder-gray-400 text-white focus:ring-nsgsco focus:border-nsgsco"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          type="text"
          id="phone"
        />
        <div className="flex items-center px-2 pt-4">
          <label htmlFor="admin" className="text-white text-xs ml-2">
            تنظیم کاربر به عنوان مدیر
          </label>
          <input
            onChange={(e) => setIsAdmin(e.target.checked)}
            type="checkbox"
            id="admin"
          />
        </div>
        <button
          type="submit"
          className="text-white py-2 px-4 mt-2 flex flex-col items-center justify-center uppercase rounded bg-nsgsco hover:bg-[#093e3b] text-sm tracking-wider transition"
        >
          ثبت
        </button>
      </form>
    </div>
  );
};

export default AddUserManual;
