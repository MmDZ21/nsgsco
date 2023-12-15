"use client";
import React, { FormEvent, useContext, useState } from "react";
import { DepartmentModel } from "@/types/prisma";
import { UserContext } from "@/context/UserContext";
import { toast } from "react-toastify";
import axios from "axios";
import { useRouter } from "next/navigation";
const EditDepartment = ({ department }: { department: DepartmentModel }) => {
  const [name, setName] = useState<string>(department.name);
  const [active, setActive] = useState<boolean>(department.active);
  const { fetchDepartments } = useContext(UserContext);
  const router = useRouter();
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Check if both title and body are non-empty
    if (name.trim() !== "") {
      // Create a FormData object and append the form data (title, body, file)
      const formData = new FormData();
      formData.append("name", name);
      formData.append("id", department.id);
      formData.append("active", active ? "active" : "inactive");
      // Send a POST request to your API endpoint (e.g., /api/tickets) with formData
      const response = await toast.promise(
        axios.patch(`/api/departments/update`, formData),
        {
          pending: "در حال انجام",
          success: "کارگاه با موفقیت به روزرسانی شد ",
          error: "ناموفق",
        }
      );

      // Handle the response and display a success message or error
      if (response.status === 201) {
        await fetchDepartments();
        router.push("/dashboard/admin/departments");
      }
    } else {
      // If either title or body is empty, show an error message
      toast.warn("نام کارگاه را وارد کنید", {
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
    <form
      dir="rtl"
      className="flex flex-col justify-center items-center gap-5"
      onSubmit={handleSubmit}
    >
      <label className="text-white px-2 pt-4" htmlFor="name">
        نام کارگاه:
      </label>
      <input
        className="bg-gray-950 bg-opacity-40 border text-sm rounded-lg p-1 w-1/2 border-gray-600 placeholder-gray-400 text-white focus:ring-nsgsco focus:border-nsgsco"
        value={name}
        onChange={(e) => setName(e.target.value)}
        type="text"
        id="name"
        required
      />
      <label htmlFor="active" className="text-white px-2 pt-4">
        وضعیت کارگاه:
      </label>
      <select
        className="border text-sm rounded-lg p-1 bg-gray-950 bg-opacity-40 border-gray-600 placeholder-gray-400 text-white focus:ring-nsgsco focus:border-nsgsco"
        id="active"
        defaultValue={active === true ? "active" : "inactive"}
        onChange={(e) => {
          e.target.value === "active" ? setActive(true) : setActive(false);
        }}
      >
        <option className="bg-gray-900" value="active">
          فعال
        </option>
        <option className="bg-gray-900" value="inactive">
          غیرفعال
        </option>
      </select>
      <button
        type="submit"
        className="text-white py-2 px-4 mt-2 flex flex-col items-center justify-center uppercase rounded bg-nsgsco hover:bg-[#093e3b] text-sm tracking-wider transition"
      >
        ثبت
      </button>
    </form>
  );
};

export default EditDepartment;
